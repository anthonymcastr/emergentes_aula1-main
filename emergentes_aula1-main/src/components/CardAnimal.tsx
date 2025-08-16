import type { Animal } from "../utils/animalType.ts"

export function CardAnimal({data}: {data: Animal}) {
    const tipoCor = {
        perdido: "text-red-600 font-bold",
        encontrado: "text-green-600 font-bold",
        adocao: "text-blue-600 font-bold"
    }[data.tipo.toLowerCase()] || "text-gray-600"


    
    return (
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
                <img className="rounded-t-lg w-200 h-50" src={data.urlImagem} alt="Foto" />
            </a>
            <div className="p-5">
                <a href="#">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {data.nome} 
                        
                    </h5>
                    <h4 className="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
                        Idade: {data.idade} anos
                    </h4>
                </a>
                <p className={`mb-3 font-bold ${tipoCor}`}>
                   Tipo: {data.tipo}
                </p>
                <p className={`mb-3 font-bold`}>
                   Raça: {data.raca}
                </p>
                
                <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Fazer contato
                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </a>
            </div>
        </div>
    )
}