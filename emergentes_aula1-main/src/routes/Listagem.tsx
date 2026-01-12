import { useEffect, useState } from "react"
import type { Animal } from "../utils/AnimalType"
import { CardAnimal } from "../components/CardAnimal"
import { CardExpandido } from "../components/CardExpandido"
import { InputPesquisa } from "../components/InputPesquisa"
import { useAdminStore } from "../Admin/context/AdminContext"

export default function Listagem() {
  const [animais, setAnimais] = useState<Animal[]>([])
  const [animaisOriginais, setAnimaisOriginais] = useState<Animal[]>([])
  const [cardSelecionado, setCardSelecionado] = useState<Animal | null>(null)
  const [tipoAtivo, setTipoAtivo] = useState<string | null>(null)

  const { admin } = useAdminStore()
  const isAdmin = admin?.role === "admin"

  // 🔹 Busca inicial
  const buscaDados = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/animais`)
      const dados = await response.json()
      setAnimais(dados)
      setAnimaisOriginais(dados)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    buscaDados()
  }, [])

  // 🔹 Filtro por tipo
  const filtrarPorTipo = (tipo: string) => {
    if (tipoAtivo === tipo) {
      setAnimais(animaisOriginais)
      setTipoAtivo(null)
      return
    }

    const filtrados = animaisOriginais.filter(
      (animal) => animal.tipo === tipo
    )

    setAnimais(filtrados)
    setTipoAtivo(tipo)
  }

  // 🔹 Remover da lista
  const handleExcluido = (id: number) => {
    setAnimais((prev) => prev.filter((animal) => animal.id !== id))
    setAnimaisOriginais((prev) => prev.filter((animal) => animal.id !== id))
  }

  // 🔹 Exclusão (admin)
  const excluirAnimal = async (id: number) => {
    if (!confirm("Deseja realmente excluir este animal?")) return

    try {
      const token = admin?.token
      if (!token) {
        alert("Você precisa estar logado como administrador")
        return
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/animais/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) throw new Error("Erro ao excluir")

      alert("Animal excluído com sucesso!")
      handleExcluido(id)
    } catch (err) {
      console.error(err)
      alert("Erro ao excluir o animal")
    }
  }

  return (
    <div className="min-h-screen">
      {/* 🔍 FILTROS */}
      <section className="max-w-7xl mx-auto px-4 pt-8">
        <InputPesquisa
          setAnimais={(dados) => {
            setAnimais(dados)
            setAnimaisOriginais(dados)
            setTipoAtivo(null)
          }}
        />

        {/* 🔘 Botões */}
        <div className="flex justify-center gap-3 sm:gap-4 mt-6 flex-wrap">
          {[
            { tipo: "PERDIDO", label: "Perdidos", cor: "red" },
            { tipo: "ENCONTRADO", label: "Encontrados", cor: "green" },
            { tipo: "ADOCAO", label: "Para Adoção", cor: "blue" },
          ].map((btn) => (
            <button
              key={btn.tipo}
              onClick={() => filtrarPorTipo(btn.tipo)}
              className={`
                px-5 py-2 rounded-full font-semibold cursor-pointer transition
                ${
                  tipoAtivo === btn.tipo
                    ? `bg-${btn.cor}-600 text-white`
                    : `bg-${btn.cor}-500 text-white hover:bg-${btn.cor}-600`
                }
              `}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </section>

      {/* 🏷️ TÍTULO */}
      <section className="text-center mt-10 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Encontre seu{" "}
          <span className="underline underline-offset-4 decoration-orange-400">
            Pet
          </span>
        </h1>
        <p className="mt-2 text-gray-600">
          Animais perdidos, encontrados e para adoção em Pelotas
        </p>
      </section>

      {/* 🐾 GRID */}
      <section className="max-w-7xl mx-auto px-4 mt-12 pb-16">
        {cardSelecionado ? (
          <CardExpandido
            animal={cardSelecionado}
            onClose={() => setCardSelecionado(null)}
            onExcluido={() =>
              cardSelecionado && handleExcluido(cardSelecionado.id)
            }
          />
        ) : (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              gap-8
              place-items-center
            "
          >
            {animais.length > 0 ? (
              animais.map((animal) => (
                <CardAnimal
                  key={animal.id}
                  data={animal}
                  onFazerContato={() => setCardSelecionado(animal)}
                  isAdmin={isAdmin}
                  onExcluir={excluirAnimal}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                Nenhum animal encontrado
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
