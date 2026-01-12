import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import { z } from "zod"
import { enviarEmail } from "../utils/email"

const prisma = new PrismaClient()
const router = Router()

// =====================
// Schema de validação
// =====================
const contatoSchema = z.object({
  mensagem: z.string().min(2),
  remetenteId: z.number(),
  destinatarioId: z.number(),
  animalId: z.number(),
})

// =====================
// 📤 ENVIAR MENSAGEM
// =====================
router.post("/", async (req, res) => {
  const valida = contatoSchema.safeParse(req.body)

  if (!valida.success) {
    return res.status(400).json({ erros: valida.error.errors })
  }

  const { mensagem, remetenteId, destinatarioId, animalId } = valida.data

  try {
    // ❌ evita falar consigo mesmo
    if (remetenteId === destinatarioId) {
      return res
        .status(400)
        .json({ erro: "Você não pode conversar consigo mesmo" })
    }

    // 🔎 valida animal
    const animal = await prisma.animal.findUnique({
      where: { id: animalId },
      include: {
        usuario: { select: { id: true, email: true } },
      },
    })

    if (!animal) {
      return res.status(404).json({ erro: "Animal não encontrado" })
    }

    // ✅ cria mensagem
    const contato = await prisma.contato.create({
      data: {
        mensagem,
        animalId,
        remetenteId,
        destinatarioId,
      },
      include: {
        animal: true,
        remetente: true,
        destinatario: true,
      },
    })

    // 📧 email para o destinatário
    if (animal.usuario?.email && animal.usuario.id === destinatarioId) {
      const html = `
        <h2>📩 Nova mensagem sobre ${animal.nome}</h2>
        <p>${mensagem}</p>
        <p>Acesse a plataforma para responder.</p>
      `

      try {
        await enviarEmail(
          animal.usuario.email,
          `Novo contato sobre ${animal.nome}`,
          html
        )
      } catch (err) {
        console.warn("Erro ao enviar e-mail:", err)
      }
    }

    res.status(201).json(contato)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: "Erro ao enviar mensagem" })
  }
})

// =======================================================
// 📥 INBOX — TODAS AS CONVERSAS DO USUÁRIO
// =======================================================
router.get("/inbox/:usuarioId", async (req, res) => {
  const usuarioId = Number(req.params.usuarioId)

  if (!usuarioId) {
    return res.status(400).json({ erro: "usuarioId inválido" })
  }

  try {
    const mensagens = await prisma.contato.findMany({
      where: {
        OR: [
          { remetenteId: usuarioId },
          { destinatarioId: usuarioId },
        ],
      },
      include: {
        animal: true,
        remetente: true,
        destinatario: true,
      },
      orderBy: { criadoEm: "asc" },
    })

    res.json(mensagens)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: "Erro ao carregar inbox" })
  }
})

export default router
