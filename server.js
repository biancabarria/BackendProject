const express = require('express')
const { Router } = express
const Contenedor = require("./container.js");

const app = express()
const router = Router()

let productos = [
]
let product_count = 0

const contenedor = new Contenedor("./products.txt")

router.get('/', (req, res) => {
    contenedor
        .getAll()
        .then((products) => {
            productos = products
        })
        .catch((error) => {
            console.log(error)
        })
    res.send({products: productos})
})

router.get('/:id', (req, res) => {
    let id = parseInt(req.params.id)
    contenedor
        .getById(id)
        .then((product) => {
            res.send({product: product})
        })
        .catch((error) => {
            console.log(error)
            res.status(404).send({error: 'Producto no encontrado'})
        })
})

router.post('/', (req, res) => {
    if(!req.body.name || !req.body.price) {
        res.status(500).send('Missing body params!')
    } else {
        data = req.body
        contenedor
        .save(data)
        .then(() => {
            res.send({product: data})
        })
        .catch((error) => {
            console.log(error)
            res.status(404).send({error: 'Producto no guardado'})
        })
    }
})

router.put('/:id', (req, res) => {
    const { name, description, code, thumbnail, price, stock } = req.body
    if(name != undefined || description != undefined || code != undefined || thumbnail != undefined || price != undefined || stock != undefined) {
        id = req.params.id
        data = req.body
        contenedor
        .update(id, data)
        .then(() => {
            res.send({response: "Producto actualizado con éxito"})
        })
        .catch((error) => {
            console.log(error)
            res.status(500).send({error: 'Producto no actualizado'})
        })
    } else {
        res.status(400).send({error: 'Missing body params!'})
    }
})

router.delete('/:id', (req, res) => {
    let id = parseInt(req.params.id)
    contenedor
        .deleteById(id)
        .then(() => {
            res.send({response: "Producto eliminado con éxito"})
        })
        .catch((error) => {
            console.log(error)
            res.status(400).send({error: 'Producto no eliminado'})
        })
})

app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use('/api/productos', router)

app.listen(8080, () => {
    console.log('Server running in port 8080')
})  