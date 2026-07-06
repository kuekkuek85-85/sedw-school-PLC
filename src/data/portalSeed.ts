export interface PortalItem {
  id: string
  title: string
  subject: string
  description: string
  url: string
  sourceBadge: 'done' | 'draft'
  sourceName: string
  typeBadge: 'app' | 'worksheet'
  order: number
}

// PRD 5.2 시드 데이터 — 외부 URL(Canva·아티팩트·패들렛)은 배포 전 실제 링크로 교체
export const PORTAL_SEED: PortalItem[] = [
  {
    id: 'seed-kiosk',
    title: '영화관 이용하기 키오스크',
    subject: '수학',
    description: '좌석 선택 → 간식 담기 → 예산 관리 → 결제까지, 세로식 덧셈·뺄셈과 화폐 계산을 한 번에',
    url: '/apps/kiosk/',
    sourceBadge: 'done',
    sourceName: '김민섭',
    typeBadge: 'app',
    order: 1,
  },
  {
    id: 'seed-booking',
    title: '영화 예매 연습',
    subject: '수학',
    description: '영화 → 인원 → 자리 → 확인, 1씩 증가하는 규칙 찾기와 연결한 예매 연습 앱',
    url: '/apps/booking/',
    sourceBadge: 'done',
    sourceName: '이다혜',
    typeBadge: 'app',
    order: 2,
  },
  {
    id: 'seed-canva-kiosk',
    title: '영화관 좌석 키오스크 (Canva)',
    subject: '수학',
    description: 'Canva로 만든 좌석 선택 키오스크',
    url: 'https://어울림.my.canva.site/ccq33zzsjbeggv0x',
    sourceBadge: 'done',
    sourceName: '현주샘',
    typeBadge: 'app',
    order: 3,
  },
  {
    id: 'seed-etiquette',
    title: '관람예절 인터랙티브',
    subject: '과학·정보',
    description: '영화관에서 지켜야 할 예절을 직접 골라보는 인터랙티브 활동',
    url: 'https://claude.ai/public/artifacts/8a4651dd-99ec-4839-a2ed-a2dac7d1ff98',
    sourceBadge: 'done',
    sourceName: '현주샘',
    typeBadge: 'app',
    order: 4,
  },
  {
    id: 'seed-transit',
    title: '대중교통으로 영화관 가기',
    subject: '사회',
    description: '네이버 지도로 아리랑시네센터 가는 길 알아보기 (패들렛 게시물)',
    url: 'https://padlet.com/jjudy7428/26-7-6-15-tutpgslnhc40utq3',
    sourceBadge: 'done',
    sourceName: '정유진',
    typeBadge: 'worksheet',
    order: 5,
  },
  {
    id: 'seed-comic',
    title: '영화관 이용 순서 4컷 만화',
    subject: '일상생활(자립)',
    description: '영화관 이용 순서를 4컷 만화로 — 인쇄 가능한 활동지 (1차시 실습 예시)',
    url: '/apps/comic-4cut/',
    sourceBadge: 'draft',
    sourceName: '강사',
    typeBadge: 'worksheet',
    order: 6,
  },
  {
    id: 'seed-sequence',
    title: '4컷 순서 맞추기',
    subject: '일상생활(자립)',
    description: '섞인 4컷을 순서대로 맞추는 게임 — 여러분이 만든 만화가 수업 앱이 됩니다!',
    url: '/apps/sequence/',
    sourceBadge: 'draft',
    sourceName: '강사',
    typeBadge: 'app',
    order: 7,
  },
  {
    id: 'seed-match',
    title: '토이스토리 캐릭터·성격 매칭',
    subject: '국어',
    description: '캐릭터와 성격을 짝지어 보는 카드 게임 — 오늘 함께 완성해요',
    url: '/apps/match/',
    sourceBadge: 'draft',
    sourceName: '아이디어: 현주샘',
    typeBadge: 'app',
    order: 8,
  },
  {
    id: 'seed-jobs',
    title: '영화관 직업 맞추기 퀴즈',
    subject: '진로와직업',
    description: '영화관에서 일하는 사람들을 알아보는 퀴즈 — 오늘 함께 완성해요',
    url: '/apps/jobs/',
    sourceBadge: 'draft',
    sourceName: '아이디어: 현주샘',
    typeBadge: 'app',
    order: 9,
  },
]
