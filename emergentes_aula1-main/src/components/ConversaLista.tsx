interface Props {
  conversas: Record<number, any[]>;
  onSelect: (animalId: number) => void;
}

export default function ConversaLista({ conversas, onSelect }: Props) {
  const listaConversas = Object.entries(conversas);

  return (
    <aside className="w-80 border-r bg-white overflow-y-auto">
      <h2 className="text-xl font-bold p-4 border-b">Conversas</h2>

      {listaConversas.length === 0 ? (
        <div className="p-4 text-gray-500 text-sm">
          Nenhuma conversa encontrada
        </div>
      ) : (
        listaConversas.map(([animalId, msgs]) => {
          const ultima = msgs[msgs.length - 1];
          const animal = ultima?.animal;

          if (!animal) return null;

          return (
            <div
              key={animalId}
              onClick={() => onSelect(Number(animalId))}
              className="flex gap-3 items-center p-4 cursor-pointer hover:bg-gray-100 transition"
            >
              <img
                src={animal.urlImagem}
                alt={animal.nome}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="flex-1">
                <p className="font-semibold">{animal.nome}</p>
                <p className="text-sm text-gray-500 truncate">
                  {ultima.mensagem}
                </p>
              </div>
            </div>
          );
        })
      )}
    </aside>
  );
}
