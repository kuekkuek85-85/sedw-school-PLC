import { useState, type ReactNode } from 'react'
import CopyBlock from '../components/CopyBlock'
import {
  PRD_LITE_TEMPLATE,
  WORKSHEET_TEMPLATE,
  CANVAS_APP_TEMPLATE,
  CODEX_TEMPLATE,
  COMIC_TEMPLATE,
} from '../data/templates'

function Accordion({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-2xl border border-cinema-100 bg-white shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-4 text-left font-display text-lg font-bold text-gray-800 hover:bg-cinema-50"
      >
        {title}
        <span className={`text-cinema-500 transition ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && <div className="space-y-3 border-t border-cinema-50 px-6 py-5 text-gray-700">{children}</div>}
    </div>
  )
}

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cinema-500 text-sm font-bold text-white">
        {n}
      </span>
      <p className="pt-0.5">{children}</p>
    </div>
  )
}

export default function Guide() {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-cinema-900">📖 셀프서브 가이드</h1>
        <p className="mt-2 text-lg text-gray-600">
          연수 중에도, 연수 후에도 필요할 때 꺼내 보는 부록입니다.
        </p>
      </div>

      <Accordion title="1. Vercel 배포하기 (HTML 파일 → 내 URL)">
        <Step n={1}>
          <a href="https://vercel.com/signup" target="_blank" rel="noreferrer" className="font-bold text-cinema-600 underline">vercel.com/signup</a>
          에서 가입합니다. <b>"Continue with Email"</b>을 추천해요 — GitHub 연동 분기로 들어가면 화면이 복잡해집니다.
        </Step>
        <Step n={2}>완성한 HTML 파일 이름을 <code className="rounded bg-gray-100 px-1">index.html</code>로 바꾸고, 폴더 하나에 넣습니다.</Step>
        <Step n={3}>Vercel 대시보드에서 <b>Add New… → Project</b>를 누르면 나오는 화면 아래쪽, 폴더를 끌어다 놓는 영역에 방금 만든 폴더를 드래그합니다.</Step>
        <Step n={4}><b>Deploy</b> 버튼을 누르고 잠시 기다리면 <code className="rounded bg-gray-100 px-1">https://프로젝트명.vercel.app</code> 주소가 생깁니다. 이게 여러분의 URL!</Step>
        <Step n={5}>주소를 복사해 이 플랫폼의 <b>📮 제출</b> 탭에 붙여넣으세요.</Step>
        <div className="mt-2 rounded-xl bg-amber-50 p-4">
          <b>🛟 백업 경로 — Netlify Drop:</b> Vercel이 안 되면{' '}
          <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="font-bold text-cinema-600 underline">app.netlify.com/drop</a>
          에 접속해 폴더를 드래그앤드롭만 하면 즉시 URL이 나옵니다. 가입도 로그인 없이 가능해요.
        </div>
      </Accordion>

      <Accordion title="2. Codex 설치하기">
        <Step n={1}>ChatGPT 웹(chatgpt.com)에 로그인합니다. <b>유료 플랜(Plus 이상)</b>이 필요해요.</Step>
        <Step n={2}>좌측 하단 프로필 → <b>Codex 받기</b>를 클릭합니다.</Step>
        <p className="mt-2 font-bold">클론코딩 프롬프트 예시:</p>
        <CopyBlock text={`이 HTML 파일과 같은 구조·같은 조작 방식의 앱을 만들어 줘. 주제만 '영화관 매점에서 간식 고르기'로 바꾸고, 나머지 접근성(큰 버튼, 큰 글씨, 한글 UI)은 그대로 유지해 줘. 단일 index.html로.`} />
      </Accordion>

      <Accordion title="3. 학습지원 소프트웨어 등록">
        <a
          href="https://eduzipregistration.vercel.app/"
          target="_blank"
          rel="noreferrer"
          className="font-bold text-cinema-600 underline"
        >
          https://eduzipregistration.vercel.app/
        </a>
      </Accordion>

      <Accordion title="4. Sheets에서 Gemini로 표 만들기">
        <Step n={1}>Google Sheets를 열고 우측 상단 <b>✦ Gemini</b> 버튼을 누릅니다.</Step>
        <Step n={2}>"우리 반 7/14 영화관람 준비물 체크리스트 표를 만들어 줘"처럼 요청하면 표를 만들어 줍니다.</Step>
        <Step n={3}>만들어진 표를 검토하고 <b>삽입</b>을 누르면 시트에 들어갑니다.</Step>
        <p className="rounded-xl bg-amber-50 p-4">
          ⚠️ 이 기능은 <b>학교/유료 Workspace 계정</b>에서 사용할 수 있어요. 개인 무료 계정에서는 버튼이 보이지 않을 수 있습니다.
        </p>
      </Accordion>

      <Accordion title="5. Stitch → 웹앱 연계">
        <p>
          <a href="https://stitch.withgoogle.com" target="_blank" rel="noreferrer" className="font-bold text-cinema-600 underline">Stitch</a>
          (Google)는 말로 화면 디자인을 만들어 주는 도구입니다.
        </p>
        <Step n={1}>Stitch에 "특수학교 학생용 영화 예매 연습 앱 화면, 큰 버튼, 밝은 색"처럼 요청해 화면 시안을 만듭니다.</Step>
        <Step n={2}>마음에 드는 시안에서 <b>HTML/코드 내보내기</b>를 요청합니다.</Step>
        <Step n={3}>받은 HTML을 ChatGPT 캔버스나 Codex에 붙여넣고 "이 디자인에 동작을 붙여 줘"라고 하면 실제 앱이 됩니다.</Step>
      </Accordion>

      <Accordion title="6. 프롬프트 템플릿 모음">
        <p className="font-bold">🎨 4컷 만화</p>
        <CopyBlock text={COMIC_TEMPLATE} />
        <p className="mt-4 font-bold">📄 웹 활동지</p>
        <CopyBlock text={WORKSHEET_TEMPLATE} />
        <p className="mt-4 font-bold">🖌 캔버스 앱</p>
        <CopyBlock text={CANVAS_APP_TEMPLATE} />
        <p className="mt-4 font-bold">🎮 Codex</p>
        <CopyBlock text={CODEX_TEMPLATE} />
        <p className="mt-4 font-bold">📋 PRD-lite</p>
        <CopyBlock text={PRD_LITE_TEMPLATE} />
      </Accordion>
    </div>
  )
}
