'use client'
import Link from 'next/link'
export default function Nav() {
  const items = [
    { href: '/', label: 'Dashboard' },
    { href: '/jogos', label: 'Jogos' },
    { href: '/generos', label: 'Gêneros' },
    { href: '/atualizacoes', label: 'Atualizações' },
    { href: '/empresas', label: 'Empresas' },
    { href: '/usuarios', label: 'Usuários' },
  ]
  return (
    <nav className="container mt-6 mb-6">
      <ul className="flex flex-wrap gap-2">
        {items.map(it => (
          <li key={it.href}><Link className="btn" href={it.href}>{it.label}</Link></li>
        ))}
      </ul>
    </nav>
  )
}
