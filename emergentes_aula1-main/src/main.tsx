import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import App from './App.tsx';
import Inclusao from './routes/Inclusao.tsx';
import Listagem from './routes/Listagem.tsx';
import Sobre from './routes/Sobre.tsx';
import Login from './routes/Login.tsx';
import Contato from './routes/Contato.tsx';
import LoginAdmin from './Admin/login-admin.tsx';
import Admin from './Admin/Admin.tsx';
import Cadastro from "./routes/Cadastro"

import Layout from './Layout.tsx';
import AdminLayout from './Admin/AdminLayout.tsx';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const rotas = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // layout com título / header
    children: [
      { index: true, element: <Listagem /> }, // 🟢 HOME AGORA
      { path: 'inclusao', element: <Inclusao /> },
      { path: 'sobre', element: <Sobre /> },
      { path: 'login', element: <Login /> },
      { path: 'contato', element: <Contato /> },
      { path: 'cadastro', element: <Cadastro /> },
      { path: 'login-admin', element: <LoginAdmin /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />, // layout admin
    children: [
      { index: true, element: <Admin /> },
      { path: 'listagem', element: <Listagem /> },
      { path: 'contato', element: <Contato /> },
    ],
  },
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>
);
