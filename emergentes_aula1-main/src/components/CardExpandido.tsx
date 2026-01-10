import { useState } from "react"
import type { Animal } from "../utils/AnimalType"
import { useClienteStore } from "../context/ClienteContext"

type Props = {
  animal: Animal
  onClose: () => void
  onExcluido?: () => void
}

const apiUrl = import.meta.env.VITE_API_URL

export function CardExpandido({
  animal,
  onClose,
  onExcluido,
}: Props) {
  const [mensagem, setMensagem] = useState("")
  const { cliente } = useClienteStore()

  const usuarioLogado = !!cliente
  const isAdmin = cliente?.role === "admin"

  const handleEnviar = async () => {
    if (!usuarioLogado) {
      alert("Você precisa estar logado para entrar em contato")
      return
    }

    try {
      const response = await fetch(`${apiUrl}/contatos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensagem,
          clienteId: cliente.id,
          animalId: animal.id,
        }),
      })

      if (!response.ok) throw new Error("Erro ao enviar")

      alert("Mensagem enviada com sucesso 🐾")
      setMensagem("")
      onClose()
    } catch (err) {
      console.error(err)
      alert("Erro ao enviar mensagem")
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
      alert("Erro ao excluir animal")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative">
        {/* Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
        >
          ✕
        </button>

        {/* Imagem */}
        <img
          src={animal.urlImagem}
          alt={animal.nome}
          className="w-full h-64 object-cover rounded-xl"
        />

        {/* Infos */}
        <div className="mt-4">
          <h2 className="text-2xl font-extrabold">
            {animal.nome}
          </h2>

          <p className="mt-1 text-gray-600">
            Raça: <strong>{animal.raca}</strong>
          </p>
          <p className="text-gray-600">
            Tipo: <strong>{animal.tipo}</strong>
          </p>
          <p className="text-gray-600">
            Idade: <strong>{animal.idade} anos</strong>
          </p>
          <p className="text-gray-600">
            Cidade: <strong>{animal.cidade}</strong>
          </p>
        </div>

        {/* Mensagem */}
        <textarea
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          rows={4}
          placeholder={
            usuarioLogado
              ? "Escreva sua mensagem para o responsável..."
              : "Faça login para enviar mensagem"
          }
          disabled={!usuarioLogado}
          className="mt-4 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />

        {/* Botões */}
        <button
          onClick={handleEnviar}
          disabled={!usuarioLogado}
          className={`mt-4 w-full py-2 rounded-lg font-semibold transition ${
            usuarioLogado
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Enviar mensagem
        </button>

        {isAdmin && (
          <button
            onClick={handleExcluir}
            className="mt-3 w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            Excluir Animal (Admin)
          </button>
        )}
      </div>
    </div>
  )
}
