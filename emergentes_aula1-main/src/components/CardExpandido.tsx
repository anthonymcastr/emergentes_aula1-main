import { useState } from "react";
import type { Animal } from "../utils/animalType";

type Props = {
  animal: Animal;
  onClose: () => void;
};

export function CardExpandido({ animal, onClose }: Props) {
  const [mensagem, setMensagem] = useState("");

  const handleEnviar = () => {
    console.log("Mensagem enviada:", mensagem);
    alert(`Mensagem enviada para o dono de ${animal.nome}: "${mensagem}"`);
    setMensagem("");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 dark:hover:text-white float-right text-xl font-bold"
        >
          ✕
        </button>

        <img src={animal.urlImagem} className="w-full h-64 object-cover rounded-lg mb-4" />
        <h2 className="text-2xl font-bold">{animal.nome}</h2>
        <p className="text-gray-600 dark:text-gray-300">Raça: {animal.raca}</p>
        <p className="text-gray-600 dark:text-gray-300">Tipo: {animal.tipo}</p>
        <p className="text-gray-600 dark:text-gray-300">Idade: {animal.idade} anos</p>

        <textarea
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Escreva sua mensagem..."
          className="w-full mt-4 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={4}
        />

        <button
          onClick={handleEnviar}
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
