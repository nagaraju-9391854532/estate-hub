const mongoose=require('mongoose')
const Schema=mongoose.Schema

const landSchema=new Schema({
    acres:Number,
    priceperacre:Number,
    price:Number,
    location:String,
    address:String,
    description:String,

})

const Land=new landSchema("Land",landSchema);
module.exports=Land;