import { useForm } from "react-hook-form";
import type { Animal } from "./utils/animalType";
import { useNavigate } from "react-router-dom";

export default function Inclusao() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Animal>();
  const navigate = useNavigate();

  async function onSubmit(data: Animal) {
    console.log("Dados enviados:", data); 
    try {
      const resp = await fetch("http://localhost:3000/animais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resultado = await resp.json();
      console.log("Resposta do backend:", resultado); 
      if (!resp.ok) {
        throw new Error("Erro ao cadastrar animal");
      }

      alert("Animal cadastrado com sucesso!");
      reset();
      navigate("/listagem"); 
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar animal. Confira o console para detalhes.");
    }
  }

  return (
    <div className="bg-[url('/img/fundo5.png')] bg-cover min-h-screen pb-2">
      <div className="max-w-xl mx-auto my-6 p-6 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6">Cadastrar animal</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div>
            <label className="block mb-1 font-medium">Nome:</label>
            <input
              {...register("nome", { required: "Nome obrigatório" })}
              className="w-full border rounded px-3 py-2"
              placeholder="Ex: Desconhecido"
            />
            {errors.nome && <span className="text-red-500 text-sm">{errors.nome.message}</span>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Idade:</label>
            <input
              type="number"
              {...register("idade", { required: "Idade obrigatória", valueAsNumber: true })}
              className="w-full border rounded px-3 py-2"
            />
            {errors.idade && <span className="text-red-500 text-sm">{errors.idade.message}</span>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Raça:</label>
            <textarea
              {...register("raca", { required: "Raça obrigatória" })}
              className="w-full border rounded px-3 py-2"
              rows={3}
              placeholder="Descreva a raça"
            />
            {errors.raca && <span className="text-red-500 text-sm">{errors.raca.message}</span>}
          </div>

          <div>
            <label htmlFor="tipo" className="block mb-1 font-medium">Tipo:</label>
            <select
              {...register("tipo", { required: "Tipo obrigatório" })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Selecione um tipo</option>
              <option value="ADOCAO">Adoção</option>
              <option value="ENCONTRADO">Encontrado</option>
              <option value="PERDIDO">Perdido</option>
            </select>
            {errors.tipo && <span className="text-red-500 text-sm">{errors.tipo.message}</span>}
          </div>

          <div>
            <label htmlFor="cidade" className="block mb-1 font-medium">Cidade:</label>
            <select
              {...register("cidade", { required: "Cidade obrigatória" })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Selecione uma cidade</option>
              <option value="PELOTAS">PELOTAS</option>
             
            </select>
            {errors.cidade && <span className="text-red-500 text-sm">{errors.cidade.message}</span>}
          </div>

          <div>
            <label className="block mb-1 font-medium">URL da imagem:</label>
            <input
              {...register("urlImagem", {
                required: "URL obrigatória",
                pattern: { value: /^https?:\/\//, message: "Insira uma URL válida" }
              })}
              className="w-full border rounded px-3 py-2"
              placeholder="Ex: https://..."
            />
            {errors.urlImagem && <span className="text-red-500 text-sm">{errors.urlImagem.message}</span>}
          </div>

          <div>
            <label className="block mb-1 font-medium">ID do usuário:</label>
            <input
              type="number"
              {...register("usuarioId", { required: "Usuário obrigatório", valueAsNumber: true })}
              className="w-full border rounded px-3 py-2"
              placeholder="Ex: 1"
            />
            {errors.usuarioId && <span className="text-red-500 text-sm">{errors.usuarioId.message}</span>}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
