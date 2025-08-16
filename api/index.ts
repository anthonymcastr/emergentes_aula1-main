import express from 'express'
import cors from 'cors'


import routesAnimais from './routes/animais'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())


app.use("/animais", routesAnimais)

app.get('/', (req, res) => {
  res.send('API: Cadastro de Animais')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})