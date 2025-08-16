import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.tsx'
import Inclusao from './Inclusao.tsx'
import Listagem from './Listagem.tsx'
import Sobre from './Sobre.tsx'

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
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
)