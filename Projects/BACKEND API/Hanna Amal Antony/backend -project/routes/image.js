const express = require('express');
const multer = require('multer');
const path = require('path');
var router = express.Router();


const app = express();
const upload=multer({
  dest:"uploads/",
});

router.post("/uploads",upload.single("file"),(req,res)=>{

 res.json({
    status: 'success',
    message: 'File uploaded successfully',
    
  });

})
module.exports=router;