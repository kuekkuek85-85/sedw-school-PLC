export interface Stage {
  id: string
  session: '1차시' | '2차시'
  emoji: string
  title: string
  body: string[]
  term?: { name: string; desc: string }
}

// 강사가 대시보드에서 순서대로 켜는 설명 슬라이드.
// 참가자 화면에는 전체화면으로 강제 표시된다 (config/app.activeStage 구독).
export const STAGES: Stage[] = [
  {
    id: 'welcome',
    session: '1차시',
    emoji: '🎬',
    title: '오늘 연수, 이렇게 진행돼요',
    body: [
      '포털 구경 → 4컷 만화 실습 → Codex 예고편 → 트랙 배정 (1차시)',
      'PRD-lite → Grill Me → 빌드 → 배포·제출 → 갤러리 워크 (2차시)',
      '이 화면이 강사가 다음 단계로 넘어갈 때마다 자동으로 떠요. 확인했으면 아래 버튼을 눌러 주세요.',
    ],
  },
  {
    id: 'comic',
    session: '1차시',
    emoji: '🎨',
    title: '4컷 만화 만들기 실습을 시작해요',
    body: [
      '미션 탭 맨 위에 있는 "1차시 실습" 섹션에서 공통 시드 이미지를 다운로드하세요.',
      'ChatGPT에 이미지를 첨부하고 프롬프트를 복사해 붙여넣으면 4컷 만화가 완성돼요.',
      '완성한 만화는 포털 상단의 "💬 ChatGPT 그룹 채팅방"에 공유해 주세요.',
    ],
  },
  {
    id: 'codex-preview',
    session: '1차시',
    emoji: '🖥️',
    title: '잠시 후 Codex를 써 볼 거예요',
    body: [
      'Codex는 ChatGPT의 코딩 전문 도구예요. 2차시에 실제 앱을 만들 때 사용합니다.',
      '유료 플랜(Plus 이상)이 필요해요 — 지금 확인해 주세요.',
      '설치 방법은 가이드 탭 "2. Codex 설치하기"에 있어요.',
    ],
    term: {
      name: 'Codex',
      desc: 'ChatGPT 안에서 실제로 동작하는 코드를 작성해 주는 개발자 도구예요.',
    },
  },
  {
    id: 'track-assign',
    session: '1차시',
    emoji: '🗺️',
    title: '트랙을 배정해 드릴게요',
    body: [
      '📄 웹 활동지 트랙 (입문) — 코딩 경험이 없어도 괜찮아요.',
      '🖌 캔버스 앱 트랙 (중급) — ChatGPT 캔버스로 단일 HTML 앱을 만들어요.',
      '🎮 Codex 트랙 (상급) — Codex로 본격적인 앱을 만들어요.',
      '어느 트랙이든 결과물은 같아요: HTML → Vercel 배포 → URL 제출!',
    ],
  },
  {
    id: 'prd-lite',
    session: '2차시',
    emoji: '📋',
    title: '먼저 PRD-lite부터 써 볼게요 (8분)',
    body: [
      '미션 탭의 "1단계" 템플릿을 복사해 ChatGPT에 붙여넣으세요.',
      'ChatGPT가 인터뷰하듯 물어보고, 답을 모아 한 장짜리 기획서로 정리해 줍니다.',
      '완성되면 다음 단계인 🔥 Grill Me에서 검증받으세요.',
    ],
    term: {
      name: 'PRD-lite',
      desc: '수업 자료를 만들기 전에 "누구를 위해, 무엇을, 어떻게 만들지" 한 장으로 정리하는 간단 기획서예요.',
    },
  },
  {
    id: 'grill-me',
    session: '2차시',
    emoji: '🔥',
    title: 'Grill Me로 PRD를 검증해요 (5분)',
    body: [
      '🔥 Grill Me 탭에 방금 만든 PRD-lite를 붙여넣고 "내 PRD 구워줘"를 눌러 주세요.',
      'AI는 답을 주지 않고 특수교육 관점의 질문만 3~5개 던집니다 — 생각은 선생님의 몫이에요.',
      '질문을 참고해 PRD를 다듬은 뒤 "질문을 반영했습니다" 버튼을 누르면 1회전 통과!',
    ],
    term: {
      name: 'Grill Me',
      desc: '만든 기획서(PRD)를 AI가 질문으로 "구워보며" 빈틈을 찾아주는 검증 단계예요. 정답을 알려주지 않고 질문만 합니다.',
    },
  },
  {
    id: 'build',
    session: '2차시',
    emoji: '🛠️',
    title: '이제 직접 만들어 볼 시간이에요 (19분)',
    body: [
      '미션 탭 "2단계"에서 내 트랙의 프롬프트를 복사해 ChatGPT/Codex에 붙여넣으세요.',
      '강사 v0.1을 고쳐도 좋고, 완전히 새로운 아이디어로 시작해도 좋습니다.',
      '막히면 화면 우측 상단 🔴 신호등을 눌러 주세요 — 바로 도와드릴게요.',
    ],
  },
  {
    id: 'deploy-submit',
    session: '2차시',
    emoji: '🚀',
    title: '배포하고 제출해요 (8분)',
    body: [
      '가이드 탭 "1. Vercel 배포하기"를 따라 완성한 HTML을 배포하세요.',
      '생긴 URL(https://...vercel.app)을 복사해 📮 제출 탭에 붙여넣으세요.',
      '제출 폼 작성이 곧 오늘의 성찰 활동이에요 — 자랑할 점과 아쉬운 점도 꼭 적어 주세요.',
    ],
  },
  {
    id: 'gallery-walk',
    session: '2차시',
    emoji: '🖼️',
    title: '갤러리 워크를 시작할게요 (10분)',
    body: [
      '🖼️ 갤러리 탭에서 동료 2명의 작품을 열어 보세요.',
      '각 작품에 댓글을 남겨 주세요 — "좋은 점 1가지 + 제안 1가지".',
      '잠시 후 발표 모드로 화면을 전환해 함께 감상하겠습니다.',
    ],
  },
]

export const STAGE_IDS = STAGES.map((s) => s.id)
