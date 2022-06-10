const express = require('express')

const router = express.Router()

const ProductsController = require('../controllers/products')

const isAuth = require('../middleware/is-auth')

//Crud Operation
router.get('/',ProductsController.getProducts)

router.put('/edit-product',isAuth,ProductsController.editProduct)

router.post('/add-product',isAuth,ProductsController.addProduct)

router.delete('/delete', isAuth, ProductsController.deleteProduct)

router.post('/create-payment',isAuth, ProductsController.createPayment)

router.post('/postOrder',isAuth, ProductsController.postOrders)

router.get('/getOrder',isAuth, ProductsController.getOrders)

module.exports = router        