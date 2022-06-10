const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const OrderSchema = new Schema({
    products:[{
        product:{type:Object,required:true},quantity:{type:Number,required:true},name:{type:String,required:true}
    }],
    user:{
        userId:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:'User'
        }
    }
})

module.exports = mongoose.model('Order',OrderSchema)