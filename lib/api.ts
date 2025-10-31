export type ResourceName = 'jogos' | 'generos' | 'atualizacoes' | 'empresas' | 'usuarios'

// const BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080'
const BASE = '/api/backend' // chama o proxy do Next


async function http(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    cache: 'no-store',
    ...init,
  })
  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try { const j = await res.json(); msg += ` - ${JSON.stringify(j)}` } catch {}
    throw new Error(msg)
  }
  const ct = res.headers.get('Content-Type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}

export const FORM_FIELDS: Record<ResourceName, string[]> = {
  jogos: ['nome','preco','desenvolvedoraId','generoIds'],
  generos: ['nome'],
  atualizacoes: ['descricao','jogoId'],
  empresas: ['nome'],
  usuarios: ['email','password'],
}

export async function list(resource: ResourceName, params: Record<string,string|number|boolean> = {}) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k,v]) => q.set(k, String(v)))
  const qs = q.toString() ? `?${q.toString()}` : ''
  return http(`/${resource}${qs}`)
}

export async function getById(resource: ResourceName, id: string | number) {
  return http(`/${resource}/${id}`)
}

function toCreateDTO(resource: ResourceName, data: Record<string, any>) {
  switch (resource) {
    case 'jogos': {
      const generoIds = (data.generoIds || '')
        .toString().split(',').map((s: string) => s.trim()).filter(Boolean).map((x: string) => Number(x));
      return {
        nome: data.nome,
        preco: data.preco != null ? Number(data.preco) : null,
        desenvolvedoraId: data.desenvolvedoraId != null ? Number(data.desenvolvedoraId) : null,
        generoIds,
      }
    }
    case 'generos': return { nome: data.nome }
    case 'empresas': return { nome: data.nome }
    case 'atualizacoes': return { descricao: data.descricao, jogoId: data.jogoId != null ? Number(data.jogoId) : null }
    case 'usuarios': return { email: data.email, password: data.password }
  }
}

export async function create(resource: ResourceName, data: any) {
  const body = toCreateDTO(resource, data)
  return http(`/${resource}`, { method: 'POST', body: JSON.stringify(body) })
}

function toEditDTO(resource: ResourceName, id: string | number, form: Record<string, any>, loaded?: any) {
  switch (resource) {
    case 'jogos': {
      const generoIds = (form.generoIds ?? '')
        .toString().split(',').map((s: string) => s.trim()).filter(Boolean).map((x: string) => Number(x));
      return {
        nome: form.nome ?? loaded?.nome ?? null,
        preco: form.preco != null ? Number(form.preco) : (loaded?.preco ?? null),
        desenvolvedoraId: form.desenvolvedoraId != null ? Number(form.desenvolvedoraId) : (loaded?.desenvolvedora?.id ?? null),
        generoIds: generoIds.length ? generoIds : (loaded?.generos?.map((g: any) => g.id) ?? []),
      }
    }
    case 'generos': return { nome: form.nome ?? loaded?.nome ?? null }
    case 'empresas': return { nome: form.nome ?? loaded?.nome ?? null }
    case 'atualizacoes': return { id: Number(id), descricao: form.descricao ?? loaded?.descricao ?? null, jogoId: form.jogoId != null ? Number(form.jogoId) : (loaded?.jogo?.id ?? null) }
    case 'usuarios': return { email: loaded?.email ?? form.email, password: form.password ?? loaded?.password ?? null }
  }
}

export async function update(resource: ResourceName, id: string | number, data: any) {
  const loaded = await getById(resource, id).catch(() => ({}))
  const body = toEditDTO(resource, id, data, loaded)
  if (resource === 'atualizacoes') {
    return http(`/atualizacoes`, { method: 'PUT', body: JSON.stringify(body) })
  }
  return http(`/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(body) })
}

export async function remove(resource: ResourceName, id: string | number) {
  return http(`/${resource}/${id}`, { method: 'DELETE' })
}
