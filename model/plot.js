const mongoose=require('mongoose')
const Schema=mongoose.Schema

const plotSchema=new Schema({
    title:String,
    facing:{
        type:String
    },
    length:Number,
    breadth:Number,
    plotarea:Number,
    address:String,
    description:String,
    roadwidth:Number,
    cornerPlot:String,
    authorityapproved:String,
    price:Number,
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
    semail:String

})

const Plot=mongoose.model("Plot",plotSchema);
module.exports=Plot;
