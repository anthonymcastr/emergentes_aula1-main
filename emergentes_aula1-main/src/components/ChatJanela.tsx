import { useEffect, useRef, useState } from "react"
import { useClienteStore } from "../context/ClienteContext"

interface Props {
  mensagens: any[]
  usuarioId?: number
}

export default function ChatJanela({ mensagens, usuarioId }: Props) {
  const { cliente } = useClienteStore()
  const [texto, setTexto] = useState("")
  const refFim = useRef<HTMLDivElement>(null)

  const animal = mensagens[0]?.animal

  useEffect(() => {
    refFim.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensagens])

  async function enviarMensagem() {
    if (!texto.trim()) return

    await fetch(`${import.meta.env.VITE_API_URL}/propostas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mensagem: texto,
        clienteId: cliente?.id,
        animalId: animal.id
      })
    })

    setTexto("")
    window.location.reload() // simples por enquanto
  }

  return (
    <main className="flex-1 flex flex-col bg-gray-100">
      {/* Cabeçalho */}
      <header className="p-4 bg-white border-b flex items-center gap-4">
        <img
          src={animal.urlImagem}
          alt={animal.nome}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-bold">{animal.nome}</h3>
          <p className="text-sm text-gray-500">{animal.raca}</p>
        </div>
      </header>

      {/* Mensagens */}
      <section className="flex-1 overflow-y-auto p-4 space-y-2">
        {mensagens.map((msg) => {
          const enviadaPorMim = msg.clienteId === usuarioId

          return (
            <div
              key={msg.id}
              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                enviadaPorMim
                  ? "ml-auto bg-green-500 text-white"
                  : "mr-auto bg-white border"
              }`}
            >
              {msg.mensagem}
            </div>
          )
        })}
        <div ref={refFim} />
      </section>

      {/* Input */}
      <footer className="p-4 bg-white border-t flex gap-2">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Digite uma mensagem..."
          className="flex-1 border rounded px-4 py-2"
        />
        <button
          onClick={enviarMensagem}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Enviar
        </button>
      </footer>
    </main>
  )
}
