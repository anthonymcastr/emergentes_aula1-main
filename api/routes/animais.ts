import { PrismaClient, TipoAnimal, tipoCidade } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'
import { autentica, AuthRequest } from "../middleware/autentica";

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


function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
}


router.get("/", async (req, res) => {
  try {
    const animais = await prisma.animal.findMany()
    res.status(200).json(animais)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})


router.get("/pesquisa", async (req, res) => {
  const termo = (req.query.termo as string)?.trim()
  if (!termo) return res.status(400).json({ erro: 'O termo de busca é obrigatório.' })

  const filtros: any[] = []
  const termoUpper = termo.toUpperCase()

 
  if (Object.values(TipoAnimal).includes(termoUpper as TipoAnimal)) {
    filtros.push({ tipo: termoUpper as TipoAnimal })
  }

 
  if (Object.values(tipoCidade).includes(termoUpper as tipoCidade)) {
    filtros.push({ cidade: termoUpper as tipoCidade })
  }

 
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


router.put("/:id", autentica, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const valida = animalSchema.safeParse(req.body);
  if (!valida.success) return res.status(400).json({ erro: valida.error.errors });

  const { nome, idade, raca, urlImagem, tipo, cidade, usuarioId } = valida.data;

  try {
    const animal = await prisma.animal.findUnique({ where: { id: Number(id) } });

    if (!animal) return res.status(404).json({ erro: "Animal não encontrado" });

    if (req.user?.role !== "admin" && animal.usuarioId !== req.user?.id) {
      return res.status(403).json({ erro: "Você não tem permissão para editar este animal." });
    }

    const atualizado = await prisma.animal.update({
      where: { id: Number(id) },
      data: { nome, idade, raca, urlImagem, tipo, cidade, usuarioId }
    });

    res.status(200).json(atualizado);
  } catch (error) {
    res.status(400).json({ erro: "Erro ao atualizar animal" });
  }
});



router.delete("/:id", autentica, async (req: AuthRequest, res) => {
  console.log("Headers:", req.headers)
  console.log("User:", req.user)
  console.log("ID a deletar:", req.params.id)

  if (req.user?.role !== "admin") {
    return res.status(403).json({ erro: "Apenas administradores podem excluir animais." });
  }

  try {
    await prisma.animal.delete({
      where: { id: Number(req.params.id) }
    });
    res.status(200).json({ mensagem: "Animal excluído com sucesso" });
  } catch (error) {
    console.error("Erro Prisma:", error)
    res.status(400).json({ erro: "Erro ao excluir animal" });
  }
});




router.post("/bulk", async (req, res) => {
  const animais = req.body; // espera um array de objetos
  try {
    const resultado = await prisma.animal.createMany({
      data: animais,
      skipDuplicates: true, // opcional: ignora registros duplicados
    });
    res.status(201).json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: error });
  }
});


router.get("/animais/resumo", async (req, res) => {
  try {
    const adocao = await prisma.animal.count({ where: { tipo: TipoAnimal.ADOCAO } });
    const perdido = await prisma.animal.count({ where: { tipo: TipoAnimal.PERDIDO } });
    const encontrado = await prisma.animal.count({ where: { tipo: TipoAnimal.ENCONTRADO } });

    res.json({ adocao, perdido, encontrado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: err });
  }
});


export default router
