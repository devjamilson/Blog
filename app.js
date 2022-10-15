// Carregando modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const admin = require('./routes/admin')
//modulo padrão do node para manipular arquivos
const path =  require('path')
//config a conexão com o mongodb
const mongoose = require('mongoose')
const app = express()
const session = require("express-session")
const flash = require("connect-flash")
require("./models/Postagens")
const Postagem = mongoose.model("postagens")

// Configurações
    //Sessão
    app.use(session({
        secret: "seguro",
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())
    //Midleware - intermediador de requisições
    app.use((req, res, next)=>{
        //duas variáveis globais
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        next()
    })

    //Body-Parser
    app.use(express.urlencoded({extended: true}))
    app.use(express.json())
    //Handlebars
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')
    //Mongoose
    mongoose.Promise = global.Promise
    mongoose.connect('mongodb://localhost/blogapp').then(()=>{
        console.log("Conectado ao Mongo")
    }).catch((err)=>{
        console.log("Erro ao se conectar" + err)
    })
    //Public - arquivos estáticos
    //ou seja, estamos dizendo ao express que a pasta que guarda o nossos arquivos estático é a public
    app.use(express.static(path.join(__dirname, "public")))
// Rotas
   //referenciando as rotas da pasta admin
   //'/admin' é tipo um prefixo da rota, que indica o grupo de rotas
   app.get('/', (req, res) => {
        Postagem.find().lean().populate("categoria").sort({data: 'desc'}).then((postagens) => {
            res.render("index", {postagens: postagens})
        }).catch((err) => {
            req.flash("error_msg", "Não foi possível carregar os posts")
            res.redirect("/404")
        })
    })

    app.get('/404', (req, res)=>{
        res.send("Erro 404!")
    })

   app.use('/admin', admin)

// Outros
const PORT = 8081

app.listen(PORT, ()=>{
    console.log("Servidor Rodando")
})

