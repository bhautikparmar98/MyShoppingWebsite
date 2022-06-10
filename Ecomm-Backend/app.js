const express = require('express')
const bodyParser = require('body-parser')
const mongoConnect = require('./util/database')
const mongoose = require('mongoose')
const shopRoute = require('./routes/shop')
const authRoute = require('./routes/auth')
const User = require('./models/user')
const orders = require('./models/orders')

const app = express()

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use((req,res,next)=>{
    //for removing CORS error for having different ports
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Methods','OPTIONS,GET,POST,PUT,PATCH,DELETE')
    res.setHeader('Access-Control-Allow-Headers','Content-type, Authorization')
    next()
})

app.use((req,res,next)=>{
    User.findById('628b4694fc3c5b63ecf4a541')
    .then(user=>{
        req.user = user
        next()
    })
})
 
app.use(authRoute)
app.use(shopRoute)

//if database connection success then only start the server thats y passed callback
mongoose.connect('mongodb+srv://bhautik:iKVxMr1hfuEz6StK@cluster0.l0p55.mongodb.net/shop?retryWrites=true&w=majority')
.then(result=>{
    User.findOne().then(user=>{
        if(!user){
        const user = new User({
            email:'bhautikparmar98@gmail.com',
            password:'$2a$12$9OW4FHXyTeOBbhOLt3yOIevnG3JBOw7SlNTTFrWp3uIdBwwU/Aizq',
            orders:[],
            admin:true
        })
        user.save()
        }
    })
    app.listen(5000)
}).catch(err=>console.log(err))  

