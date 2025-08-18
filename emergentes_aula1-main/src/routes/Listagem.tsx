import { useEffect, useState } from "react";
import type { Animal } from "../utils/animalType";
import { CardAnimal } from "../components/CardAnimal";
import { InputPesquisa } from "../components/InputPesquisa";

export default function Listagem() {
  const [animais, setAnimais] = useState<Animal[]>([]);

   useEffect(() => {
    async function buscaDados() {
      const response = await fetch("http://localhost:3000/animais")
      const dados = await response.json()
      console.log(dados)
      setAnimais(dados)
    }
    buscaDados()
  }, [])

  const listaAnimais = animais.map( animal => (
    <CardAnimal data={animal} key={animal.id} />
  ))
  return (
    <>
    <InputPesquisa />
      <div className="bg-[url('/img/fundo5.png')] bg-cover min-h-screen mx-auto px-5">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Encontre <span className="underline underline-offset-3 decoration-8 decoration-orange-400 dark:decoration-orange-600">seu animal</span>
        </h1>
        <div className="flex gap-3">
          {listaAnimais}
        </div>
      </div>
    </>
  );
}
