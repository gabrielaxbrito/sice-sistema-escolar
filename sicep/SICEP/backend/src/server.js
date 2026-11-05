import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'

import { createClient } from '@supabase/supabase-js'

import cursosRoutes from './routes/cursos.routes.js'
import turmasRoutes from './routes/turmas.js'
import alunosRoutes from './routes/alunos.routes.js'
import ajudaRoutes from './routes/ajuda.routes.js'

// Carrega o .env que fica ao lado deste arquivo (backend/src/.env), não importa
// de qual pasta o servidor for iniciado. Depois chama o padrão (pasta atual),
// que não sobrescreve nada já carregado.
dotenv.config({ path: fileURLToPath(new URL('.env', import.meta.url)) })
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(alunosRoutes)

// =========================
// SUPABASE
// =========================

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

// =========================
// ROTAS
// =========================

app.use(cursosRoutes)
app.use(turmasRoutes)
// Assistente de IA (a chave da Groq fica só aqui no servidor: GROQ_API_KEY no .env)
app.use(ajudaRoutes)
app.use(alunosRoutes)

// =========================
// BUSCAR PROFESSOR POR ID
// =========================

app.get("/professores/:id", async (req, res) => {

  const id = req.params.id

  const { data, error } = await supabase
    .from("professores")
    .select("*")
    .eq("id", id)
    .single()

  if(error){

    return res.status(404).json({
      error: "Professor não encontrado"
    })

  }

  res.json(data)

})

// =========================
// SERVER
// =========================

app.listen(process.env.PORT, () => {

  console.log(`
  Servidor rodando:
  http://localhost:${process.env.PORT}
  `)

})