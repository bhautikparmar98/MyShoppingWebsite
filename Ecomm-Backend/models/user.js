const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    orders:[{
            orderId:{type:Schema.Types.ObjectId,ref:'Order',required:true},
        }],
    admin:{
        type:Boolean,
        required:true
    }
})

module.exports = mongoose.model('User',UserSchema)