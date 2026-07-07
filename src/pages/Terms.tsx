export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-cinema-900">📜 이용약관</h1>
      <p className="mt-2 text-gray-500">시행일: 2026년 7월 8일</p>

      <div className="mt-8 space-y-6 text-gray-700">
        <section>
          <h2 className="font-display text-lg font-bold text-cinema-700">제1조 (목적)</h2>
          <p className="mt-2 leading-relaxed">
            이 약관은 서울다원학교 교원학습공동체 연수를 위해 운영되는 「다원 어울림시네마 AI
            연수 플랫폼」(이하 "플랫폼")의 이용과 관련하여 운영자와 이용자의 권리·의무 및
            책임사항을 정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-cinema-700">제2조 (이용자)</h2>
          <p className="mt-2 leading-relaxed">
            플랫폼은 서울다원학교 교원학습공동체 연수에 참여하는 교원 및 강사만을 대상으로
            운영되며, 입장 코드를 통해서만 접속할 수 있습니다. 학생 개인정보는 수집하지
            않습니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-cinema-700">제3조 (서비스의 내용)</h2>
          <p className="mt-2 leading-relaxed">플랫폼은 다음과 같은 서비스를 제공합니다.</p>
          <ul className="mt-2 list-inside list-disc space-y-1 leading-relaxed">
            <li>어울림시네마 수업 자료 열람(포털) 및 실습 안내(미션)</li>
            <li>AI(Gemini)를 활용한 기획서 검증(Grill Me) 및 피드백 제공</li>
            <li>제작한 수업 자료 URL 제출 및 발표 슬라이드 자동 생성</li>
            <li>갤러리 워크(동료 평가), 신호등을 통한 실시간 도움 요청</li>
            <li>연수 진행 현황 관리(강사 대시보드) 및 수료증 발급</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-cinema-700">제4조 (이용자의 의무)</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 leading-relaxed">
            <li>실제 학생의 사진, 이름 등 개인을 특정할 수 있는 정보를 게시하지 않습니다.</li>
            <li>타인의 저작물을 무단으로 게시하거나 원저작자의 권리를 침해하지 않습니다.</li>
            <li>동료의 산출물에 대한 댓글은 예의를 갖추어 건설적으로 작성합니다.</li>
            <li>닉네임은 실명 사용을 권장하되, 타인을 사칭하는 용도로 사용하지 않습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-cinema-700">제5조 (콘텐츠의 저작권)</h2>
          <p className="mt-2 leading-relaxed">
            연수 중 제작한 수업 자료의 저작권은 이를 제작한 교원 본인에게 있습니다. 다만
            제출된 자료는 서울다원학교 어울림시네마 공동교육과정(7/14 영화관람 등) 운영
            목적으로 학교 내에서 자유롭게 활용될 수 있습니다. 강사가 제공한 v0.1 초안을
            개작한 경우, 원 저작자를 표시합니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-cinema-700">
            제6조 (AI 기능의 한계)
          </h2>
          <p className="mt-2 leading-relaxed">
            Grill Me 및 AI 피드백 기능은 Google Gemini API를 활용하며, AI가 생성하는 질문·
            피드백은 참고용 의견일 뿐 정답이나 공식적인 평가가 아닙니다. 최종 판단과 책임은
            이용자와 강사에게 있습니다. AI 응답이 지연되거나 실패할 경우 정적으로 준비된
            대체 문항이 제공됩니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-cinema-700">
            제7조 (서비스의 변경·중단)
          </h2>
          <p className="mt-2 leading-relaxed">
            플랫폼은 연수 운영 목적에 맞춰 강사(운영자)가 기능을 변경하거나, 연수 종료 후
            서비스를 중단할 수 있습니다. 연수 종료 후에도 포털(자료실)은 7/14 어울림시네마
            운영 기간 동안 유지될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-cinema-700">제8조 (면책조항)</h2>
          <p className="mt-2 leading-relaxed">
            운영자는 천재지변, 통신 장애 등 불가항력적 사유로 서비스를 제공할 수 없는 경우
            책임을 지지 않습니다. 이용자가 직접 배포한 외부 사이트(Vercel, Netlify 등)의
            안정성에 대해서는 각 서비스 제공자의 정책을 따릅니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-cinema-700">문의</h2>
          <p className="mt-2 leading-relaxed">
            약관에 대한 문의는 강사(이승엽)에게 연수 중 직접 문의하거나, 이메일(
            <a href="mailto:kuekkuek85@gmail.com" className="text-cinema-600 underline">
              kuekkuek85@gmail.com
            </a>
            )로 연락해 주세요.
          </p>
        </section>
      </div>
    </div>
  )
}
