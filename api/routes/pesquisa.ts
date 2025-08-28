import { PrismaClient, TipoAnimal } from '@prisma/client';
import router from './animais';

const prisma = new PrismaClient();

function isTipoAnimal(value: string): value is TipoAnimal {
  return Object.values(TipoAnimal).includes(value as TipoAnimal);
}

router.get('/', async (req, res) => {
  const termo = (req.query.termo as string)?.trim();

  if (!termo) {
    return res.status(400).json({ erro: 'O termo de busca é obrigatório.' });
  }

  const filtros: any[] = [];

  
  filtros.push({
    raca: {
      contains: termo,
      mode: 'insensitive',
    },
  });

  
  if (isTipoAnimal(termo.toUpperCase())) {
    filtros.push({
      tipo: termo.toUpperCase() as TipoAnimal,
    });
  }

  try {
    const resultados = await prisma.animal.findMany({
      where: {
        OR: filtros,
      },
    });

    res.json(resultados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar dados.' });
  }
});

export default router
