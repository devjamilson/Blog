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
    Categoria.find().lean().sort({date:'desc'}).then((categorias)=>{
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao listar as categorias!")
        res.redirect("/admin")
    })
    
})

router.get('/categorias/add', (req, res) =>{
    res.render("admin/addcategoria")
})

//rota responsável por criar uma nova categoria dentro do banco de dados
router.post('/categorias/nova',(req, res) =>{
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido!"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido!"})
    }

    if(erros.length > 0){
        res.render('admin/addcategoria', {erros: erros})
    }
    else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(()=>{
            //msg com o flash são de tempo curto, ao recarregar a página ela some
            req.flash("success_msg", "Categoria criada com sucesso!")
            //redireciona para a página de listagem de categorias
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao salvar a categoria!")
            res.redirect("/admin")
        })
    }

    
})


module.exports = router