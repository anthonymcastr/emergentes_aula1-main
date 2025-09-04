import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

type Inputs = {
  nome: string
  email: string
  senha: string
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Cadastro() {
  const { register, handleSubmit } = useForm<Inputs>()
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Nome" {...register("nome")} required />
      <input placeholder="E-mail" {...register("email")} type="email" required />
      <input placeholder="Senha" {...register("senha")} type="password" required />
      <button type="submit">Cadastrar</button>
    </form>
  )
}
