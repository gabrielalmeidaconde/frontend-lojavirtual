'use client'
import { useEffect, useState } from 'react'
import { list, type ResourceName } from '../lib/api'

const RESOURCES: ResourceName[] = ['jogos','generos','atualizacoes','empresas','usuarios']

export default function Page() {
  const [counts, setCounts] = useState<Record<string, number>>({})
  useEffect(() => {
    (async () => {
      const entries = await Promise.all(RESOURCES.map(async r => {
        try { const d = await list(r) as any; const n = Array.isArray(d) ? d.length : (d?.total ?? 0); return [r, n] as const } catch { return [r, 0] as const }
      }))
      setCounts(Object.fromEntries(entries))
    })()
  }, [])
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {RESOURCES.map(r => (
        <div key={r} className="card">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold capitalize">{r}</h2>
            <span className="badge">{counts[r] ?? '-' } itens</span>
          </div>
          <a className="btn btn-primary mt-4 inline-block" href={`/${r}`}>Abrir</a>
        </div>
      ))}
    </div>
  )
}
