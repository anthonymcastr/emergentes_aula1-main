import { Router } from "express"
import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const router = Router()


// BLOQUEIA TODAS AS REQUISIÇÕES NA ROTA DE ADMIN
router.use((req, res) => {
  res.status(403).json({ error: "Rota de admin temporariamente desabilitada" })
})

export default router
