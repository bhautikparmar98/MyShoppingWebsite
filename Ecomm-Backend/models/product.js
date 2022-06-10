const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//here in mongoose we create product blueprint using Schema instead of constructor
const ProductSchema = Schema({
    title:{
        type: String,
        required: true
    },
    imgUrl:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
})


module.exports = mongoose.model('Product',ProductSchema)




// class Product{
//     constructor(id,title,imgUrl,price,description){
//         this.id = id,
//         this.title = title,
//         this.imgUrl = imgUrl,
//         this.price = price,
//         this.description = description
//     }
//     save(){
//         //add product to database
//         products.push(this)
//     }
//     static fetch(){
//         return products
//     }
// }