
import { useEffect, useState } from "react"
import { useClienteStore } from "../context/ClienteContext"

type ContatoType = {
  id: number
  mensagem: string
  resposta?: string
  criadoEm: string
  animal: {
    id: number
    nome: string
    raca: string
    idade: number
    urlImagem: string
    cidade: string
    tipo: string
  }
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Contato() {
  const [contatos, setContatos] = useState<ContatoType[]>([])
  const { cliente } = useClienteStore()

  useEffect(() => {
    async function buscaDados() {
      if (!cliente) return
      try {
        const response = await fetch(`${apiUrl}/contatos/${cliente.id}`)
        if (!response.ok) throw new Error("Falha ao buscar contatos")
        const dados = await response.json()
        setContatos(dados)
      } catch (err) {
        console.error(err)
      }
    }
    buscaDados()
  }, [cliente])

  function dataDMA(data: string) {
    const ano = data.substring(0, 4)
    const mes = data.substring(5, 7)
    const dia = data.substring(8, 10)
    return `${dia}/${mes}/${ano}`
  }

  return (
    <section className="max-w-7xl mx-auto">
      <h1 className="mb-6 mt-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
        Histórico de <span className="underline underline-offset-3 decoration-8 decoration-orange-400 dark:decoration-orange-600">Mensagens</span>
      </h1>

      {contatos.length === 0 ? (
        <h2 className="mb-4 mt-10 text-2xl font-bold text-gray-900 dark:text-white">
          Você ainda não entrou em contato com nenhum anunciante. 🐾
        </h2>
      ) : (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Animal</th>
              <th scope="col" className="px-6 py-3">Foto</th>
              <th scope="col" className="px-6 py-3">Mensagem</th>
              <th scope="col" className="px-6 py-3">Resposta</th>
            </tr>
          </thead>
          <tbody>
            {contatos.map(contato => (
              <tr key={contato.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <p className="font-extrabold text-lg">{contato.animal.nome}</p>
                  <p className="mt-2">Raça: {contato.animal.raca} | Cidade: {contato.animal.cidade}</p>
                </th>
                <td className="px-6 py-4 w-50">
                  <img src={contato.animal.urlImagem} className="fotoAnimal" alt="Foto Animal" />
                </td>
                <td className="px-6 py-4">
                  <p><b>{contato.mensagem}</b></p>
                  <p><i>Enviado em: {dataDMA(contato.criadoEm)}</i></p>
                </td>
                <td className="px-6 py-4">
                  {contato.resposta ? (
                    <>
                      <p><b>{contato.resposta}</b></p>
                      <p><i>Respondido em: {dataDMA(contato.criadoEm)}</i></p>
                    </>
                  ) : (
                    <i>Aguardando resposta...</i>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
