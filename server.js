const express = require('express')
const { Router } = express
const Contenedor = require("./container.js");

const app = express()
const router = Router()
const routerDos = Router()

const contenedorProducto = new Contenedor("./products.txt")
const contenedorCarrito = new Contenedor("./carrito.txt")

router.get('/', (req, res) => {
    contenedorProducto
        .getAll()
        .then((data) => {
            res.send({products: data})
        })
        .catch((error) => {
            console.log(error)
            res.status(404).send({error: 'Error obteniendo productos'})
        })
})

router.get('/:id', (req, res) => {
    let id = parseInt(req.params.id)
    contenedorProducto
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
        contenedorProducto
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
        contenedorProducto
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
    contenedorProducto
        .deleteById(id)
        .then(() => {
            res.send({response: "Producto eliminado con éxito"})
        })
        .catch((error) => {
            console.log(error)
            res.status(400).send({error: 'Producto no eliminado'})
        })
})

routerDos.get('/', (req, res) => {
    contenedorCarrito
        .getAll()
        .then((data) => {
            res.send({carrito: data})
        })
        .catch((error) => {
            console.log(error)
            res.status(404).send({error: 'Error obteniendo carrito'})
        })
})

routerDos.post('/', (req, res) => {
    data = {}
    contenedorCarrito
    .save(data)
    .then(() => {
        res.send({carrito: data})
    })
    .catch((error) => {
        console.log(error)
        res.status(404).send({error: 'Carrito no guardado'})
    })
})

routerDos.delete('/:id', (req, res) => {
    let id = parseInt(req.params.id)
    contenedorCarrito
        .deleteById(id)
        .then(() => {
            res.send({response: "Carrito eliminado con éxito"})
        })
        .catch((error) => {
            console.log(error)
            res.status(400).send({error: 'Carrito no eliminado'})
        })
})

app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use('/api/productos', router)
app.use('/api/carrito', routerDos)

app.listen(8080, () => {
    console.log('Server running in port 8080')
})  