import type { ClienteType } from '../utils/ClienteType'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ClienteStore = {
  cliente: ClienteType | null
  logaCliente: (clienteLogado: ClienteType) => void
  deslogaCliente: () => void
}

export const useClienteStore = create<ClienteStore>()(
  persist(
    (set) => ({
      cliente: null,
      logaCliente: (clienteLogado) => set({ cliente: clienteLogado }),
      deslogaCliente: () => set({ cliente: null }),
    }),
    {
      name: 'cliente-storage', // chave no localStorage
    }
  )
)
