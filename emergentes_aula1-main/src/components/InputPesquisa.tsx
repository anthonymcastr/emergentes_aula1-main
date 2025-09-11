import { useState } from "react";
import type { Animal } from "../utils/animalType";

interface Props {
  setAnimais: (dados: Animal[]) => void;
}

export function InputPesquisa({ setAnimais }: Props) {
  const [termo, setTermo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termo.trim()) return;

    setLoading(true);
    try {
      const resposta = await fetch(
        `http://localhost:3000/animais/pesquisa?termo=${encodeURIComponent(termo)}`
      );
      const dados = await resposta.json();
      setAnimais(dados);
    } catch (error) {
      console.error("Erro ao buscar:", error);
      setAnimais([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col mx-auto max-w-5xl mt-6">
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="search"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Informe o tipo que você busca.."
            className="w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
          <button
            type="submit"
            className="absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-4 py-2"
          >
            {loading ? "Buscando..." : "Pesquisar"}
          </button>
        </div>
      </form>
    </div>
  );
}
