import type { Animal } from "../utils/AnimalType.ts";

type CardAnimalProps = {
  data: Animal;
  onFazerContato?: () => void;
  onExcluir?: (id: number) => void; // nova prop para admin
  isAdmin?: boolean;
};

export function CardAnimal({ data, onFazerContato, onExcluir, isAdmin }: CardAnimalProps) {
  // Mapeia o enum para nome amigável com acento
  const tipoLabels: Record<string, string> = {
    ADOCAO: "ADOÇÃO",
    PERDIDO: "PERDIDO",
    ENCONTRADO: "ENCONTRADO",
  };

  // Usa a chave exatamente como vem no enum (maiúscula)
 const tipoCor = {
  PERDIDO: "text-red-600 font-bold",
  ENCONTRADO: "text-green-600 font-bold",
  ADOCAO: "text-blue-600 font-bold",
}[data.tipo.toUpperCase()] || "text-gray-600";

  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <img className="rounded-t-lg w-200 h-50" src={data.urlImagem} alt="Foto" />
      <div className="p-5">
        <h5 className="underline mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Nome: {data.nome}
        </h5>
        <h4 className="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
          Idade: {data.idade} anos
        </h4>
        <p className={`mb-2 font-extrabold ${tipoCor}`}>
          Tipo: {tipoLabels[data.tipo] || data.tipo}
        </p>
        <p className={`mb-2 font-bold`}>Raça: {data.raca}</p>
        <p className={`mb-2 font-bold`}>Cidade: {data.cidade}</p>

        <button
          onClick={onFazerContato}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 mt-2"
        >
          Fazer contato
        </button>

        {isAdmin && onExcluir && (
          <button
            onClick={() => onExcluir(data.id)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 mt-2 ml-2"
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}
