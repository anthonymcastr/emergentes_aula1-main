import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

type Inputs = {
  nome: string
  email: string
  senha: string
  telefone: string
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Cadastro() {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>()
  const navigate = useNavigate()

  const onSubmit = async (data: Inputs) => {
    try {
      const response = await fetch(`${apiUrl}/clientes/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (response.status === 201) {
        toast.success("Cadastro realizado com sucesso!")
        navigate("/login")
      } else {
        const erro = await response.json()
        toast.error(erro.error || "Erro no cadastro")
      }
    } catch (err) {
      console.error(err)
      toast.error("Erro ao conectar com o servidor")
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full bg-white rounded-lg shadow dark:border md:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Criar Conta
          </h1>

          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>

           
            <div>
              <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome completo</label>
              <input
                type="text"
                id="nome"
                {...register("nome", { required: "Nome é obrigatório", minLength: { value: 10, message: "Mínimo 10 caracteres" } })}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
            </div>

         
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-mail</label>
              <input
                type="email"
                id="email"
                {...register("email", { required: "E-mail é obrigatório" })}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

           
            <div>
              <label htmlFor="telefone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Telefone</label>
              <input
                type="tel"
                id="telefone"
                {...register("telefone", { required: "Telefone é obrigatório", minLength: { value: 8, message: "Mínimo 8 dígitos" } })}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone.message}</p>}
            </div>

           
            <div>
              <label htmlFor="senha" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
              <input
                type="password"
                id="senha"
                {...register("senha", { required: "Senha é obrigatória" })}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha.message}</p>}
            </div>

           
            <button
              type="submit"
              className="w-full text-white bg-orange-600 hover:bg-orange-700 font-medium rounded-lg py-2.5"
            >
              Cadastrar
            </button>

           
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Já tem uma conta?{" "}
              <a
                href="/login"
                className="text-orange-600 hover:underline dark:text-orange-400"
              >
                Faça login
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
