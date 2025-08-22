import { PrismaClient, TipoAnimal, tipoCidade } from '@prisma/client'
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

// utilitário para normalizar texto (remove acentos e coloca em maiúsculo)
function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
}

// ===== CRUD =====

// listar todos
router.get("/", async (req, res) => {
  try {
    const animais = await prisma.animal.findMany()
    res.status(200).json(animais)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// ===== Pesquisa =====
// Colocar ANTES da rota de :id
router.get("/pesquisa", async (req, res) => {
  const termo = (req.query.termo as string)?.trim()
  if (!termo) return res.status(400).json({ erro: 'O termo de busca é obrigatório.' })

  const filtros: any[] = []
  const termoUpper = termo.toUpperCase()

  // Filtro por tipo (enum)
  if (Object.values(TipoAnimal).includes(termoUpper as TipoAnimal)) {
    filtros.push({ tipo: termoUpper as TipoAnimal })
  }

  // Filtro por cidade (enum)
  if (Object.values(tipoCidade).includes(termoUpper as tipoCidade)) {
    filtros.push({ cidade: termoUpper as tipoCidade })
  }

  // Filtro por raça (case-insensitive)
  filtros.push({ raca: { equals: termo, mode: 'insensitive' } })

  try {
    const resultados = await prisma.animal.findMany({
      where: { OR: filtros },
    })
    res.status(200).json(resultados)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: 'Erro ao buscar dados.' })
  }
})

// buscar por id
router.get("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const animal = await prisma.animal.findFirst({
      where: { id: Number(id)}
    })
    res.status(200).json(animal)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// criar
router.post("/", async (req, res) => {
  const valida = animalSchema.safeParse(req.body)
  if (!valida.success) return res.status(400).json({ erro: valida.error.errors })

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

// atualizar
router.put("/:id", async (req, res) => {
  const { id } = req.params
  const valida = animalSchema.safeParse(req.body)
  if (!valida.success) return res.status(400).json({ erro: valida.error.errors })

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

export default router
