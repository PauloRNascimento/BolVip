import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-emerald-900 font-bold text-lg">
              BV
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Bolão VIP</h1>
              <p className="text-xs text-emerald-200">
                Transparência total em cada jogo
              </p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#boloes" className="text-sm font-medium text-emerald-100 hover:text-white transition-colors">
              Bolões
            </a>
            <a href="#jogos" className="text-sm font-medium text-emerald-100 hover:text-white transition-colors">
              Jogos
            </a>
            <a href="#resultados" className="text-sm font-medium text-emerald-100 hover:text-white transition-colors">
              Resultados
            </a>
            <a href="#transparencia" className="text-sm font-medium text-emerald-100 hover:text-white transition-colors">
              Transparência
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
