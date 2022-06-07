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

// app.get('/', (req, res, next) => {
//     res.sendFile(__dirname + '/public/index.html')
// })

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

// router.put('/:id', (req, res) => {
//     if(req.body.title && req.body.price && req.body.thumbnail) {
//         let id = parseInt(req.params.id)
//         for (let i = 0; i < productos.length; i++) {
//             if (productos[i].id === id) {
//                 productos[i].title = req.body.title
//                 productos[i].price = req.body.price
//                 productos[i].thumbnail = req.body.thumbnail
//                 res.send({productos: productos})
//             }
//         }
//     } else {
//         res.status(500).send('Missing body params!')
//     }
// })

// router.delete('/:id', (req, res) => {
//     let id = parseInt(req.params.id)
//     id--
//     if (id < productos.length) {
//         let deletedItem = productos.splice(id,1)
//         res.send({productos: productos}) 
//     }
//     else {
//         res.status(404).send('Producto no encontrado')
//     }
// })

app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use('/api/productos', router)

app.listen(8080, () => {
    console.log('Server running in port 8080')
})  