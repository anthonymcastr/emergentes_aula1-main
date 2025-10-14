import { PrismaClient, TipoAnimal } from '@prisma/client';
import router from './animais';

const prisma = new PrismaClient();

function isTipoAnimal(value: string): value is TipoAnimal {
  return Object.values(TipoAnimal).includes(value as TipoAnimal);
}

const termoMap: Record<string, TipoAnimal> = {
  ADOCAO: TipoAnimal.ADOCAO,
  PERDIDO: TipoAnimal.PERDIDO,
  ENCONTRADO: TipoAnimal.ENCONTRADO,
};

router.get('/', async (req, res) => {
  const termoOriginal = (req.query.termo as string)?.trim();

  if (!termoOriginal) {
    return res.status(400).json({ erro: 'O termo de busca é obrigatório.' });
  }

  const termoNormalizado = termoOriginal.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  const tipoParaFiltro = termoMap[termoNormalizado];

  try {
    const query = `
      SELECT * FROM "Animal"
      WHERE unaccent("raca") ILIKE unaccent($1)
      ${tipoParaFiltro ? 'OR "tipo" = $2' : ''}
    `;
    const params = tipoParaFiltro ? [`%${termoOriginal}%`, tipoParaFiltro] : [`%${termoOriginal}%`];

    const resultados = await prisma.$queryRawUnsafe(query, ...params);

    res.json(resultados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar dados.' });
  }
});

export default router;
