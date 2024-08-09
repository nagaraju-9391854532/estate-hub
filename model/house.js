const mongoose=require('mongoose')
const Schema=mongoose.Schema

const houseSchema=new Schema({
    facing:{
        type:String
    },
    carpetarea:Number,
    length:Number,
    breadth:Number,
    plotarea:Number,
    address:String,
    description:String,
    roadwidth:Number,
    nooffloors:Number,
    price:Number,
    gatedcommunity:String,
    cornerhouse:String,
    location:{
        type:String
    },
    images:[
        {
            url:String,
            
        }
    ],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        href:"User"
    },

    sname:String,
    smobile:String,
    semail:String,
    title:String
})

const House=mongoose.model("House",houseSchema);
module.exports=House;