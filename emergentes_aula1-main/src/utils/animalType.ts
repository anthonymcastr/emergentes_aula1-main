import type { UsuarioType } from "./usuarioType"

export type Animal = {
  id: number
  nome: string
  idade: number
  raca: string
  urlImagem: string
  tipo: 'adocao' | 'encontrado' | 'perdido'
  cidade: string
  usuarioId: number
  usuario?: UsuarioType
}

export type AnimalType = Omit<Animal, 'id' | 'usuario'>