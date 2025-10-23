import { useEffect, useState } from "react"
import type { Animal } from "../utils/animalType"
import { CardAnimal } from "../components/CardAnimal"
import { CardExpandido } from "../components/CardExpandido"
import { InputPesquisa } from "../components/InputPesquisa"
import { useAdminStore } from "../Admin/context/AdminContext" 

export default function Listagem() {
  const [animais, setAnimais] = useState<Animal[]>([])
  const [cardSelecionado, setCardSelecionado] = useState<Animal | null>(null)
  const { admin } = useAdminStore() 
  const isAdmin = admin?.role === "admin"

  const buscaDados = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/animais`)
      const dados = await response.json()
      setAnimais(dados)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    buscaDados()
  }, [])

  const handleExcluido = (id: number) => {
    setAnimais((prev) => prev.filter((animal) => animal.id !== id))
  }

  const excluirAnimal = async (id: number) => {
    if (!confirm("Deseja realmente excluir este animal?")) return

    try {
      const token = admin?.token 

      if (!token) {
        alert("Você precisa estar logado como administrador para excluir")
        return
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/animais/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) throw new Error("Erro ao excluir")

      alert("Animal excluído com sucesso!")
      handleExcluido(id)
    } catch (err) {
      console.error(err)
      alert("Erro ao excluir o animal")
    }
  }

  return (
    <>
      <InputPesquisa setAnimais={setAnimais} />

      <div className="bg-[url('/img/fundo5.png')] bg-cover min-h-screen flex flex-col items-center px-4 py-8">
        <h1 className="mb-8 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center">
          Encontre{" "}
          <span className="underline underline-offset-3 decoration-8 decoration-orange-400 dark:decoration-orange-600">
            seu animal
          </span>
        </h1>

        {cardSelecionado ? (
          <CardExpandido
            animal={cardSelecionado}
            onClose={() => setCardSelecionado(null)}
            onExcluido={() => cardSelecionado && handleExcluido(cardSelecionado.id)}
          />
        ) : (
          <div className="flex flex-wrap justify-center gap-6 w-full">
            {animais.length > 0 ? (
              animais.map((animal) => (
                <CardAnimal
                  data={animal}
                  key={animal.id}
                  onFazerContato={() => setCardSelecionado(animal)}
                  isAdmin={isAdmin}
                  onExcluir={excluirAnimal}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center w-full">
                Nenhum animal encontrado
              </p>
            )}
          </div>
        )}
      </div>
    </>
  )
}
