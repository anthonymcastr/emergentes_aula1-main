import { Router } from "express"
import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const router = Router()

// CRIAÇÃO DE ADMIN
router.post("/", async (req, res) => {
  try {
    const { nome, email, senha } = req.body
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Nome, email e senha são obrigatórios" })
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const novoAdmin = await prisma.admin.create({
      data: { nome, email, senha: senhaHash }
    })

    res.status(201).json({
      id: novoAdmin.id,
      nome: novoAdmin.nome,
      email: novoAdmin.email,
      role: novoAdmin.role
    })
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar admin" })
  }
})

export default router
