//aqui eu terei todas as minhas rotas do admin, e uma boa pratica segmentar as rotas
const express = require('express')
//express.Router é o componente que uso para criar rotas em arquivos separados
const router = express.Router()
//é assim que se usa um model de forma externa
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagens")
const Postagem = mongoose.model("postagens")
const {eAdmin}= require("../helpers/eAdmin")



router.get('/', eAdmin, (req, res) =>{
    res.render("index")
})

router.get('/posts', eAdmin, (req, res) =>{
    res.send("Página de post do painel adm")
})

router.get('/categorias', eAdmin, (req, res) =>{
    Categoria.find().lean().sort({date:'desc'}).then((categorias)=>{
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao listar as categorias!")
        res.redirect("/admin")
    })
    
})

router.get('/categorias/add', eAdmin, (req, res) =>{
    res.render("admin/addcategoria")
})

//editando as categorias
router.get('/categorias/edit/:id', eAdmin,  (req, res) =>{
    Categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render('admin/editcategoria', {categoria:categoria})
    }).catch((err)=>{
        req.flash('error_msg', 'Essa categoria não existe!')
        res.redirect("admin/categorias")
    })
    
})


router.post('/categorias/edit/', eAdmin, (req, res)=>{
    Categoria.findOne({_id: req.body.id}).then((categoria)=>{
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(()=>{
            req.flash('success_msg', 'Categoria editada com sucesso!')
            res.redirect('/admin/categorias')
        }).catch((err)=>{
            req.flash('error_msg', 'Essa categoria não existe!')
            res.redirect('/admin/categorias')}
        )
        
    }).catch((err)=>{
        req.flash("error_msg", "Essa categoria não existe!")
        res.redirect("/admin/categorias")
    })
})

//rota responsável por criar uma nova categoria dentro do banco de dados
router.post('/categorias/nova', eAdmin, (req, res) =>{
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
            res.redirect("/admin/categorias")
        })
    }

    
})

router.post('/categorias/deletar', eAdmin,  (req, res)=>{
    Categoria.remove({_id: req.body.id}).lean().then(()=>{
        req.flash('success_msg', 'Categoria deletada com sucesso!')
        res.redirect('/admin/categorias')
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao deletar a categoria!")
        res.redirect("/admin/categorias")
    })
})
//Rotas para postagens
router.get('/postagens', (req, res) => {
    Postagem.find().lean().populate('categoria').sort({data: 'desc'}).then((postagens) =>{
        res.render('admin/postagens', {postagens: postagens})
    }).catch( (err) => {
        req.flash('error_msg', 'Erro ao listar os posts')
        res.render('/admin')
    })
})

router.get('/postagens/add', eAdmin, (req,res)=>{
    Categoria.find().lean().then((categorias)=>{
        res.render('admin/addpostagens', {categorias: categorias}) 
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro carregar o formulario!")
        res.redirect("/admin")
    })
})

router.post('/postagens/novas', eAdmin, (req, res)=>{
    let erros = []
    
    if(req.body.categoria == 0){
        erros.push({texto: "Categoria inválida!"})
    }

    if(erros.lenght > 0){
        res.render('/admin/addpostagens', {erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novaPostagem).save().then(()=>{
            req.flash('success_msg', 'Postagem criada com sucesso!')
            res.redirect('/admin/postagens')
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro ao criar a postagem!')
            res.redirect('/admin/postagens')
        })
    }
})


router.get('/postagens/edit/:id', eAdmin,  (req, res)=>{
    Postagem.findOne({_id: req.params.id}).lean().then((postagem)=>{
        Categoria.find().lean().then((categoria)=>{
           res.render('admin/editpostagens', {categoria: categoria, postagem: postagem})
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro listar as postagens!')
            res.redirect('/admin/postagens')
        })
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao carregar o fomulario de edição!')
        res.redirect('/admin/postagens')
    })
})

router.post('/postagens/edit',  eAdmin, (req,res)=>{
    Postagem.findOne({_id:req.body.id}).then(()=>{
        postagem.titulo = req.body.titulo,
        postagem.slug = req.body.slug,
        postagem.descricao = req.body.descricao,
        postagem.conteudo = req.body.conteudo,
        postagem.categoria = req.body.categoria

        postagem.save().then(()=>{
            req.flash('success_msg', 'Postagem editada com sucesso!')
            res.redirect('/admin/postagens')
        }).catch((err)=>{
            req.flash('error_msg', 'Erro interno!')
            res.redirect('/admin/postagens')
        })
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao salvar a edição!')
        res.redirect('/admin/postagens')
    })
})

router.get('/postagens/deletar/:id', eAdmin,  (req, res)=>{
    Postagem.remove({_id: req.params.id}).lean().then(()=>{
        req.flash('success_msg', 'Postagem deletada com sucesso!')
        res.redirect('/admin/postagens')
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao deletar a Postagem!")
        res.redirect('/admin/postagens')
    })
})

module.exports = router