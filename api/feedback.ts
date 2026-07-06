// Vercel Serverless Function — PRD·제출 스펙에 대한 Gemini 자동 피드백
// Grill Me와 달리 여기는 질문이 아니라 실제 피드백(칭찬 1 + 제안 1)을 준다.
// 강사가 대시보드에서 이 피드백을 검수·수정할 수 있다 (teacher-in-the-loop).

export const config = { maxDuration: 15 }

const FALLBACK_FEEDBACK: Record<'prd' | 'spec', string> = {
  prd: 'PRD를 잘 정리해 주셨어요! 수행수준(가/나/다)별로 활동이 어떻게 달라지는지, 그리고 그림·큰 버튼 같은 접근성 요소를 조금 더 구체적으로 적으면 더 좋아질 거예요.',
  spec: '완성도 있는 결과물이네요! 다음 버전에서는 성공/실패 피드백을 더 즉각적이고 긍정적으로 다듬어보면 좋겠어요.',
}

const SYSTEM_PROMPTS: Record<'prd' | 'spec', string> = {
  prd: `너는 특수교육 수업 자료 기획(PRD)을 검토하는 코치다. 아래 PRD를 읽고 2~4문장으로 피드백을 써라.
- 잘한 점 1가지를 먼저 구체적으로 칭찬하라.
- 보완하면 좋을 점 1가지를 제안하라 (수행수준별 차이, 접근성 요소 등 관점).
- 따뜻하고 격려하는 어조, 한국어 존댓말.
- 질문이 아니라 실제 피드백 문장으로 답하라.`,
  spec: `너는 특수교육 수업 자료의 최종 제출 내용(대상 학생, 핵심 기능, 자랑할 점, 아쉬운 점)을 검토하는 코치다. 아래 내용을 읽고 2~4문장으로 피드백을 써라.
- 접근성(수행수준 구분, 큰 버튼, 그림 중심, 즉각적 피드백) 관점에서 잘한 점 1가지를 칭찬하라.
- 다음 버전에서 보완하면 좋을 점 1가지를 제안하라.
- 따뜻하고 격려하는 어조, 한국어 존댓말.
- 질문이 아니라 실제 피드백 문장으로 답하라.`,
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405)

  let kind: 'prd' | 'spec'
  let text = ''
  try {
    const body = await req.json()
    kind = body.kind === 'spec' ? 'spec' : 'prd'
    text = String(body.text ?? '').slice(0, 6000)
  } catch {
    return json({ error: 'invalid body' }, 400)
  }
  if (text.trim().length < 10) {
    return json({ feedback: FALLBACK_FEEDBACK[kind], fallback: true })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return json({ feedback: FALLBACK_FEEDBACK[kind], fallback: true })

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPTS[kind] }] },
          contents: [{ role: 'user', parts: [{ text }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 400 },
        }),
      },
    )
    clearTimeout(timer)
    if (!res.ok) throw new Error(`gemini ${res.status}`)
    const data = await res.json()
    const feedback: string = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ''
    if (!feedback) throw new Error('empty feedback')
    return json({ feedback })
  } catch {
    return json({ feedback: FALLBACK_FEEDBACK[kind], fallback: true })
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
