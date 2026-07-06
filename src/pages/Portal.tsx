import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { PORTAL_SEED, type PortalItem } from '../data/portalSeed'
import { CHATGPT_GROUP_URL } from '../lib/constants'

export default function Portal() {
  const [extraItems, setExtraItems] = useState<PortalItem[]>([])
  const [filter, setFilter] = useState('전체')

  useEffect(() => {
    const q = query(collection(db, 'portal_items'), orderBy('order'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setExtraItems(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PortalItem),
        )
      },
      () => {}, // 규칙 미설정 등 오류 시 시드만 표시
    )
    return unsub
  }, [])

  // Firestore에 같은 id가 있으면 시드보다 우선
  const merged = [
    ...PORTAL_SEED.filter((s) => !extraItems.some((e) => e.id === s.id)),
    ...extraItems,
  ].sort((a, b) => a.order - b.order)

  const subjects = ['전체', ...Array.from(new Set(merged.map((i) => i.subject)))]
  const items = filter === '전체' ? merged : merged.filter((i) => i.subject === filter)

  return (
    <div>
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-cinema-500 to-cinema-700 p-8 text-white">
        <h1 className="font-display text-3xl font-bold">🎬 어울림시네마 디지털 자료실</h1>
        <p className="mt-2 text-lg opacity-90">
          7/14 아리랑씨네센터 영화관람을 위한 선생님들의 수업 자료 모음.
          <br />
          오늘 연수에서 여러분의 자료가 이곳에 추가됩니다!
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a
            href={CHATGPT_GROUP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-xl bg-white px-5 py-3 font-bold text-cinema-700 shadow transition hover:scale-105"
          >
            💬 ChatGPT 그룹 채팅방 입장 (4컷 만화 공유)
          </a>
          <a
            href="https://padlet.com/jjudy7428/26-7-6-15-tutpgslnhc40utq3"
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-xl border border-white/50 px-5 py-3 font-bold text-white transition hover:bg-white/10"
          >
            📌 기존 공동교육과정 패들렛 (참고)
          </a>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-2 font-medium transition ${
              filter === s
                ? 'bg-cinema-500 text-white'
                : 'bg-white text-gray-600 hover:bg-cinema-100'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col rounded-2xl border border-cinema-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <span className="rounded-full bg-cinema-50 px-3 py-1 text-sm font-bold text-cinema-700">
                {item.subject}
              </span>
              <span className="text-xl">
                {item.typeBadge === 'app' ? '🎮' : '📄'}
              </span>
            </div>
            <h3 className="font-display text-lg font-bold text-gray-800 group-hover:text-cinema-600">
              {item.title}
            </h3>
            <p className="mt-1 flex-1 text-sm text-gray-500">{item.description}</p>
            <div className="mt-3 border-t border-gray-100 pt-3 text-sm">
              {item.sourceBadge === 'done' ? (
                <span className="text-green-700">✅ 선생님 산출물 (제작: {item.sourceName})</span>
              ) : (
                <span className="text-emerald-600">
                  🌱 초안 v0.1 ({item.sourceName} · 오늘 함께 완성)
                </span>
              )}
            </div>
          </a>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border-2 border-dashed border-cinema-500 bg-cinema-50 p-6 text-center">
        <p className="text-lg font-bold text-cinema-700">
          🌱 마지막 카드가 초안인 이유 — 오늘 여러분이 직접 완성하니까요!
        </p>
        <p className="mt-1 text-gray-600">
          미션 탭에서 트랙을 고르고, 나만의 수업 자료를 만들어 보세요.
        </p>
      </div>
    </div>
  )
}
