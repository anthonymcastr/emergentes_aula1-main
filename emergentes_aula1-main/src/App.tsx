export default function App() {
  return (
    <div className="text-center bg-[url('/img/fundo5.png')] bg-cover min-h-screen">
      <h1 className="mb-4 pt-6 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Encontre ou cadastre um animal!
      </h1>
      <p className="mb-6 text-lg font-bold text-gray-600 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-600">
        Além de cadastrar, é possível buscar animais perdidos ou disponíveis para adoção!
      </p>
      <div
>
        <div className="inline-flex items-center justify-center px-5 py-3 ">
           <img
              src="/img/logo_petpel.png"
              className="h-100 "
              alt="Logo Petpel"
            />
        </div>
        <div>
          <a
            href="/sobre"
            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
          >
            Saiba mais
            <svg
              className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
