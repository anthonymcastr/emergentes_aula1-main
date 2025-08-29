import express from 'express'
import cors from 'cors'


import routesAnimais from './routes/animais'
import routesPesquisa from './routes/pesquisa'
import routesClientes from './routes/clientes'
import routesLogin from './routes/login'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())


app.use("/animais", routesAnimais)
app.use("/pesquisa", routesPesquisa)
app.use("/clientes", routesClientes)
app.use("/login", routesLogin)

app.get('/', (req, res) => {
  res.send('API: Cadastro de Animais')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})