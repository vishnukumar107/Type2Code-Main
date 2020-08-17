const mongoose=require('mongoose');

const UserSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    score:{
        type:Array,
        default:[]
    },
    highScore:{
        type:Number,
        default:0
    }
});

const User=mongoose.model('User',UserSchema);

module.exports=User;