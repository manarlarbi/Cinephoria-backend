const mongoose= require('mongoose');
require ('../db/database.js');
const reviewSchema = new mongoose.Schema({
    filmId :{type:Number,required:true},
    userId:{type:Number,required:true},
    rating :{type:Number,min:0,max:5,required:true},
    comment:{type:String,required:true},
    isValider:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now},
},
{timestamps:true}); 
module.exports=mongoose.model("review",reviewSchema);