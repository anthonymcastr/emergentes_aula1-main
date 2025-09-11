import { useEffect, useState } from "react";
import type { Animal } from "../utils/animalType";
import { CardAnimal } from "../components/CardAnimal";
import { CardExpandido } from "../components/CardExpandido";
import { InputPesquisa } from "../components/InputPesquisa";

export default function Listagem() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [cardSelecionado, setCardSelecionado] = useState<Animal | null>(null);

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch("http://localhost:3000/animais");
      const dados = await response.json();
      setAnimais(dados);
    }
    buscaDados();
  }, []);

  return (
    <>
      <InputPesquisa setAnimais={setAnimais} />

      <div className="bg-[url('/img/fundo5.png')] bg-cover min-h-screen flex flex-col items-center px-4 py-8">
        <h1 className="mb-8 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center">
          Encontre{" "}
          <span className="underline underline-offset-3 decoration-8 decoration-orange-400 dark:decoration-orange-600">
            seu animal
          </span>
        </h1>

        {cardSelecionado ? (
          <CardExpandido
            animal={cardSelecionado}
            onClose={() => setCardSelecionado(null)}
          />
        ) : (
          <div className="flex flex-wrap justify-center gap-6 w-full">
            {animais.length > 0 ? (
              animais.map((animal) => (
                <CardAnimal
                  data={animal}
                  key={animal.id}
                  onFazerContato={() => setCardSelecionado(animal)}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center w-full">
                Nenhum animal encontrado
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
