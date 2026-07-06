# 다원 어울림시네마 AI 연수 플랫폼

서울다원학교 교원학습공동체 연수(2026-07-08)용 단일 플랫폼.
연수의 시작(입장)부터 갤러리 워크(발표)까지 한 화면에서 관리합니다.

## 배포 전 체크리스트 (D-1 오늘 저녁)

### 1. Firebase 콘솔 설정 (필수!)

1. **Anonymous Auth 활성화**: Firebase 콘솔 → Authentication → Sign-in method → **익명** 사용 설정
2. **Firestore 생성**: Firebase 콘솔 → Firestore Database → 데이터베이스 만들기 (서울 리전 `asia-northeast3` 권장)
3. **보안 규칙 적용**: Firestore → 규칙 탭에 `firestore.rules` 파일 내용을 붙여넣고 게시
   - ⚠️ 주신 규칙(`.read/.write: false`)은 **Realtime Database** 규칙입니다. 이 프로젝트는 Firestore를 사용하므로 Realtime DB는 그대로 잠가두면 됩니다.

### 2. Gemini API 키

- ⚠️ **대화에 노출된 키는 폐기하고 재발급** (Google AI Studio)
- 재발급한 키에 API 제한(Generative Language API만) 설정 권장
- Vercel 프로젝트 → Settings → Environment Variables에 `GEMINI_API_KEY` 등록 (서버 전용, 클라이언트 노출 없음)
- 키가 없어도 Grill Me는 정적 폴백 질문 5종으로 동작합니다

### 3. Vercel 배포

```bash
cd dawon-cinema-platform
npm install
npm run build        # 로컬 확인
npx vercel --prod    # 또는 Vercel 대시보드에서 폴더 임포트
```

- 환경변수(선택): `VITE_ENTRY_CODE`(기본 DAWON1), `VITE_INSTRUCTOR_CODE`(기본 DAWON-T)
- 배포 후 **휴대폰 LTE로 접속 테스트 필수** (학교 와이파이 차단 대비)

### 4. 재호스팅 파일 2건

- `public/apps/kiosk/index.html` ← 김민섭 선생님 `movie_kiosk_v9.html` (파일명을 index.html로)
- `public/apps/booking/index.html` ← 이다혜 선생님 `movie_ticket_booking_practice.html`
- 원저작자 양해 후 교체. 미확보 시 현재 플레이스홀더가 안내 문구를 표시합니다.

### 5. QR 2종 인쇄

1. 플랫폼 입장 QR (배포 URL)
2. ChatGPT 그룹 채팅방 QR

## 구조

```
/            포털 (어울림시네마 디지털 자료실)
/missions    미션 카드 허브 (3트랙 + PRD-lite + 4컷 만화 템플릿)
/grill       Grill Me (Gemini 질문 생성, 폴백 내장)
/submit      제출 폼 (= 성찰 활동, 슬라이드 데이터 원천)
/gallery     갤러리 (실시간, 이모지 반응 + 댓글)
/gallery/present  발표 모드 (제출물당 슬라이드 4장 자동 생성, 프로젝터용)
/guide       셀프서브 가이드 (Vercel·Codex·학습지원SW 등)
/instructor  강사 대시보드 (강사 코드 입장 시, 신호등 스트림 + 제출 현황)
/apps/*      정적 서브 앱 (comic-4cut, sequence, kiosk, booking, match, jobs)
```

## 입장 코드

- 참가자: `DAWON1` / 강사: `DAWON-T` (환경변수로 변경 가능 — QR 인쇄 전 확정)

## 기술 스택

Vite + React + TypeScript + Tailwind / Firebase (Firestore + Anonymous Auth) /
Vercel Serverless Function(`/api/grill`) + Gemini 2.5 Flash / Vercel 배포
