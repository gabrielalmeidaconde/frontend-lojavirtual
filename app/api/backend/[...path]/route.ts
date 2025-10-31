import { NextRequest, NextResponse } from 'next/server'

const TARGET = process.env.API_TARGET ?? 'http://localhost:8080'

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const url = new URL(req.url)
  url.hostname = new URL(TARGET).hostname
  url.port = new URL(TARGET).port
  url.protocol = new URL(TARGET).protocol
  url.pathname = '/' + params.path.join('/')
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, cache: 'no-store' })
  const body = await res.text()
  return new NextResponse(body, { status: res.status, headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' } })
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  const url = new URL(TARGET + '/' + params.path.join('/'))
  const body = await req.text()
  const res = await fetch(url, { method: 'POST', body, headers: { 'Content-Type': 'application/json' } })
  const text = await res.text()
  return new NextResponse(text, { status: res.status, headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' } })
}

export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  const url = new URL(TARGET + '/' + params.path.join('/'))
  const body = await req.text()
  const res = await fetch(url, { method: 'PUT', body, headers: { 'Content-Type': 'application/json' } })
  const text = await res.text()
  return new NextResponse(text, { status: res.status, headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' } })
}

export async function DELETE(_req: NextRequest, { params }: { params: { path: string[] } }) {
  const url = new URL(TARGET + '/' + params.path.join('/'))
  const res = await fetch(url, { method: 'DELETE' })
  return new NextResponse(null, { status: res.status })
}
