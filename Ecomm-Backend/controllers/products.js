const Product = require('../models/product')
const Order = require('../models/orders')
const stripe = require('stripe')('sk_test_51KVx1vSJvYIXKaisdlIQMnZUOclSTeUDiyN7gDbquMgIT3jVd89rrBQ9G4tJssyJ6ah5sqJeSrgxnRqo0I7hZzMG00FdPxoEhQ')
const uuid = require('uuid')

const ITEMS_PER_PAGE = 4
let totalItems

exports.getProducts = (req,res,next)=>{  
    const page = +req.query.page || 1
    Product.find()
    .countDocuments()
    .then(numProducts=>{
        totalItems = numProducts
        return Product.find()
        .skip((page-1)*ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    })
    .then(products=>{
        res.send({
            prods:products,
            totalItems:totalItems, 
            currentPage:page
        })
    })
    .catch(err=>res.send(err))
}

exports.addProduct = (req,res,next)=>{
    const title = req.body.title
    const imgUrl = req.body.imgUrl
    const price = req.body.price
    const description = req.body.description
    const product = new Product({
        title:title,
        imgUrl:imgUrl,
        price:price,
        description:description,
        userId:req.userId
    })
    console.log('inside function')
    return product.save()
    .then(result=>{
        console.log('created product')
        res.status(201).send('product created')
    })
    .catch(err=>console.log(err))
}

exports.editProduct = (req,res,next)=>{
    const id = req.body.id
    const updatedtitle = req.body.title
    const updatedimgUrl = req.body.imgUrl
    const updatedprice = req.body.price
    const updatedDescription = req.body.description
    Product.findById(id)
    .then(product=>{
        product.title =  updatedtitle
        product.imgUrl = updatedimgUrl
        product.price = updatedprice
        product.description = updatedDescription
        product.userId = req.userId
        return product.save()
    })
    .then(result=>{
        res.status(201).send('Product Updated!')
    })
    .catch(err=>res.status(401).send(err))
}

exports.deleteProduct = (req,res,next)=>{
    const prodId = req.body.id
    console.log(prodId)
    Product.findByIdAndRemove(prodId)
    .then(result=>{
       return res.status(204).send({mssg:'Product Deleted'})
    })
    .catch(err=> res.send(err))
}

exports.createPayment = async (req,res,next)=>{
    try{
        const idempotencyKey = uuid()   //this will help user to prevent to create same payment again for same product
        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            line_items: req.body.cart.map(product=>{
                return {
                    name: product.title,
                    description: product.description,
                    amount: product.price * 100,
                    currency: 'inr',
                    quantity: product.qty
                }
            }),
            success_url: req.protocol + '://' + 'localhost:3000' + '/checkout/success',
            cancel_url: req.protocol + '://' + 'localhost:5000' + '/checkout/fail'
        })
        res.send({url:session.url})
    }
    catch(e){
        res.send({error:e.message})
    }
}

exports.postOrders = (req,res,next)=>{
    const cart = req.body.cart
    const products = cart.map(item=>{
        return {quantity:item.qty, product:item.id, name:item.title}
    })
    const order = new Order({
        user:{userId:req.userId},
        products:products
    })
    order.save()
    .then(result=>{
        res.send('Order Created')
    }) 
}

exports.getOrders = (req,res,next)=>{
    Order.find({'user.userId':req.userId})
    .then(orders=>{
        res.send(orders)
    })
    .catch(err=>{
        res.send(err)
    })
}