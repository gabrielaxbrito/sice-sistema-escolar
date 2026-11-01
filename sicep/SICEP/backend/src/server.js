import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { createClient } from '@supabase/supabase-js'

import cursosRoutes from './routes/cursos.routes.js'
import turmasRoutes from './routes/turmas.js'
import alunosRoutes from './routes/alunos.routes.js'

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