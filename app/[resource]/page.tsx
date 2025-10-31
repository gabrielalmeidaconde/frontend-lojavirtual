'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { FORM_FIELDS, type ResourceName, list, create, update, remove, getById } from '../../lib/api'

type Row = Record<string, any>

export default function ResourcePage() {
  const params = useParams()
  const resource = String(params.resource) as ResourceName
  const fields = FORM_FIELDS[resource] || []
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [form, setForm] = useState<Row>({})

  const title = useMemo(() => resource.charAt(0).toUpperCase() + resource.slice(1), [resource])

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      const data = await list(resource) as any
      const arr = Array.isArray(data) ? data : (data?.items || data || [])
      setRows(arr)
    } catch (e:any) { setError(e.message) }
    setLoading(false)
  }

  useEffect(() => { refresh() }, [resource])

  useEffect(() => {
    const f: Row = {}
    fields.forEach(k => f[k] = '')
    setForm(f)
  }, [fields.join('|')])

  function onChange(k: string, v: string) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editingId != null) {
        await update(resource, editingId, form)
      } else {
        await create(resource, form)
      }
      setEditingId(null)
      await refresh()
    } catch (e:any) {
      alert(e.message)
    }
  }

  async function onEdit(id: any) {
    try {
      const data = await getById(resource, id)
      setEditingId(id)
      const preload: Row = {}
      fields.forEach(k => {
        if (k in data) preload[k] = data[k] ?? ''
        else {
          if (resource === 'jogos') {
            if (k === 'desenvolvedoraId') preload[k] = data?.desenvolvedoraId?.id ?? ''
            if (k === 'generoIds') preload[k] = (data?.generoIds || []).map((g:any)=>g.id).join(',')
          }
          if (resource === 'atualizacoes') {
            if (k === 'jogoId') preload[k] = data?.jogo?.id ?? ''
          }
        }
      })
      setForm(preload)
    } catch (e:any) {
      alert(e.message)
    }
  }

  async function onDelete(id: any) {
    if (!confirm('Tem certeza que deseja excluir?')) return
    try {
      await remove(resource, id)
      await refresh()
    } catch (e:any) {
      alert(e.message)
    }
  }

  return (
    <div className="grid md:grid-cols-5 gap-6">
      <div className="md:col-span-3">
        <div className="card">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button className="btn" onClick={() => refresh()}>Recarregar</button>
          </div>
          {loading && <p className="text-slate-400 mt-4">Carregando...</p>}
          {error && <p className="text-red-400 mt-4">{error}</p>}
          {!loading && !error && (
            <div className="overflow-auto mt-4">
              <table className="table">
                <thead>
                  <tr>
                    {Object.keys(rows[0] || {}).map(h => <th key={h}>{h}</th>)}
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => {
                    const id = r.id ?? r._id ?? r.email ?? idx
                    return (
                      <tr key={id}>
                        {Object.keys(r).map(k => (
                          <td key={k}>
                            <span className="text-slate-200">{typeof r[k] === 'object' ? JSON.stringify(r[k]) : String(r[k])}</span>
                          </td>
                        ))}
                        <td className="flex gap-2">
                          <button className="btn" onClick={() => onEdit(id)}>Editar</button>
                          <button className="btn" onClick={() => onDelete(id)}>Excluir</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {rows.length === 0 && <p className="text-slate-400 mt-2">Nenhum item encontrado.</p>}
            </div>
          )}
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">{editingId != null ? 'Editar' : 'Criar'} {title.slice(0, -1)}</h3>
          <form onSubmit={onSubmit} className="space-y-3">
            {(fields.length ? fields : Object.keys(form)).map(k => (
              <div key={k}>
                <label className="text-xs text-slate-400">{k}</label>
                <input
                  className="input mt-1"
                  value={form[k] ?? ''}
                  onChange={e => onChange(k, e.target.value)}
                  placeholder={k}
                />
                {resource === 'jogos' && k === 'generoIds' && (
                  <p className="text-[11px] text-slate-500 mt-1">Separe múltiplos IDs por vírgula. Ex: 1,2,3</p>
                )}
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <button type="submit" className="btn btn-primary">{editingId != null ? 'Salvar' : 'Criar'}</button>
              {editingId != null && <button type="button" className="btn" onClick={() => setEditingId(null)}>Cancelar</button>}
            </div>
          </form>
        </div>
        <div className="card mt-6">
          <h4 className="font-semibold">Dicas</h4>
          <ul className="text-sm text-slate-400 mt-2 list-disc ml-5 space-y-1">
            {resource === 'jogos' && <li>Use <code>desenvolvedoraId</code> e <code>generoIds</code> (lista: 1,2,3).</li>}
            {resource === 'atualizacoes' && <li>Informe <code>jogoId</code>.</li>}
            {resource === 'usuarios' && <li><code>email</code> é a chave.</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}
