import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()
const router = Router()

// Validação com zod
const contatoSchema = z.object({
  mensagem: z.string().min(2, "Mensagem deve ter no mínimo 2 caracteres"),
  clienteId: z.number().min(1, "Cliente inválido"),
  animalId: z.number().min(1, "Animal inválido"),
})

// Criar contato
router.post("/", async (req, res) => {
  const valida = contatoSchema.safeParse(req.body)
  if (!valida.success) {
    return res.status(400).json({ erro: valida.error.errors })
  }

  const { mensagem, clienteId, animalId } = valida.data

  try {
    const contato = await prisma.contato.create({
      data: { mensagem, clienteId, animalId }
    })
    res.status(201).json(contato)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// Listar mensagens de um cliente
// Listar mensagens de um cliente (quem enviou)
router.get("/:clienteId", async (req, res) => {
  const { clienteId } = req.params
  try {
    const contatos = await prisma.contato.findMany({
      where: { clienteId: Number(clienteId) },
      include: {
        animal: {
          include: {
            usuario: true, // <- pega o dono do animal (destinatário)
          }
        },
        cliente: true, // <- quem enviou a mensagem
      },
      orderBy: { criadoEm: 'desc' }
    })
    res.status(200).json(contatos)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.get("/recebidas/:usuarioId", async (req, res) => {
  const { usuarioId } = req.params

  try {
    const contatosRecebidos = await prisma.contato.findMany({
      where: {
        animal: {
          usuarioId: Number(usuarioId) // só pega mensagens dos animais que ele postou
        }
      },
      include: {
        animal: true,
        cliente: true
      },
      orderBy: { criadoEm: 'desc' }
    })

    res.status(200).json(contatosRecebidos)
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar mensagens recebidas", detalhes: error })
  }
})


export default router
