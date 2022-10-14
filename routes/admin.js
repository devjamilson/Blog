//aqui eu terei todas as minhas rotas do admin, e uma boa pratica segmentar as rotas
const express = require('express')
//express.Router é o componente que uso para criar rotas em arquivos separados
const router = express.Router()


router.get('/', (req, res) =>{
    res.send("Página principal do painel adm")
})

router.get('/posts', (req, res) =>{
    res.send("Página de post do painel adm")
})

router.get('/categorias', (req, res) =>{
    res.send("Página de categorias")
})


module.exports = router