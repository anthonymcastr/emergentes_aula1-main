import { Router } from "express"
import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()
const router = Router()




router.post("/", async (req, res) => {
  const { email, senha } = req.body

  const admin = await prisma.admin.findFirst({ where: { email } })
  if (!admin) return res.status(401).json({ error: "Administrador não encontrado" })

  const senhaValida = await bcrypt.compare(senha, admin.senha)
  if (!senhaValida) return res.status(401).json({ error: "E-mail ou senha incorretos" })

  const token = jwt.sign(
    { id: admin.id, role: admin.role },
    process.env.JWT_SECRET || "segredo",
    { expiresIn: "1h" }
  )

  res.status(200).json({
    id: admin.id,
    nome: admin.nome,
    email: admin.email,
    role: admin.role,
    token 
  })
})


export default router
