const {validationResult} = require('express-validator')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

//configuring Transporter for sending Emails..
const trasporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key: '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'
    }
}))

exports.postSignup = (req,res,next)=>{
    const email = req.body.email
    const password = req.body.password
    const confrimpassword = req.body.confrimpassword
    const errors = validationResult(req)
    let loadedUser
    if(!errors.isEmpty()){
        return res.status(422).send({error:errors.array()[0].msg})
    }
    bcrypt.hash(password,12)
    .then(hashedpassword=>{
        const user = new User({
            email:email,
            password:hashedpassword,
            orders:[],
            admin: false
        })
        return user.save()
    })
    .then(user=>{
        loadedUser = user
        trasporter.sendMail({
            to:email,
            from:'bhautikparmar98@gmail.com',  //only verified email from sendgrid can send...
            subject:'signup succeded!',
            html:'<h1>You Successfully signed up</h1>'
        })
        .then(result=>{
            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id
            },'anysecretkey', 
            { expiresIn: '1h' }   //user will not Authenticated based on token after expiration time
            )
            return res.status(200).send({token: token, userId: loadedUser._id.toString()})
        })
        .catch(e=>console.log(e))
    }) 
    .catch(err=>res.send({error:err}))
}


exports.postLogin = (req,res,next)=>{
    const email = req.body.email
    const password = req.body.password
    const errors = validationResult(req)
    let loadedUser
    if(!errors.isEmpty()){
        return res.status(422).send({error: errors.array()[0].msg})
    }
    return User.findOne({email:email})
    .then(user=>{
        if(!user){   
            res.status(401)
            return Promise.reject('Email Not Found!')
        }
        loadedUser = user
        return  bcrypt.compare(password,user.password)
    })
    .then(doMatch=>{
        if(!doMatch){
            return res.status(401).send({error:'Wrong Password'})
        }
        //generating token with payload data and secret key with some expiration time
        const token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser._id
        },'anysecretkey',
        { expiresIn: '1h' }   //user will not Authenticated based on token after expiration time
        )
        return res.status(200).send({token: token, userId: loadedUser._id.toString()})
    }
    )
    .catch(e=>{
        return res.send({error:e})
    })
}

exports.resetPassword = (req,res,next)=>{
    const email = req.body.email
    const password = req.body.password
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).send({error: errors.array()[0].msg})
    }
    let loadedUser
    bcrypt.hash(password,12)
    .then(hashedpassword=>{
        User.findOne({email:email})
        .then(user=>{
            loadedUser = user
            user.email = email
            user.password = hashedpassword
            user.orders = loadedUser.orders
            user.admin = loadedUser.admin
            return user.save()
        })
        .then(result=>{
            trasporter.sendMail({
                to:email,
                from:'bhautikparmar98@gmail.com',  //only verified email from sendgrid can send...
                subject:'Reset succeded!',
                html:'<h1>Password Reset Succesfull!!</h1>'
            })
            .then(r=>res.status(201).json({response:'Password Changed !!'}))
            .catch(e=>res.status(400).send({error:e}))
        })
        .catch(e=>res.status(400).send({error:e})) 
    })
    .catch(e=>res.status(400).send({error:e}))
}