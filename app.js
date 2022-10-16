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
require("./models/Categoria")
const Categoria = mongoose.model("categorias")
const usuarios = require('./routes/usuarios')
const passport = require('passport')
require("./config/auth")(passport)


// Configurações
    //Sessão
    app.use(session({
        secret: "seguro",
        resave: true,
        saveUninitialized: true
    }))

    app.use(passport.initialize())
    app.use(passport.session())

    app.use(flash())
    //Midleware - intermediador de requisições
    app.use((req, res, next)=>{
        //duas variáveis globais
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
        res.locals.user = req.use || null;
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

    app.get('/postagem/:slug', (req,res) => {
        const slug = req.params.slug
        Postagem.findOne({slug}).lean().then(postagem => {
                if(postagem){
                    const post = {
                        titulo: postagem.titulo,
                        data: postagem.date,
                        conteudo: postagem.conteudo
                    }
                    res.render('postagens/index', post)
                }else{
                    req.flash("error_msg", "Essa postagem nao existe")
                    res.redirect("/")
                }
            })
            .catch(err => {
                req.flash("error_msg", "Houve um erro interno")
                res.redirect("/")
            })
    })


    app.get('/categorias', (req, res)=>{
        Categoria.find().lean().then((categorias)=>{
            res.render('categorias/index', {categorias:categorias})
        })
        .catch(err => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    })


    app.get("/categorias/:slug", (req, res)=>{
        Categoria.findOne({slug: req.params.slug}).lean().then((categoria)=>{
            if(categoria){
               Postagem.find({categoria:categoria._id}).lean().then((postagens)=>{
                    res.render('categorias/postagens', {categoria: categoria, postagens:postagens})
               }).catch(err => {
                    req.flash("error_msg", "Houve um erro interno")
                    res.redirect("/")
                })
            }
        })
        .catch(err => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    })

    app.get('/404', (req, res)=>{
        res.send("Erro 404!")
    })

   


   app.use('/usuarios', usuarios)

   app.use('/admin', admin)

// Outros
const PORT = 8081

app.listen(PORT, ()=>{
    console.log("Servidor Rodando")
})

