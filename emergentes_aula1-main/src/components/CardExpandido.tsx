import { useState } from "react";
import type { AnimalComUsuario } from "../utils/AnimalType";
import { useClienteStore } from "../context/ClienteContext";

type Props = {
  animal: AnimalComUsuario;
  onClose: () => void;
  onExcluido?: () => void;
};

export function CardExpandido({ animal, onClose, onExcluido }: Props) {
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const { cliente } = useClienteStore();

  const usuarioLogado = !!cliente;
  const isAdmin = cliente?.role === "admin";
  const apiUrl = import.meta.env.VITE_API_URL;
  // 🔍 LOG ao montar o componente
  console.log("=== CardExpandido MONTADO ===");
  console.log("Animal recebido:", animal);
  console.log("animal.usuario:", animal.usuario);
  console.log("animal.usuarioId:", animal.usuarioId);
  // ========================
  // Enviar mensagem para dono do animal
  // ========================
  const handleEnviar = async () => {
    console.log("=== DEBUG ENVIAR MENSAGEM ===");
    console.log("Cliente logado:", cliente);
    console.log("Cliente ID:", cliente?.id);
    console.log("Animal completo:", animal);
    console.log("Animal.usuario:", animal.usuario);
    console.log("Animal.usuarioId:", animal.usuarioId);
    console.log("Animal.usuario?.id:", animal.usuario?.id);

    if (!cliente?.id) return alert("Você precisa estar logado");
    if (!mensagem.trim()) return alert("Digite uma mensagem");

    // ✅ Verificação segura do dono do animal
    // Tenta usar animal.usuario.id OU animal.usuarioId como fallback
    const donoId = animal.usuario?.id || animal.usuarioId;
    console.log("donoId calculado:", donoId);

    if (!donoId) {
      console.error("ERRO: Não foi possível determinar o dono do animal");
      console.error("animal.usuario:", animal.usuario);
      console.error("animal.usuarioId:", animal.usuarioId);
      return alert("Erro: dono do animal não encontrado");
    }

    // Evita enviar mensagem para si mesmo
    if (cliente.id === donoId) {
      return alert("Você não pode enviar mensagem para si mesmo");
    }

    try {
      setEnviando(true);

      const payload = {
        mensagem,
        animalId: animal.id,
        remetenteId: cliente.id, // quem está enviando
        destinatarioId: donoId, // dono do animal
      };
      console.log("Payload enviado:", payload);
      console.log("URL:", `${apiUrl}/contatos`);

      const res = await fetch(`${apiUrl}/contatos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const erro = await res.json();
        console.error("Erro da API:", erro);
        throw new Error(erro?.erro || "Erro ao enviar mensagem");
      }

      const resultado = await res.json();
      console.log("Resposta sucesso:", resultado);
      setMensagem("");
      alert("Mensagem enviada com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar mensagem");
    } finally {
      setEnviando(false);
    }
  };

  // ========================
  // Excluir animal (apenas admin)
  // ========================
  const handleExcluir = async () => {
    if (!confirm("Deseja realmente excluir este animal?")) return;

    try {
      const token = cliente?.token;
      if (!token && !isAdmin)
        return alert("Apenas administradores podem excluir animais");

      const res = await fetch(`${apiUrl}/animais/${animal.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) throw new Error("Erro ao excluir animal");

      alert("Animal excluído com sucesso!");
      onExcluido?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir animal");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative">
        {/* Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
        >
          ✕
        </button>

        {/* Imagem do animal */}
        <img
          src={animal.urlImagem}
          alt={animal.nome}
          className="w-full h-64 object-cover rounded-xl"
        />

        {/* Informações */}
        <div className="mt-4">
          <h2 className="text-2xl font-extrabold">{animal.nome}</h2>
          <p className="mt-1 text-gray-600">
            Raça: <strong>{animal.raca}</strong>
          </p>
          <p className="text-gray-600">
            Tipo: <strong>{animal.tipo}</strong>
          </p>
          <p className="text-gray-600">
            Idade: <strong>{animal.idade} anos</strong>
          </p>
          <p className="text-gray-600">
            Cidade: <strong>{animal.cidade}</strong>
          </p>
          <p className="text-gray-600">
            Responsável:{" "}
            <strong>{animal.usuario?.nome || "Não informado"}</strong>
          </p>
        </div>

        {/* Área de mensagem */}
        <textarea
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          rows={4}
          placeholder={
            usuarioLogado
              ? "Escreva sua mensagem para o responsável..."
              : "Faça login para enviar mensagem"
          }
          disabled={!usuarioLogado || enviando}
          className="mt-4 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />

        {/* Botões */}
        <button
          onClick={handleEnviar}
          disabled={!usuarioLogado || enviando}
          className={`mt-4 w-full py-2 rounded-lg font-semibold transition ${
            usuarioLogado
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          {enviando ? "Enviando..." : "Enviar mensagem"}
        </button>

        {isAdmin && (
          <button
            onClick={handleExcluir}
            className="mt-3 w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            Excluir Animal (Admin)
          </button>
        )}
      </div>
    </div>
  );
}
