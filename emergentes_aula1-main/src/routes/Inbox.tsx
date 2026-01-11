import { useEffect, useState } from "react";
import { useClienteStore } from "../context/ClienteContext";
import ChatJanela from "../components/ChatJanela";
import ConversaLista from "../components/ConversaLista";

export default function Inbox() {
  const { cliente } = useClienteStore();
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [animalSelecionado, setAnimalSelecionado] = useState<number | null>(null);

  // 🔹 Carrega todas as mensagens do inbox
  useEffect(() => {
    if (!cliente?.id) return;

    async function carregarMensagens() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/contatos/inbox/${cliente?.id}?tipo=cliente`
        );
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Dados do inbox inválidos:", data);
          return;
        }

        // ordena cronologicamente
        data.sort(
          (a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime()
        );

        setMensagens(data);
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
      }
    }

    carregarMensagens();
  }, [cliente?.id]);

  // 🔹 Agrupa mensagens por animal (conversas)
  const mensagensPorAnimal = mensagens.reduce((acc, msg) => {
    const id = msg.animal.id;
    if (!acc[id]) acc[id] = [];
    acc[id].push(msg);
    return acc;
  }, {} as Record<number, any[]>);

  // 🔹 Callback para adicionar nova mensagem enviada sem duplicar
  function adicionarMensagem(msg: any) {
    setMensagens((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg].sort(
        (a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime()
      );
    });
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <ConversaLista
        conversas={mensagensPorAnimal}
        onSelect={setAnimalSelecionado}
      />

      {animalSelecionado ? (
        <ChatJanela
          mensagens={mensagensPorAnimal[animalSelecionado]}
          usuarioId={cliente?.id}
          onNovaMensagem={adicionarMensagem} // envia callback para ChatJanela
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Selecione uma conversa
        </div>
      )}
    </div>
  );
}
