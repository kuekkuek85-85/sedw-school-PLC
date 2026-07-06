import { useState } from 'react'
import { Link } from 'react-router-dom'
import CopyBlock from '../components/CopyBlock'
import { CHATGPT_GROUP_URL } from '../lib/constants'
import {
  PRD_LITE_TEMPLATE,
  WORKSHEET_TEMPLATE,
  CANVAS_APP_TEMPLATE,
  CODEX_TEMPLATE,
  COMIC_TEMPLATE,
} from '../data/templates'

const TRACK_TABS = [
  {
    id: 'worksheet',
    emoji: '📄',
    name: '웹 활동지 트랙',
    level: '입문',
    desc: 'ChatGPT 캔버스로 인쇄 가능한 HTML 활동지를 만들어요. 코딩 경험이 없어도 괜찮아요!',
    template: WORKSHEET_TEMPLATE,
  },
  {
    id: 'canvas',
    emoji: '🖌',
    name: '캔버스 앱 트랙',
    level: '중급',
    desc: 'PRD-lite를 ChatGPT 캔버스에 붙여넣어 단일 HTML 앱을 만들어요.',
    template: CANVAS_APP_TEMPLATE,
  },
  {
    id: 'codex',
    emoji: '🎮',
    name: 'Codex 트랙',
    level: '상급',
    desc: 'PRD-lite를 Codex에 투입해 본격적인 앱을 만들어요. 클론코딩도 가능!',
    template: CODEX_TEMPLATE,
  },
]

export default function Missions() {
  const [tab, setTab] = useState('worksheet')
  const active = TRACK_TABS.find((t) => t.id === tab)!

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-cinema-900">🗺️ 미션 카드 허브</h1>
        <p className="mt-2 text-lg text-gray-600">
          내 수준에 맞는 트랙을 골라 어울림시네마 수업 자료를 만들어 보세요.
          강사 v0.1을 수정·개작해도 좋고, 완전히 새로운 아이디어로 시작해도 좋습니다.
        </p>
        <a
          href={CHATGPT_GROUP_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block rounded-xl bg-emerald-500 px-5 py-3 font-bold text-white shadow transition hover:scale-105"
        >
          💬 ChatGPT 그룹 채팅방 입장 — 4컷 만화 공유 · 질문 백채널
        </a>
      </div>

      {/* 공통 흐름 안내 */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-center font-bold text-gray-700">
          어느 트랙이든 흐름은 같아요:
          <span className="mx-2 rounded-lg bg-cinema-50 px-2 py-1">HTML 만들기</span>→
          <span className="mx-2 rounded-lg bg-cinema-50 px-2 py-1">Vercel 배포</span>→
          <Link to="/submit" className="mx-2 rounded-lg bg-cinema-500 px-2 py-1 text-white">
            URL 제출
          </Link>
        </p>
      </div>

      {/* 1단계: PRD-lite */}
      <section className="rounded-2xl border border-cinema-100 bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl font-bold text-cinema-700">
          1단계 · PRD-lite 작성 (8분)
        </h2>
        <p className="mb-3 mt-1 text-gray-600">
          아래 템플릿을 복사해 ChatGPT에 붙여넣으면, 인터뷰하듯 물어보고 한 장 기획서로
          정리해 줍니다. 완성되면{' '}
          <Link to="/grill" className="font-bold text-cinema-600 underline">
            🔥 Grill Me
          </Link>
          에서 검증받으세요.
        </p>
        <CopyBlock text={PRD_LITE_TEMPLATE} label="PRD-lite 복사" />
      </section>

      {/* 2단계: 트랙 선택 */}
      <section className="rounded-2xl border border-cinema-100 bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl font-bold text-cinema-700">
          2단계 · 트랙 선택 후 빌드 (19분)
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {TRACK_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-xl border-2 px-4 py-3 text-left transition ${
                tab === t.id
                  ? 'border-cinema-500 bg-cinema-50'
                  : 'border-gray-200 hover:border-cinema-100'
              }`}
            >
              <div className="font-bold">
                {t.emoji} {t.name}
              </div>
              <div className="text-sm text-gray-500">{t.level}</div>
            </button>
          ))}
        </div>
        <p className="my-4 text-gray-600">{active.desc}</p>
        <CopyBlock text={active.template} label="프롬프트 복사" />
      </section>

      {/* 1차시: 4컷 만화 */}
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="font-display text-xl font-bold text-emerald-800">
          🎨 1차시 실습 · 자립 4컷 만화 만들기
        </h2>
        <p className="mb-3 mt-1 text-gray-600">
          공통 시드 이미지를 다운로드해 ChatGPT에 첨부한 뒤, 아래 프롬프트를 붙여넣으세요.
          완성된 만화는 그룹 채팅방에 공유! (말풍선 문구를 정확히 지정하면 재생성이 줄어요)
        </p>
        <a
          href="/apps/comic-4cut/seed-character.svg"
          download="시드캐릭터.svg"
          className="mb-3 inline-block rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white transition hover:bg-emerald-700"
        >
          ⬇️ 공통 시드 이미지 다운로드
        </a>
        <CopyBlock text={COMIC_TEMPLATE} label="만화 프롬프트 복사" />
        <p className="mt-3 text-sm text-emerald-800">
          💡 완성한 만화가{' '}
          <a href="/apps/sequence/" target="_blank" rel="noreferrer" className="font-bold underline">
            4컷 순서 맞추기 앱
          </a>
          의 재료가 됩니다 — 여러분이 만든 만화가 수업 앱이 돼요!
        </p>
      </section>
    </div>
  )
}
