import { PrismaClient, TipoAnimal } from '@prisma/client';
import router from './animais';

const prisma = new PrismaClient();

function normalizarTexto(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

// Mapeia versões normalizadas para enums válidos
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

  const termoNormalizado = normalizarTexto(termoOriginal);
  console.log("Original:", termoOriginal, "→ Normalizado:", termoNormalizado);

  const tipoParaFiltro = termoMap[termoNormalizado];

  if (!tipoParaFiltro) {
    return res.status(404).json({ erro: 'Tipo não encontrado.' });
  }

  try {
    const resultados = await prisma.animal.findMany({
      where: {
        tipo: tipoParaFiltro,
      },
    });

    res.json(resultados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar dados.' });
  }
});

export default router;
