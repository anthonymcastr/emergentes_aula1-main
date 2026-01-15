import { Router } from "express"
import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()
const router = Router()





// BLOQUEIA TODAS AS REQUISIÇÕES NA ROTA DE LOGIN-ADMIN
router.use((req, res) => {
  res.status(403).json({ error: "Rota de login-admin temporariamente desabilitada" })
})


export default router
