const mongoose=require('mongoose')
const product1=mongoose.model("product1",{
    
    name:{
        type:String,
        require:true
    },
    price:{
        type:String,
        require:true
    }
})
module.exports=product1