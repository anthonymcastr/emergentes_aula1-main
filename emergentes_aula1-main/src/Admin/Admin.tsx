import { useEffect, useState } from "react";
import { VictoryPie } from "victory";
import axios from "axios";

export default function Admin() {
  const [dados, setDados] = useState<{ adocao: number; perdido: number; encontrado: number } | null>(null);

  useEffect(() => {
    async function fetchDados() {
      try {
        const res = await axios.get("https://emergentes-aula1-main-vb57.vercel.app/");
        setDados(res.data);
      } catch (err) {
        console.error("Erro ao buscar dados do gráfico:", err);
      }
    }

    fetchDados();
  }, []);

  const data = dados
    ? [
        { x: "Adoção", y: dados.adocao },
        { x: "Perdidos", y: dados.perdido },
        { x: "Encontrados", y: dados.encontrado },
      ]
    : [];

  return (
    <div className="flex min-h-screen bg-gray-100">
     

      {/* Conteúdo principal */}
      <main className="flex-1 p-10 flex flex-col items-center justify-center h-200">
        <h1 className="text-3xl font-bold mb-10">Estatísticas: Animais</h1>

        {dados ? (
          <VictoryPie
            data={data}
            colorScale={["#4ade80", "#facc15", "#f87171"]}
            labels={({ datum }) => `${datum.x}: ${datum.y}`}
            style={{
              labels: { fontSize: 5, fill: "#333" },
            }}
            height={150}
            width={150}
            padding={{ top: 20, bottom: 60, left: 60, right: 60 }}
          />
        ) : (
          <p className="text-gray-500">Carregando gráfico...</p>
        )}
      </main>
    </div>
  );
}
