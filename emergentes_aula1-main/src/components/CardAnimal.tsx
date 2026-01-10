import type { Animal } from "../utils/AnimalType"

type CardAnimalProps = {
  data: Animal
  onFazerContato?: () => void
  onExcluir?: (id: number) => void
  isAdmin?: boolean
}

export function CardAnimal({
  data,
  onFazerContato,
  onExcluir,
  isAdmin,
}: CardAnimalProps) {
  const tipoConfig: Record<
    string,
    { label: string; bg: string }
  > = {
    PERDIDO: { label: "Perdido", bg: "bg-red-500" },
    ENCONTRADO: { label: "Encontrado", bg: "bg-green-500" },
    ADOCAO: { label: "Adoção", bg: "bg-blue-500" },
  }

  const tipo = tipoConfig[data.tipo]

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden relative">
      {/* Badge */}
      <span
        className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold text-white rounded-full ${tipo.bg}`}
      >
        {tipo.label}
      </span>

      {/* Imagem */}
      <img
        src={data.urlImagem}
        alt={data.nome}
        className="w-full h-48 object-cover"
      />

      {/* Conteúdo */}
      <div className="p-4">
        <h3 className="text-xl font-extrabold text-gray-900">
          {data.nome}
        </h3>

        <p className="text-gray-600 mt-1">
          Raça: <span className="font-medium">{data.raca}</span>
        </p>

        <button
          onClick={onFazerContato}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
        >
          Ver detalhes
        </button>

        {isAdmin && onExcluir && (
          <button
            onClick={() => onExcluir(data.id)}
            className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  )
}
