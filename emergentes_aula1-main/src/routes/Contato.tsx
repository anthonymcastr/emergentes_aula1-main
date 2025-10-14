import { useEffect, useState } from "react"
import { useClienteStore } from "../context/ClienteContext"
import { useAdminStore } from "../Admin/context/AdminContext"

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
    usuario?: { 
      id: number
      nome: string
      email: string
    }
  }
  cliente: { 
    id: number
    nome: string
    email: string
  }
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Contato() {
  const [contatosEnviados, setContatosEnviados] = useState<ContatoType[]>([])
  const [contatosRecebidos, setContatosRecebidos] = useState<ContatoType[]>([])
  const [grupoSelecionado, setGrupoSelecionado] = useState<string | null>(null)

  const { cliente } = useClienteStore()
  const { admin } = useAdminStore()

  useEffect(() => {
    async function buscaDados() {
      try {
        let headers = {}

        // Admin: busca todos
        if (admin?.role === "admin") {
          const res = await fetch(`${apiUrl}/contatos`, {
            headers: { Authorization: `Bearer ${admin.token}` }
          })
          if (!res.ok) throw new Error("Erro ao buscar contatos")
          const dados = await res.json()
          setContatosEnviados(dados)
        }

        // Cliente: busca enviados e recebidos
        else if (cliente) {
          const enviadosRes = await fetch(`${apiUrl}/contatos/${cliente.id}`)
          const recebidosRes = await fetch(`${apiUrl}/contatos/recebidas/${cliente.id}`)

          if (!enviadosRes.ok || !recebidosRes.ok) throw new Error("Erro ao buscar mensagens")

          const enviados = await enviadosRes.json()
          const recebidos = await recebidosRes.json()

          setContatosEnviados(enviados)
          setContatosRecebidos(recebidos)
        }
      } catch (err) {
        console.error(err)
      }
    }

    buscaDados()
  }, [admin, cliente])

  function dataDMA(data: string) {
    const ano = data.substring(0, 4)
    const mes = data.substring(5, 7)
    const dia = data.substring(8, 10)
    return `${dia}/${mes}/${ano}`
  }

  // Agrupamento para admin
  const grupos = admin?.role === "admin"
    ? contatosEnviados.reduce((acc, contato) => {
        if (!contato.animal) return acc
        const key = `${contato.cliente.id}-${contato.animal.id}`
        if (!acc[key]) {
          acc[key] = {
            cliente: contato.cliente,
            animal: contato.animal,
            mensagens: []
          }
        }
        acc[key].mensagens.push(contato)
        return acc
      }, {} as Record<string, { cliente: ContatoType["cliente"]; animal: ContatoType["animal"]; mensagens: ContatoType[] }>)
    : null

  // Admin view
  if (admin?.role === "admin") {
    return (
      <section className="max-w-7xl mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6">Mensagens dos Usuários</h1>

        {!grupoSelecionado ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grupos && Object.entries(grupos).map(([key, grupo]) => (
              <div
                key={key}
                className="bg-white p-4 rounded shadow cursor-pointer hover:bg-orange-50"
                onClick={() => setGrupoSelecionado(key)}
              >
                <h2 className="text-xl font-semibold">{grupo.cliente.nome}</h2>
                <p className="text-gray-600 text-sm">{grupo.cliente.email}</p>
                <hr className="my-2" />
                <p className="font-bold">{grupo.animal.nome} ({grupo.animal.raca})</p>
                <img src={grupo.animal.urlImagem} className="w-32 h-32 object-cover rounded mt-2" />
              </div>
            ))}
          </div>
        ) : (
          <div>
            <button
              className="mb-4 text-blue-600 underline"
              onClick={() => setGrupoSelecionado(null)}
            >
              ← Voltar
            </button>

            {grupos && grupos[grupoSelecionado] && (
              <>
                <h2 className="text-2xl font-bold mb-2">
                  Mensagem de {grupos[grupoSelecionado].cliente.nome}
                </h2>

                <p className="text-sm mb-2 text-gray-700">
                  <strong>Destinatário:</strong>{" "}
                  {grupos[grupoSelecionado].animal.usuario
                    ? `${grupos[grupoSelecionado].animal.usuario.nome} — ${grupos[grupoSelecionado].animal.usuario.email}`
                    : "Informação não disponível"}
                </p>

                <p className="text-lg mb-4">
                  Animal: <strong>{grupos[grupoSelecionado].animal.nome}</strong>
                </p>

                <div className="space-y-4">
                  {grupos[grupoSelecionado].mensagens.map((msg) => (
                    <div key={msg.id} className="bg-white p-4 rounded shadow">
                      <p><strong>Mensagem:</strong> {msg.mensagem}</p>
                      {msg.resposta && <p><strong>Resposta:</strong> {msg.resposta}</p>}
                      <p className="text-sm text-gray-500">Enviado em: {dataDMA(msg.criadoEm)}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>
    )
  }

  // Cliente view
  return (
    <section className="max-w-7xl mx-auto">
      <h1 className="mb-6 mt-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
        Histórico de <span className="underline underline-offset-3 decoration-8 decoration-orange-400 dark:decoration-orange-600">Mensagens</span>
      </h1>

      {/* Mensagens enviadas */}
      <h2 className="text-2xl font-bold mt-10 mb-4">Mensagens que você enviou</h2>
      {contatosEnviados.length === 0 ? (
        <p className="mb-6 text-lg text-gray-700">Você ainda não entrou em contato com nenhum anunciante. 🐾</p>
      ) : (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-10">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Animal</th>
              <th className="px-6 py-3">Foto</th>
              <th className="px-6 py-3">Mensagem</th>
              <th className="px-6 py-3">Resposta</th>
            </tr>
          </thead>
          <tbody>
            {contatosEnviados.map(contato => (
              <tr key={contato.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4">
                  <p className="font-bold">{contato.animal.nome}</p>
                  <p className="text-sm">Raça: {contato.animal.raca} | Cidade: {contato.animal.cidade}</p>
                </td>
                <td className="px-6 py-4">
                  <img src={contato.animal.urlImagem} className="w-24 h-24 object-cover" />
                </td>
                <td className="px-6 py-4">
                  <p><strong>{contato.mensagem}</strong></p>
                  <p className="text-sm italic">Enviado em: {dataDMA(contato.criadoEm)}</p>
                </td>
                <td className="px-6 py-4">
                  {contato.resposta ? (
                    <>
                      <p><strong>{contato.resposta}</strong></p>
                      <p className="text-sm italic">Respondido em: {dataDMA(contato.criadoEm)}</p>
                    </>
                  ) : (
                    <em>Aguardando resposta...</em>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Mensagens recebidas */}
      <h2 className="text-2xl font-bold mt-10 mb-4">Mensagens recebidas sobre seus animais</h2>
      {contatosRecebidos.length === 0 ? (
        <p className="mb-6 text-lg text-gray-700">Nenhum usuário entrou em contato com seus anúncios ainda.</p>
      ) : (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Animal</th>
              <th className="px-6 py-3">Foto</th>
              <th className="px-6 py-3">Mensagem recebida</th>
              <th className="px-6 py-3">Cliente</th>
            </tr>
          </thead>
          <tbody>
            {contatosRecebidos.map(contato => (
              <tr key={contato.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4">
                  <p className="font-bold">{contato.animal.nome}</p>
                  <p className="text-sm">Raça: {contato.animal.raca} | Cidade: {contato.animal.cidade}</p>
                </td>
                <td className="px-6 py-4">
                  <img src={contato.animal.urlImagem} className="w-24 h-24 object-cover" />
                </td>
                <td className="px-6 py-4">
                  <p><strong>{contato.mensagem}</strong></p>
                  <p className="text-sm italic">Enviado em: {dataDMA(contato.criadoEm)}</p>
                </td>
                <td className="px-6 py-4">
                  <p><strong>{contato.cliente.nome}</strong></p>
                  <p className="text-sm">{contato.cliente.email}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
