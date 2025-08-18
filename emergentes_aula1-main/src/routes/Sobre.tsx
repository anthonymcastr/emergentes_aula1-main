import React from 'react';

const Sobre: React.FC = () => {
    return (
        <>
        <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-4 text-blue-700">Sobre o Aplicativo</h1>
            <p className="mb-4 text-gray-700">
                Este aplicativo foi desenvolvido para auxiliar na busca por pets perdidos na sua cidade.
                A plataforma oferece diversas funcionalidades para ajudar tutores e amantes de animais:
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-700">
                <li>Consultar uma lista de animais encontrados;</li>
                <li>Cadastrar pets localizados;</li>
                <li>Visualizar animais disponíveis para adoção.</li>
            </ul>
            <p className="mb-4 text-gray-700">
                Além disso, o App também vai oferecer futuramente recursos para facilitar o dia a dia do seu pet:
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-700">
                <li>Lembretes de vacinas e atividades;</li>
                <li>Dicas de alimentação;</li>
                <li>Possibilidade de marcar consultas com veterinários e adestradores.</li>
            </ul>
            <p className="text-gray-700">
                Nosso objetivo é conectar pessoas e promover o bem-estar dos animais, tornando a busca por pets perdidos mais eficiente e oferecendo suporte completo para os cuidados diários.
            </p>
        </div>
<footer>
    <div className="mx-auto p-2 mt-10 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Contato</h2>
        <p className="mb-2 text-gray-700">
            Se você tiver alguma dúvida ou sugestão, sinta-se à vontade para entrar em contato conosco:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-700">
            <li>Email: anthonymartins19977@gmail.com</li>
            <li>Telefone: (53) 99170-6490</li>
        </ul>
    </div>
</footer>
        </>
    );
};

export default Sobre;