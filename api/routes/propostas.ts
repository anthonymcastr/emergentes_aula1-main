import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'
import { enviarEmail } from '../utils/email' 

const prisma = new PrismaClient()
const router = Router()


const contatoSchema = z.object({
  mensagem: z.string().min(2, "Mensagem deve ter no mínimo 2 caracteres"),
  clienteId: z.number().min(1, "Cliente inválido"),
  animalId: z.number().min(1, "Animal inválido"),
})


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

    const animal = await prisma.animal.findUnique({
      where: { id: animalId },
      include: {
        usuario: true
      }
    })

    if (animal && animal.usuario?.email) {
      const html = `
        <h2>Nova mensagem recebida sobre ${animal.nome}</h2>
        <p><strong>Mensagem:</strong> ${mensagem}</p>
        <p>Entre em contato com o interessado!</p>
      `

      try {
        await enviarEmail(animal.usuario.email, `Novo contato sobre ${animal.nome}`, html)
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



router.get("/:clienteId", async (req, res) => {
  const { clienteId } = req.params
  try {
    const contatos = await prisma.contato.findMany({
      where: { clienteId: Number(clienteId) },
      include: {
        animal: {
          include: {
            usuario: true, 
          }
        },
        cliente: true, 
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
          usuarioId: Number(usuarioId)
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
