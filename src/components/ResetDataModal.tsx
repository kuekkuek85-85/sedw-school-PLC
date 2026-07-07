import { useState } from 'react'
import {
  collection,
  getDocs,
  doc,
  writeBatch,
  setDoc,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

const CONFIRM_PHRASE = '초기화'
const COLLECTIONS_TO_WIPE = ['participants', 'submissions', 'prds', 'signals', 'reflections', 'reactions']

type Status = 'idle' | 'running' | 'done' | 'error'

export default function ResetDataModal({ onClose }: { onClose: () => void }) {
  const [typed, setTyped] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [log, setLog] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  const canConfirm = typed.trim() === CONFIRM_PHRASE && status === 'idle'

  async function runReset() {
    setStatus('running')
    setLog([])
    setErrorMsg('')
    try {
      // 제출물의 comments 서브컬렉션은 부모 삭제 시 자동으로 안 지워지므로 먼저 처리
      const subsSnap = await getDocs(collection(db, 'submissions'))
      let commentCount = 0
      for (const subDoc of subsSnap.docs) {
        const commentsSnap = await getDocs(collection(db, 'submissions', subDoc.id, 'comments'))
        if (commentsSnap.empty) continue
        const batch = writeBatch(db)
        commentsSnap.docs.forEach((c) => batch.delete(c.ref))
        await batch.commit()
        commentCount += commentsSnap.size
      }
      setLog((l) => [...l, `💬 댓글 ${commentCount}건 삭제`])

      for (const name of COLLECTIONS_TO_WIPE) {
        const snap = await getDocs(collection(db, name))
        const docsList = snap.docs
        for (let i = 0; i < docsList.length; i += 450) {
          const chunk = docsList.slice(i, i + 450)
          const batch = writeBatch(db)
          chunk.forEach((d) => batch.delete(d.ref))
          await batch.commit()
        }
        setLog((l) => [...l, `🗑️ ${name} ${docsList.length}건 삭제`])
      }

      // 진행 상태 초기화 (포털 자료는 그대로 유지)
      await setDoc(
        doc(db, 'config', 'app'),
        {
          activeStage: null,
          stageUpdatedAt: null,
          trainingEnded: false,
          trainingEndedAt: null,
          slidePreview: null,
          slidePreviewUpdatedAt: null,
        },
        { merge: true },
      )
      setLog((l) => [...l, '⚙️ 진행 상태(스테이지·연수종료) 초기화'])

      setStatus('done')
    } catch (e) {
      setStatus('error')
      setErrorMsg(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <h1 className="font-display text-2xl font-bold text-red-700">🗑️ 데이터 초기화</h1>
        <p className="mt-3 text-gray-700">
          연수 시작 전 테스트 데이터를 깨끗하게 지웁니다. 다음 항목이{' '}
          <b>전부 영구 삭제</b>됩니다:
        </p>
        <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
          <li>참가자 목록, 제출물·댓글, PRD, 신호등, 이모지 반응, 성찰 후기</li>
          <li>현재 스테이지 방송·연수 종료 상태</li>
        </ul>
        <p className="mt-2 rounded-lg bg-green-50 p-2 text-sm text-green-700">
          ✅ 포털 자료(portal_items)는 지워지지 않습니다.
        </p>

        {status === 'idle' && (
          <>
            <p className="mt-5 font-bold text-gray-700">
              계속하려면 아래 칸에 <span className="text-red-600">"{CONFIRM_PHRASE}"</span>를
              입력하세요.
            </p>
            <input
              className="mt-2 w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-red-500 focus:outline-none"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={CONFIRM_PHRASE}
              autoFocus
            />
            <div className="mt-5 flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border-2 border-gray-200 py-3 font-bold text-gray-600"
              >
                취소
              </button>
              <button
                onClick={runReset}
                disabled={!canConfirm}
                className="flex-1 rounded-xl bg-red-600 py-3 font-bold text-white transition hover:bg-red-700 disabled:opacity-30"
              >
                완전히 삭제
              </button>
            </div>
          </>
        )}

        {status === 'running' && (
          <div className="mt-5">
            <p className="font-bold text-gray-700">삭제 중… 창을 닫지 마세요.</p>
            <div className="mt-2 space-y-1 text-sm text-gray-500">
              {log.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        )}

        {status === 'done' && (
          <div className="mt-5">
            <p className="font-bold text-green-700">✅ 초기화 완료! 연수를 시작할 준비가 됐습니다.</p>
            <div className="mt-2 space-y-1 text-sm text-gray-500">
              {log.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <button
              onClick={onClose}
              className="mt-5 w-full rounded-xl bg-cinema-500 py-3 font-bold text-white"
            >
              닫기
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-5">
            <p className="font-bold text-red-700">⚠️ 초기화 중 오류가 발생했어요.</p>
            <p className="mt-1 text-sm text-gray-500">{errorMsg}</p>
            <button
              onClick={onClose}
              className="mt-5 w-full rounded-xl border-2 border-gray-200 py-3 font-bold text-gray-600"
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
