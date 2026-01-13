import { PrismaClient, TipoAnimal, tipoCidade } from "@prisma/client"
import { Router } from "express"
import { z } from "zod"
import { autentica, AuthRequest } from "../middleware/autentica"

const prisma = new PrismaClient()
const router = Router()

// ========================
// Schema de validação
// ========================
const animalSchema = z.object({
  nome: z.string().min(2, { message: "Nome deve possuir, no mínimo, 2 caracteres" }),
  idade: z.number().min(0, { message: "Idade deve ser um número positivo" }),
  raca: z.string().min(2, { message: "Espécie deve possuir, no mínimo, 2 caracteres" }),
  urlImagem: z.string().min(5, { message: "URL da imagem deve possuir, no mínimo, 5 caracteres" }),
  tipo: z.enum(["ADOCAO", "PERDIDO", "ENCONTRADO"]),
  cidade: z.enum(["PELOTAS"]),
  usuarioId: z.number().min(1, { message: "ID do usuário deve ser um número positivo" })
})

// ========================
// Função utilitária: normalize
// ========================
function normalize(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
}

// ========================
// INCLUDE USUARIO PADRÃO
// ========================
const includeUsuario = {
  usuario: {
    select: {
      id: true,
      nome: true,
      email: true,
    },
  },
}

// ========================
// GET - TODOS OS ANIMAIS
// ========================
router.get("/", async (req, res) => {
  try {
    const animais = await prisma.animal.findMany({ include: includeUsuario })
    res.status(200).json(animais)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: "Erro ao buscar animais" })
  }
})

// ========================
// GET - PESQUISA POR TERMO
// ========================
router.get("/pesquisa", async (req, res) => {
  const termo = (req.query.termo as string)?.trim()
  if (!termo) return res.status(400).json({ erro: "O termo de busca é obrigatório" })

  try {
    const resultados = await prisma.animal.findMany({
      where: {
        OR: [
          { nome: { contains: termo, mode: "insensitive" } },
          { raca: { contains: termo, mode: "insensitive" } },
        ],
      },
      include: includeUsuario,
    })

    // Filtra animais sem usuário (só por precaução)
    const resultadosComUsuario = resultados.filter((a) => a.usuario !== null)
    res.status(200).json(resultadosComUsuario)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: "Erro ao buscar dados" })
  }
})

// ========================
// GET - ANIMAL POR ID
// ========================
router.get("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const animal = await prisma.animal.findUnique({
      where: { id: Number(id) },
      include: includeUsuario,
    })

    if (!animal) return res.status(404).json({ erro: "Animal não encontrado" })

    res.status(200).json(animal)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: "Erro ao buscar animal" })
  }
})

// ========================
// POST - CRIAR ANIMAL
// ========================
router.post("/", async (req, res) => {
  const valida = animalSchema.safeParse(req.body)
  if (!valida.success) return res.status(400).json({ erro: valida.error.errors })

  const { nome, idade, raca, urlImagem, tipo, cidade, usuarioId } = valida.data

  try {
    const animal = await prisma.animal.create({
      data: { nome, idade, raca, urlImagem, tipo, cidade, usuarioId },
      include: includeUsuario,
    })
    res.status(201).json(animal)
  } catch (error) {
    console.error(error)
    res.status(400).json({ erro: "Erro ao criar animal" })
  }
})

// ========================
// PUT - ATUALIZAR ANIMAL
// ========================
router.put("/:id", autentica, async (req: AuthRequest, res) => {
  const { id } = req.params
  const valida = animalSchema.safeParse(req.body)
  if (!valida.success) return res.status(400).json({ erro: valida.error.errors })

  const { nome, idade, raca, urlImagem, tipo, cidade, usuarioId } = valida.data

  try {
    const animal = await prisma.animal.findUnique({ where: { id: Number(id) } })
    if (!animal) return res.status(404).json({ erro: "Animal não encontrado" })

    if (req.user?.role !== "admin" && animal.usuarioId !== req.user?.id) {
      return res.status(403).json({ erro: "Você não tem permissão para editar este animal" })
    }

    const atualizado = await prisma.animal.update({
      where: { id: Number(id) },
      data: { nome, idade, raca, urlImagem, tipo, cidade, usuarioId },
      include: includeUsuario,
    })

    res.status(200).json(atualizado)
  } catch (error) {
    console.error(error)
    res.status(400).json({ erro: "Erro ao atualizar animal" })
  }
})

// ========================
// DELETE - EXCLUIR ANIMAL (admin)
// ========================
router.delete("/:id", autentica, async (req: AuthRequest, res) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ erro: "Apenas administradores podem excluir animais" })
  }

  try {
    await prisma.animal.delete({ where: { id: Number(req.params.id) } })
    res.status(200).json({ mensagem: "Animal excluído com sucesso" })
  } catch (error) {
    console.error(error)
    res.status(400).json({ erro: "Erro ao excluir animal" })
  }
})

// ========================
// POST - CRIAR VÁRIOS ANIMAIS (bulk)
// ========================
router.post("/bulk", async (req, res) => {
  const animais = req.body
  try {
    const resultado = await prisma.animal.createMany({
      data: animais,
      skipDuplicates: true,
    })
    res.status(201).json(resultado)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: "Erro ao criar animais" })
  }
})

// ========================
// GET - RESUMO TIPOS
// ========================
router.get("/animais/resumo", async (req, res) => {
  try {
    const adocao = await prisma.animal.count({ where: { tipo: TipoAnimal.ADOCAO } })
    const perdido = await prisma.animal.count({ where: { tipo: TipoAnimal.PERDIDO } })
    const encontrado = await prisma.animal.count({ where: { tipo: TipoAnimal.ENCONTRADO } })

    res.json({ adocao, perdido, encontrado })
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: "Erro ao buscar resumo" })
  }
})

export default router
