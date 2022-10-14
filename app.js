// Carregando modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const admin = require('./routes/admin')
//const mongoose = require('mongoose')
const app = express()

// Configurações
    //Body-Parser
    app.use(express.urlencoded({extended: true}))
    app.use(express.json())
    //Handlebars
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')
    //Mongoose
       //em breve
    //
// Rotas
   //referenciando as rotas da pasta admin
   //'/admin' é tipo um prefixo da rota, que indica o grupo de rotas
   app.use('/admin', admin)

// Outros
const PORT = 8081

app.listen(PORT, ()=>{
    console.log("Servidor Rodando")
})

