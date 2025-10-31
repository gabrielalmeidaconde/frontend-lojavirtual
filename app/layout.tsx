import './globals.css'
import Nav from '../components/Nav'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="container pt-8">
          <div className="card">
            <h1 className="text-2xl font-semibold">Loja Virtual</h1>
          </div>
        </header>
        <Nav />
        <main className="container pb-24">{children}</main>
      </body>
    </html>
  )
}
