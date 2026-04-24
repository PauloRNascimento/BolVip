import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-emerald-900 text-emerald-100 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-white">Bolão VIP</h3>
            <p className="mt-2 text-sm text-emerald-300">
              Transparência total em cada jogo. Todos os resultados publicados.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Links</h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <a href="#boloes" className="hover:text-white transition-colors">
                  Bolões Ativos
                </a>
              </li>
              <li>
                <a href="#resultados" className="hover:text-white transition-colors">
                  Resultados
                </a>
              </li>
              <li>
                <a href="#transparencia" className="hover:text-white transition-colors">
                  Transparência
                </a>
              </li>
              <li>
                <Link href="/calculadora" className="hover:text-white transition-colors">
                  Calculadora
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Institucional</h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <Link href="/admin/login" className="hover:text-white transition-colors">
                  Sobre
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-emerald-800 pt-4 text-center text-xs text-emerald-400">
          &copy; {new Date().getFullYear()} Bolão VIP. Todos os direitos
          reservados.
        </div>
      </div>
    </footer>
  );
}
