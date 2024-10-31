var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const product1 = require('../models/product');
const user1 = require('../models/user');
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
router.post('/add-product',async(req,res)=>{
  const newdata=new product1({
   name:req.body.name,
   price:req.body.price
  })
  newdata.save()
  res.json({
    status: "success",
      message: "Product successfully stored",
      productName: newdata.name
  })
})
router.post('/update-product', async (req, res) => {
    
    const updatedProduct = await product1.findByIdAndUpdate(
        req.body.id,
        {
            name: req.body.name,
            price: req.body.price
        },
        { new: true } 

    )
    res.json({
        status: "success",
        message: "Product successfully updated",
        product: updatedProduct
    });
})
router.post('/delete-product', async (req, res) => {
  
const delete_user=await product1.findByIdAndDelete(
  {
    _id:req.body.id}
)
res.json({
        status: "success",
          message: "Product successfully deleted",
          productName: delete_user.name
      })
})

router.get('/find_id', async (req, res) => {
    
      const product = await product1.findById(req.body.id);
  
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      return res.status(200).json(product);
    })
    router.get('/find_product', async (req, res) => {
    
        const product = await product1.find();
    
        if (!product) {
          return res.status(404).json({ error: "Products not found" });
        }
    
        return res.status(200).json(product);
      })
    
      
     
      
module.exports = router;