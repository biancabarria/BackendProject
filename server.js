const express = require('express')
const { Router } = express

const app = express()
const router = Router()

const productos = [
]

let product_count = 0

let response = {
    error: false,
    codigo: 200,
    mensaje: ''
};

router.get('/', (req, res) => {
    res.send({productos: productos})
})

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/public/index.html')
})

router.get('/:id', (req, res) => {
    let id = parseInt(req.params.id)
    let producto = productos.find(product => product.id === id)
    if (producto) {
        res.send({producto: producto})
    }
    else {
        res.status(404).send({error: 'Producto no encontrado'})
    }
})

router.post('/', (req, res) => {
    product_count++
    if(!req.body.title || !req.body.price || !req.body.thumbnail) {
        res.status(500).send('Missing body params!')
    } else {
        req.body.id = product_count
        productos.push(req.body)
        response = req.body
    }
    res.send(response)
})

router.put('/:id', (req, res) => {
    if(req.body.title && req.body.price && req.body.thumbnail) {
        let id = parseInt(req.params.id)
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].id === id) {
                productos[i].title = req.body.title
                productos[i].price = req.body.price
                productos[i].thumbnail = req.body.thumbnail
                res.send({productos: productos})
            }
        }
    } else {
        res.status(500).send('Missing body params!')
    }
})

router.delete('/:id', (req, res) => {
    let id = parseInt(req.params.id)
    id--
    if (id < productos.length) {
        let deletedItem = productos.splice(id,1)
        res.send({productos: productos}) 
    }
    else {
        res.status(404).send('Producto no encontrado')
    }
})

app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use('/api/productos', router)

app.listen(8080, () => {
    console.log('Server running in port 8080')
})  