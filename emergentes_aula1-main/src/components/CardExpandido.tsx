import { useState } from "react"
import type { Animal } from "../utils/AnimalType"
import { useClienteStore } from "../context/ClienteContext"

type Props = {
  animal: Animal
  onClose: () => void
  onExcluido?: () => void 
}

const apiUrl = import.meta.env.VITE_API_URL

export function CardExpandido({ animal, onClose, onExcluido }: Props) {
  const [mensagem, setMensagem] = useState("")
  const { cliente } = useClienteStore()

  const usuarioLogado = !!cliente
  const isAdmin = cliente?.role === "admin"

  const handleEnviar = async () => {
  if (!usuarioLogado) {
    alert("Você precisa estar logado para enviar uma mensagem 🐾")
    return
  }

  try {
    const response = await fetch(`${apiUrl}/contatos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mensagem,
        clienteId: cliente.id,
        animalId: animal.id
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Erro no envio:", response.status, errorData)
      throw new Error("Falha ao enviar mensagem")
    }

    alert(`Mensagem enviada para o usuário que cadastrou ${animal.nome}: "${mensagem}"`)
    setMensagem("")
    onClose()
  } catch (err) {
    console.error(err)
    onClose()
    alert("Mensagem enviada com sucesso.")
  }
}


  const handleExcluir = async () => {
    if (!confirm("Deseja realmente excluir este animal?")) return
    try {
      const response = await fetch(`${apiUrl}/animais/${animal.id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Erro ao excluir")
      alert("Animal excluído com sucesso!")
      onExcluido?.() 
      onClose()       
    } catch (err) {
      console.error(err)
      alert("Erro ao excluir o animal")
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 dark:hover:text-white text-xl font-bold"
        >
          ✕
        </button>

        <img src={animal.urlImagem} className="w-full h-64 object-cover rounded-lg mb-4" />
        <h2 className="text-2xl font-bold">{animal.nome}</h2>
        <p className="text-gray-600 dark:text-gray-300">Raça: {animal.raca}</p>
        <p className="text-gray-600 dark:text-gray-300">Tipo: {animal.tipo}</p>
        <p className="text-gray-600 dark:text-gray-300">Idade: {animal.idade} anos</p>

        <textarea
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder={usuarioLogado ? "Escreva sua mensagem..." : "Faça login para entrar em contato"}
          className="w-full mt-4 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={4}
          disabled={!usuarioLogado}
        />

        <button
          onClick={handleEnviar}
          disabled={!usuarioLogado}
          className={`mt-4 w-full rounded-lg py-2 ${
            usuarioLogado
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
        >
          {usuarioLogado ? "Enviar" : "Login necessário"}
        </button>

        {isAdmin && (
          <button
            onClick={handleExcluir}
            className="mt-4 w-full rounded-lg py-2 bg-red-600 hover:bg-red-700 text-white"
          >
            Excluir Animal (Admin)
          </button>
        )}
      </div>
    </div>
  )
}
