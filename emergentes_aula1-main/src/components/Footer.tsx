export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* SOBRE */}
        <div>
          <h3 className="text-lg font-bold text-white mb-3">Sobre</h3>
          <p className="text-sm leading-relaxed">
            O PetPel RS é uma plataforma criada para ajudar na busca por pets
            perdidos, promover adoções responsáveis e conectar pessoas que
            se preocupam com o bem-estar animal.
          </p>
        </div>

        {/* SIGA-NOS */}
        <div>
          <h3 className="text-lg font-bold text-white mb-3">Siga-nos</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-orange-400 transition">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-400 transition">
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-400 transition">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

        {/* CONTATO */}
        <div>
          <h3 className="text-lg font-bold text-white mb-3">Contato</h3>

          <p className="text-sm mb-2">
            📧 <strong>Email:</strong> anthonymartins19977@gmail.com
          </p>

          <div className="flex items-center gap-3 mt-3">
            <span className="text-sm">
              📱 <strong>(53) 99170-6490</strong>
            </span>
            <a
              href="https://w.app/petpelrs"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/img/logozap.png"
                alt="Whatsapp"
                className="h-10 hover:scale-105 transition"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center py-4 text-xs text-gray-400">
        © {new Date().getFullYear()} PetPel RS — Todos os direitos reservados
      </div>
    </footer>
  )
}
