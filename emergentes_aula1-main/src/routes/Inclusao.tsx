import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import type { Animal } from "../utils/AnimalType"
import { useClienteStore } from "../context/ClienteContext"

export default function Inclusao() {
  const { cliente } = useClienteStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Animal>()

  const API_URL = import.meta.env.VITE_API_URL

  // 🔒 Preenche automaticamente o ID do usuário logado
  useEffect(() => {
    if (cliente?.id) {
      setValue("usuarioId", cliente.id)
    }
  }, [cliente, setValue])

  async function onSubmit(data: Animal) {
    try {
      const resp = await fetch(`${API_URL}/animais`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!resp.ok) {
        throw new Error("Erro ao cadastrar animal")
      }

      alert("Animal cadastrado com sucesso!")
      reset()
      navigate("/") // volta pra listagem (home)
    } catch (error) {
      console.error(error)
      alert("Erro ao cadastrar animal")
    }
  }

  if (!cliente) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">
          Você precisa estar logado para cadastrar um animal.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800">
          Cadastro de Animal 🐾
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">

          {/* Nome */}
          <div>
            <label className="block mb-1 font-semibold">Nome</label>
            <input
              {...register("nome", { required: "Nome obrigatório" })}
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Thor"
            />
            {errors.nome && (
              <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
            )}
          </div>

          {/* Idade */}
          <div>
            <label className="block mb-1 font-semibold">Idade</label>
            <input
              type="number"
              {...register("idade", {
                required: "Idade obrigatória",
                valueAsNumber: true,
              })}
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
            {errors.idade && (
              <p className="text-red-500 text-sm mt-1">{errors.idade.message}</p>
            )}
          </div>

          {/* Raça */}
          <div>
            <label className="block mb-1 font-semibold">Raça</label>
            <input
              {...register("raca", { required: "Raça obrigatória" })}
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Labrador"
            />
            {errors.raca && (
              <p className="text-red-500 text-sm mt-1">{errors.raca.message}</p>
            )}
          </div>

          {/* Tipo */}
          <div>
            <label className="block mb-1 font-semibold">Tipo</label>
            <select
              {...register("tipo", { required: "Tipo obrigatório" })}
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione</option>
              <option value="ADOCAO">Adoção</option>
              <option value="PERDIDO">Perdido</option>
              <option value="ENCONTRADO">Encontrado</option>
            </select>
            {errors.tipo && (
              <p className="text-red-500 text-sm mt-1">{errors.tipo.message}</p>
            )}
          </div>

          {/* Cidade */}
          <div>
            <label className="block mb-1 font-semibold">Cidade</label>
            <select
              {...register("cidade", { required: "Cidade obrigatória" })}
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione</option>
              <option value="PELOTAS">Pelotas</option>
            </select>
            {errors.cidade && (
              <p className="text-red-500 text-sm mt-1">{errors.cidade.message}</p>
            )}
          </div>

          {/* Imagem */}
          <div>
            <label className="block mb-1 font-semibold">URL da imagem</label>
            <input
              {...register("urlImagem", {
                required: "URL obrigatória",
                pattern: {
                  value: /^https?:\/\//,
                  message: "URL inválida",
                },
              })}
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
            {errors.urlImagem && (
              <p className="text-red-500 text-sm mt-1">
                {errors.urlImagem.message}
              </p>
            )}
          </div>

          {/* Usuário (bloqueado) */}
          <div>
            <label className="block mb-1 font-semibold">Usuário responsável</label>
            <input
              type="text"
              value={`${cliente.nome} (ID: ${cliente.id})`}
              disabled
              className="w-full rounded-lg border bg-gray-100 px-4 py-2 text-gray-600 cursor-not-allowed"
            />
            <input
              type="hidden"
              {...register("usuarioId", { valueAsNumber: true })}
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer"
          >
            Cadastrar Animal
          </button>
        </form>
      </div>
    </div>
  )
}
