import { useEffect, useState } from "react"
import { useClienteStore } from "../context/ClienteContext"
import ChatJanela from "../components/ChatJanela"
import ConversaLista from "../components/ConversaLista"

export default function Inbox() {
  const { cliente } = useClienteStore()
  const [mensagens, setMensagens] = useState<any[]>([])
  const [animalSelecionado, setAnimalSelecionado] = useState<number | null>(null)

  useEffect(() => {
  if (!cliente?.id) return

  async function carregarMensagens() {
    const enviadas = await fetch(
      `${import.meta.env.VITE_API_URL}/contatos/${cliente?.id}`
    ).then(r => r.json())

    const recebidas = await fetch(
      `${import.meta.env.VITE_API_URL}/contatos/recebidas/${cliente?.id}`
    ).then(r => r.json())

    const todas = [...enviadas, ...recebidas]

    todas.sort(
      (a, b) =>
        new Date(a.criadoEm).getTime() -
        new Date(b.criadoEm).getTime()
    )

    setMensagens(todas)
  }

  carregarMensagens()
}, [cliente?.id])


console.log("Mensagens recebidas:", mensagens)

  const mensagensPorAnimal = mensagens.reduce((acc, msg) => {
    const id = msg.animal.id
    if (!acc[id]) acc[id] = []
    acc[id].push(msg)
    return acc
  }, {} as Record<number, any[]>)

  return (
    <div className="flex h-screen">
      <ConversaLista
        conversas={mensagensPorAnimal}
        onSelect={setAnimalSelecionado}
      />

      {animalSelecionado && (
        <ChatJanela
          mensagens={mensagensPorAnimal[animalSelecionado]}
          usuarioId={cliente?.id}
        />
      )}
    </div>
    
  )
}


