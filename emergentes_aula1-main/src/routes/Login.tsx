import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useClienteStore } from "../context/ClienteContext"

type Inputs = {
  email: string
  senha: string
  manter: boolean
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Login() {
  const { register, handleSubmit } = useForm<Inputs>()
  const { logaCliente } = useClienteStore()
  const navigate = useNavigate()

  async function verificaLogin(data: Inputs) {
    try {
      const response = await fetch(`${apiUrl}/clientes/login`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ email: data.email, senha: data.senha })
      })

      if (response.status !== 200) {
        toast.error("Erro... Login ou senha incorretos")
        return
      }

      const dados = await response.json()
      logaCliente(dados) // 

      toast.success(`Bem-vindo, ${dados.nome}!`)
      navigate("/") 
    } catch (err) {
      console.error(err)
      toast.error("Erro ao conectar com o servidor")
    }

    
  }


  

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Dados de Acesso do Cliente
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(verificaLogin)}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seu e-mail</label>
                <input type="email" id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                  {...register("email")}
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
                <input type="password" id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                  {...register("senha")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="remember" type="checkbox" className="w-4 h-4 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" {...register("manter")} />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Manter Conectado</label>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full text-white bg-orange-600 hover:bg-orange-700 font-medium rounded-lg py-2.5">
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
