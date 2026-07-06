// Vercel Serverless Function — Gemini로 PRD-lite 검증 질문 생성
// 키는 Vercel 환경변수 GEMINI_API_KEY로만 주입 (클라이언트 노출 금지)

export const config = { maxDuration: 15 }

const FALLBACK_QUESTIONS = [
  '수행수준(가/나/다)별로 활동이 어떻게 달라지나요?',
  '조작 요소(버튼·드래그)가 소근육이 약한 학생도 가능한 크기와 방식인가요?',
  '글을 읽지 못하는 학생도 그림만 보고 이해할 수 있나요?',
  '성공/실패 피드백이 즉각적이고 긍정적인가요?',
  '이 자료는 7/14 영화관람의 어느 단계(사전/당일/사후)에 쓰이나요?',
]

const SYSTEM_PROMPT = `너는 특수교육 수업 자료 기획을 검증하는 코치다. 교사가 작성한 PRD(수업 자료 기획서)를 읽고, 더 나은 자료가 되도록 돕는 **질문만** 3~5개 던져라.

절대 규칙:
- 답이나 수정안을 제공하지 마라. 오직 질문만.
- 특수교육 교정 관점으로 질문하라:
  1. 수행수준(가/나/다)별 활동 차별화
  2. 소근육이 약한 학생의 조작 가능성 (버튼 크기, 조작 방식)
  3. 글을 읽지 못하는 학생의 그림 기반 이해
  4. 즉각적이고 긍정적인 성공/실패 피드백
  5. 7/14 영화관람(사전/당일/사후) 중 사용 단계
- PRD에 이미 잘 답변된 관점은 건너뛰고, 빠졌거나 약한 부분을 찔러라.
- 각 질문은 한국어 한 문장, 존댓말.

반드시 아래 JSON 형식으로만 응답하라:
{"questions": ["질문1", "질문2", "질문3"]}`

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ error: 'POST only' }, 405)
  }

  let prd = ''
  try {
    const body = await req.json()
    prd = String(body.prd ?? '').slice(0, 8000)
  } catch {
    return json({ error: 'invalid body' }, 400)
  }
  if (prd.trim().length < 20) {
    return json({ error: 'PRD가 너무 짧아요. 조금 더 작성해 주세요.' }, 400)
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return json({ questions: FALLBACK_QUESTIONS, fallback: true })
  }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: prd }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      },
    )
    clearTimeout(timer)

    if (!res.ok) throw new Error(`gemini ${res.status}`)
    const data = await res.json()
    const text: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    const parsed = JSON.parse(text)
    const questions: string[] = Array.isArray(parsed?.questions)
      ? parsed.questions.filter((q: unknown) => typeof q === 'string').slice(0, 5)
      : []
    if (questions.length < 3) throw new Error('too few questions')
    return json({ questions })
  } catch {
    // 장애 시 정적 폴백 — 연수가 API에 인질 잡히지 않도록
    return json({ questions: FALLBACK_QUESTIONS, fallback: true })
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
