import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()
const router = Router()

const animalSchema = z.object({
  nome: z.string().min(2, { message: "Nome deve possuir, no mínimo, 2 caracteres" }),
  idade: z.number().min(0, { message: "Idade deve ser um número positivo" }),
  raca: z.string().min(2, { message: "Espécie deve possuir, no mínimo, 2 caracteres" }),
  urlImagem: z.string().min(5, { message: "URL da imagem deve possuir, no mínimo, 5 caracteres" }),
  tipo: z.enum(["ADOCAO", "PERDIDO", "ENCONTRADO"]), 
  cidade: z.enum(["PELOTAS"]),
  usuarioId: z.number().min(1, { message: "ID do usuário deve ser um número positivo" })
})

// listar 
router.get("/", async (req, res) => {
  try {
    const animais = await prisma.animal.findMany()
    res.status(200).json(animais)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// criar
router.post("/", async (req, res) => {
  const valida = animalSchema.safeParse(req.body)
  if (!valida.success) {
    return res.status(400).json({ erro: valida.error.errors })
  }

  const { nome, idade, raca, urlImagem, tipo, cidade, usuarioId } = valida.data

  try {
    const animal = await prisma.animal.create({
      data: { nome, idade, raca, urlImagem, tipo, cidade, usuarioId }
    })
    res.status(201).json(animal)
  } catch (error) {
    res.status(400).json({ error })
  }
})

// excluir
router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const animal = await prisma.animal.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(animal)
  } catch (error) {
    res.status(400).json({ error })
  }
})

// atualizar
router.put("/:id", async (req, res) => {
  const { id } = req.params

  const valida = animalSchema.safeParse(req.body)
  if (!valida.success) {
    return res.status(400).json({ erro: valida.error.errors })
  }

  const { nome, idade, raca, urlImagem, tipo, cidade, usuarioId } = valida.data

  try {
    const animal = await prisma.animal.update({
      where: { id: Number(id) },
      data: { nome, idade, raca, urlImagem, tipo, cidade, usuarioId }
    })
    res.status(200).json(animal)
  } catch (error) {
    res.status(400).json({ error })
  }
})

export default router
