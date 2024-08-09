const mongoose=require('mongoose')
const Schema=mongoose.Schema

const flatSchema=new Schema({
    address:String,
    description:String,
    carpetarea:Number,
    price:Number,
    gatedcommunity:String,
    type:String,
    
})