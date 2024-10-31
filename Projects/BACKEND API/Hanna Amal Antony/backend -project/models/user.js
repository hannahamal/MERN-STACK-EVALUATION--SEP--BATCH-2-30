const mongoose=require('mongoose')
const user1=mongoose.model("user1",{
    
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    cart:{
        type:Array,
        require:true
    }
})
module.exports=user1