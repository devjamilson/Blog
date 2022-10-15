//aqui eu terei todas as minhas rotas do admin, e uma boa pratica segmentar as rotas
const express = require('express')
//express.Router é o componente que uso para criar rotas em arquivos separados
const router = express.Router()
//é assim que se usa um model de forma externa
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")



router.get('/', (req, res) =>{
    res.render("admin/index")
})

router.get('/posts', (req, res) =>{
    res.send("Página de post do painel adm")
})

router.get('/categorias', (req, res) =>{
    res.render("admin/categorias")
})

router.get('/categorias/add', (req, res) =>{
    res.render("admin/addcategoria")
})

//rota responsável por criar uma nova categoria dentro do banco de dados
router.post('/categorias/nova',(req, res) =>{
    let erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido!"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido!"})
    }

    if(erros.length > 0){
        res.render('admin/categorias', {erros: erros})
    }

    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(()=>{
        console.log("Categoria salva com sucesso!")
    }).catch((err)=>{
        console.log("Erro: "+err)
    })
})


module.exports = router