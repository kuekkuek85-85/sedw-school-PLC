import { useState } from 'react'

export default function CopyBlock({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // 클립보드 API가 막힌 환경(http 등) 폴백
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <pre className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-xl bg-gray-800 p-4 pr-24 text-sm leading-relaxed text-gray-100">
        {text}
      </pre>
      <button
        onClick={copy}
        className={`absolute right-3 top-3 rounded-lg px-3 py-1.5 text-sm font-bold transition ${
          copied ? 'bg-green-500 text-white' : 'bg-white text-gray-700 hover:bg-cinema-100'
        }`}
      >
        {copied ? '✅ 복사됨!' : `📋 ${label ?? '복사'}`}
      </button>
    </div>
  )
}
