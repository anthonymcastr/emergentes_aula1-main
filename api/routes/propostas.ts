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
  mensagem: z.string().min(2, "Mensagem deve ter no mínimo 2 caracteres"),
  clienteId: z.number().min(1, "Cliente inválido"),
  animalId: z.number().min(1, "Animal inválido"),
})

// =====================
// CRIAR CONTATO
// =====================
router.post("/", async (req, res) => {
  const valida = contatoSchema.safeParse(req.body)

  if (!valida.success) {
    return res.status(400).json({ erros: valida.error.errors })
  }

  const { mensagem, clienteId, animalId } = valida.data

  try {
    // cria contato
    const contato = await prisma.contato.create({
      data: {
        mensagem,
        clienteId,
        animalId,
      },
    })

    // busca animal e dono
    const animal = await prisma.animal.findUnique({
      where: { id: animalId },
      include: {
        usuario: true,
      },
    })

    // envia email para o dono do animal
    if (animal?.usuario?.email) {
      const html = `
        <h2>📩 Nova mensagem sobre ${animal.nome}</h2>
        <p><strong>Mensagem:</strong></p>
        <p>${mensagem}</p>
        <p>Entre na plataforma para responder.</p>
      `

      try {
        await enviarEmail(
          animal.usuario.email,
          `Novo contato sobre ${animal.nome}`,
          html
        )
      } catch (emailError) {
        console.warn("Erro ao enviar e-mail:", emailError)
      }
    }

    res.status(201).json(contato)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: "Erro ao criar contato" })
  }
})

// =======================================================
// 📥 MENSAGENS RECEBIDAS (usuário dono do animal)
// IMPORTANTE: vem ANTES da rota genérica
// =======================================================
router.get("/recebidas/:usuarioId", async (req, res) => {
  const { usuarioId } = req.params

  try {
    const contatosRecebidos = await prisma.contato.findMany({
      where: {
        animal: {
          usuarioId: Number(usuarioId)
        }
      },
      include: {
        animal: {
          include: {
            usuario: true
          }
        },
        cliente: true
      },
      orderBy: { criadoEm: 'desc' }
    })

    res.status(200).json(contatosRecebidos)
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar mensagens recebidas" })
  }
})


// =======================================================
// 📤 MENSAGENS ENVIADAS (cliente logado)
// =======================================================
router.get("/:clienteId", async (req, res) => {
  const { clienteId } = req.params

  try {
    const contatos = await prisma.contato.findMany({
      where: {
        clienteId: Number(clienteId),
      },
      include: {
        animal: {
          include: {
            usuario: true,
          },
        },
        cliente: true,
      },
      orderBy: {
        criadoEm: "desc",
      },
    })

    res.status(200).json(contatos)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: "Erro ao buscar mensagens enviadas" })
  }
})

export default router
