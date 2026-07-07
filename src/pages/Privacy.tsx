export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-cinema-900">🔒 개인정보처리방침</h1>
      <p className="mt-2 text-gray-500">시행일: 2026년 7월 8일</p>

      <div className="mt-8 space-y-6 text-gray-700">
        <section>
          <h2 className="font-display text-lg font-bold text-cinema-700">
            1. 수집하는 개인정보 항목
          </h2>
          <p className="mt-2 leading-relaxed">
            플랫폼은 서울다원학교 교원학습공동체 연수 운영을 위해 아래 정보만을 수집합니다.
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 leading-relaxed">
            <li>닉네임(실명 권장), 담당 교과</li>
            <li>연수 중 작성한 기획서(PRD), 제출한 수업 자료 URL·설명, 갤러리 댓글·이모지 반응</li>
            <li>신호등(도움 요청) 상태, 스테이지 진행 확인 여부, 연수 성찰 후기</li>
          </ul>
          <p className="mt-2 rounded-lg bg-cinema-50 p-3 text-sm">
            학생의 이름·사진 등 학생 개인정보는 수집하지 않으며, 주민등록번호·연락처·이메일
            등 민감 정보도 수집하지 않습니다. 로그인은 이메일·비밀번호 없이 Firebase 익명
            인증으로 처리됩니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-cinema-700">
            2. 개인정보의 수집 및 이용 목적
          </h2>
          <ul className="mt-2 list-inside list-disc space-y-1 leading-relaxed">
            <li>연수 참여 확인 및 진행 현황(강사 대시보드) 관리</li>
            <li>제출한 수업 자료의 검토·피드백 및 갤러리 워크(동료 평가) 운영</li>
            <li>발표 슬라이드·수료증 생성 등 연수 산출물 관리</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-cinema-700">
            3. 보유 및 이용 기간
          </h2>
          <p className="mt-2 leading-relaxed">
            수집된 정보는 연수 목적 달성 및 7/14 어울림시네마 공동교육과정 운영을 위해
            필요한 기간 동안 보관되며, 이후 별도 요청이 있을 경우 지체 없이 파기합니다.
            전자적 파일 형태로 저장된 정보는 복구 불가능한 방법으로 삭제합니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-cinema-700">
            4. 개인정보의 제3자 제공 및 처리위탁
          </h2>
          <p className="mt-2 leading-relaxed">
            플랫폼은 원칙적으로 개인정보를 외부에 제공하지 않습니다. 다만 서비스 운영을 위해
            아래와 같이 해외 인프라 사업자에게 처리를 위탁하고 있습니다.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-2 pr-4">수탁업체</th>
                  <th className="py-2 pr-4">위탁 업무</th>
                  <th className="py-2">보유 정보</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4">Google Firebase</td>
                  <td className="py-2 pr-4">데이터베이스 저장, 익명 인증</td>
                  <td className="py-2">닉네임·교과·제출 내용 전체</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4">Google Gemini API</td>
                  <td className="py-2 pr-4">Grill Me 질문 생성, AI 피드백 생성</td>
                  <td className="py-2">PRD·제출 스펙 텍스트(일시적 처리, 별도 저장 안 함)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Vercel</td>
                  <td className="py-2 pr-4">웹사이트 호스팅</td>
                  <td className="py-2">접속 로그 등 호스팅 처리 정보</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-cinema-700">
            5. 정보주체의 권리
          </h2>
          <p className="mt-2 leading-relaxed">
            이용자는 언제든지 본인의 제출물·PRD·댓글 등을 직접 수정하거나 삭제할 수 있으며,
            연수 종료 후 본인 정보의 열람·정정·삭제를 강사에게 요청할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-cinema-700">
            6. 개인정보의 안전성 확보조치
          </h2>
          <ul className="mt-2 list-inside list-disc space-y-1 leading-relaxed">
            <li>Firestore 보안 규칙을 통해 본인 데이터만 수정·삭제 가능하도록 접근을 제한</li>
            <li>강사 대시보드 등 민감 기능은 강사 코드로 입장한 경우에만 접근 가능</li>
            <li>API 키 등 민감 정보는 서버 환경변수로만 관리하고 클라이언트에 노출하지 않음</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-cinema-700">
            7. 개인정보 보호책임자
          </h2>
          <p className="mt-2 leading-relaxed">
            서울다원학교 교원학습공동체 연수 강사: 이승엽 ·{' '}
            <a href="mailto:kuekkuek85@gmail.com" className="text-cinema-600 underline">
              kuekkuek85@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
