import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.tsx'
import Inclusao from './routes/Inclusao.tsx'
import Listagem from './routes/Listagem.tsx'
import Sobre from './routes/Sobre.tsx'
import Login from './routes/Login.tsx'
import Contato from './routes/Contato.tsx'
import LoginAdmin from './Admin/login-admin.tsx'
import Admin from './Admin/Admin.tsx'

import Layout from './Layout.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'


const rotas = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: 'inclusao', element: <Inclusao /> },
      { path: 'listagem', element: <Listagem /> },
      { path: 'sobre', element: <Sobre /> },
      { path: 'login', element: <Login />},
      { path: 'contato', element: <Contato />},
      { path: 'login-admin', element: <LoginAdmin />},
      { path: 'admin', element: <Admin />}
      
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
)