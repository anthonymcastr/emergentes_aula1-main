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
// 📤 CRIAR CONTATO (enviar mensagem)
// =====================
router.post("/", async (req, res) => {
  const valida = contatoSchema.safeParse(req.body)

  if (!valida.success) {
    return res.status(400).json({ erros: valida.error.errors })
  }

  const { mensagem, clienteId, animalId } = valida.data

  try {
    const contato = await prisma.contato.create({
      data: {
        mensagem,
        clienteId,
        animalId,
      },
      include: {
        animal: {
          include: { usuario: true },
        },
        cliente: true,
      },
    })

    // Email para o dono do animal
    if (contato.animal && contato.animal.usuario.email) {
      const html = `
        <h2>📩 Nova mensagem sobre ${contato.animal?.nome}</h2>
        <p>${mensagem}</p>
        <p>Entre na plataforma para responder.</p>
      `

      try {
        await enviarEmail(
          contato.animal.usuario.email,
          `Novo contato sobre ${contato.animal?.nome}`,
          html
        )
      } catch (error) {
        console.warn("Erro ao enviar e-mail:", error)
      }
    }

    res.status(201).json(contato)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: "Erro ao criar contato" })
  }
})


// =======================================================
// 📥 INBOX (rota ÚNICA)
// =======================================================
// tipo = cliente | usuario
// =======================================================
router.get("/inbox/:usuarioId", async (req, res) => {
  const { usuarioId } = req.params;
  const { tipo } = req.query;

  if (!usuarioId) return res.status(400).json({ erro: "UsuarioId é obrigatório" });

  try {
    let mensagens: any[] = [];

    if (tipo === "cliente") {
      // mensagens enviadas pelo cliente
      const enviadas = await prisma.contato.findMany({
        where: { clienteId: Number(usuarioId) },
        include: { animal: { include: { usuario: true } }, cliente: true },
      });

      // mensagens recebidas de volta do dono do animal
      const recebidas = await prisma.contato.findMany({
        where: { animal: { usuarioId: Number(usuarioId) } },
        include: { animal: { include: { usuario: true } }, cliente: true },
      });

      mensagens = [...enviadas, ...recebidas];
    } else if (tipo === "usuario") {
      // só mensagens recebidas do dono do animal
      mensagens = await prisma.contato.findMany({
        where: { animal: { usuarioId: Number(usuarioId) } },
        include: { animal: { include: { usuario: true } }, cliente: true },
      });
    } else {
      return res.status(400).json({ erro: "Tipo inválido" });
    }

    // ordena cronologicamente
    mensagens.sort(
      (a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime()
    );

    res.json(mensagens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao carregar inbox", detalhes: error });
  }
});


export default router
