// Carregando modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
//const mongoose = require('mongoose')
app = express()

// Configurações
    //Body-Parser
    app.use(bodyParser.urlencoded({extend: true}))
    app.use(bodyParser.json())
    //Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')
    //Mongoose
       //em breve
    //
// Rotas


// Outros
const PORT = 8081

app.listen(PORT, ()=>{
    console.log("Servidor Rodando")
})

