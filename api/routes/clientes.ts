import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import bcrypt from "bcrypt"
import { z } from "zod"

const prisma = new PrismaClient()
const router = Router()

// Esquema de validação do cliente
const clienteSchema = z.object({
  nome: z.string().min(10, { message: "Nome do cliente deve possuir, no mínimo, 10 caracteres" }),
  email: z.string().email({ message: "Informe um e-mail válido" }),
  senha: z.string(),
  telefone: z.string().min(8, { message: "Informe um telefone válido" }),
})

// ---------------------------
// LISTAR CLIENTES
router.get("/", async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany()
    res.status(200).json(clientes)
  } catch (error) {
    res.status(400).json({ error })
  }
})

// ---------------------------
// CADASTRO DE CLIENTE
router.post("/cadastro", async (req, res) => {
  try {
    const parseResult = clienteSchema.safeParse(req.body)
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors.map(e => e.message).join(", ") })
    }

    const { nome, email, senha, telefone } = parseResult.data

    // Verifica se o email já existe
    const existente = await prisma.cliente.findUnique({ where: { email } })
    if (existente) return res.status(400).json({ error: "E-mail já cadastrado" })

    // Valida a senha
    const errosSenha = validaSenha(senha)
    if (errosSenha.length > 0) return res.status(400).json({ error: errosSenha.join(", ") })

    // Criptografa a senha
    const hash = await bcrypt.hash(senha, 10)

    const cliente = await prisma.cliente.create({
      data: { nome, email, senha: hash, telefone }
    })

    res.status(201).json({
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro ao cadastrar cliente" })
  }
})

// ---------------------------
// LOGIN DE CLIENTE
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body
    if (!email || !senha) return res.status(400).json({ error: "E-mail e senha são obrigatórios" })

    const cliente = await prisma.cliente.findUnique({ where: { email } })
    if (!cliente) return res.status(401).json({ error: "E-mail ou senha incorretos" })

    const senhaValida = await bcrypt.compare(senha, cliente.senha)
    if (!senhaValida) return res.status(401).json({ error: "E-mail ou senha incorretos" })

    // Retorna apenas dados públicos
    res.status(200).json({
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro ao realizar login" })
  }
})

// ---------------------------
// FUNÇÃO DE VALIDAÇÃO DE SENHA
function validaSenha(senha: string) {
  const mensa: string[] = []

  if (senha.length < 8) mensa.push("Senha deve possuir no mínimo 8 caracteres")

  let pequenas = 0
  let grandes = 0
  let numeros = 0
  let simbolos = 0

  for (const letra of senha) {
    if (/[a-z]/.test(letra)) pequenas++
    else if (/[A-Z]/.test(letra)) grandes++
    else if (/[0-9]/.test(letra)) numeros++
    else simbolos++
  }

  if (pequenas === 0) mensa.push("Senha deve possuir letra(s) minúscula(s)")
  if (grandes === 0) mensa.push("Senha deve possuir letra(s) maiúscula(s)")
  if (numeros === 0) mensa.push("Senha deve possuir número(s)")
  if (simbolos === 0) mensa.push("Senha deve possuir símbolo(s)")

  return mensa
}

export default router
