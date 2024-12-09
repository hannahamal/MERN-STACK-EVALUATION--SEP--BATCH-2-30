var express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var router = express.Router();
const product1 = require('../models/product');
const user1 = require('../models/user');
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.get('/find_product', async (req, res) => {

  const product = await product1.find();

  if (!product) {
    return res.status(404).json({ error: "Products not found" });
  }

  return res.status(200).json(product);
})
router.get('/find_id', async (req, res) => {

  const product = await product1.findById(req.body.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  return res.status(200).json(product);
})

router.post('/signup', async (req, res) => {

  const newUser = new user1({
    email: req.body.email,
    password: req.body.password,
    cart: req.body.cart,
  });


  await newUser.save();

  // Generate a JWT token
  const token = jwt.sign({ id: newUser._id }, 'process.env.MY_SECRET', { expiresIn: '1h' });

  return res.status(201).json({
    success: true,
    message: "Successfully stored",
    token: token,
  });
})
router.post('/login', async (req, res) => {

  const { email, password } = req.body

  
  const user = await user1.findOne({ email });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }


  const token = jwt.sign({ id: user._id }, 'process.env.MY_SECRET', { expiresIn: '1h' });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    token: token
  });
})
router.post('/add_cart', async (req, res) => {

  let jwtSecretKey = 'process.env.MY_SECRET';

  try {
    const token = req.body.token;

    const verified = jwt.verify(token, jwtSecretKey);
    console.log(verified)
    const userId = verified.id;
    console.log(userId)
    const user = await user1.findByIdAndUpdate(userId,



      {
        cart: req.body.cart
      },
      { new: true }
    )
    res.json({
      res: "successfully added to the cart"
    })
  } catch (error) {

    return res.status(401).send(error);
  }
});




// router.post('/removefromcart', async (req, res) => {
//   const jwtSecretKey ='process.env.MY_SECRET';
// // console.log(jwtSecretKey)
//   const token = req.body.token;
// // console.log(token)
  
//     const verified = jwt.verify(token, jwtSecretKey);
//     const userId = verified.id;
//     // console.log(userId)

//     const user = await user1.findById(userId)
//     if (!user) {
//       return res.json({
//         status: "error",
//         message: "User not found"
//       });
//     }

//     const deleteUser = await user1.cart.findByIdAndDelete(req.body.id);

//     if (!deleteUser) {
//       return res.json({
//         status: "error",
//         message: "Product not found in cart"
//       });
//     }

//     return res.json({
//       status: "success",
//       message: "Product successfully deleted"
//     });
  
  
// });
router.post('/removefromcart', async (req, res) => {
  const jwtSecretKey = 'process.env.MY_SECRET'; // Use the environment variable correctly
  const token = req.body.token;

  try {
    const verified = jwt.verify(token, jwtSecretKey);
    const userId = verified.id;

    const user = await user1.findById(userId).populate('cart'); // Populate cart if it's a reference
    if (!user) {
      return res.json({
        status: "error",
        message: "User not found"
      });
    }

    const productId = req.body.id; // Get the product ID from the request body
// console.log(productId)
    // Log user cart for debugging
    // console.log("User cart:", user.cart);

    // Check if productId is valid
    if (!productId) {
      return res.json({
        status: "error",
        message: "Product ID is required"
      });
    }

    const productIndex = user.cart.findIndex(product => {
      // Ensure product._id is defined before calling toString()
      return product._id && product._id.toString() === productId;
    });

    // if (productIndex === -1) {
    //   return res.json({
    //     status: "error",
    //     message: "Product not found in cart"
    //   });
    // }

    user.cart.splice(productIndex, 1); // Remove the product from the cart
    await user.save(); // Save the updated user cart

    return res.json({
      status: "success",
      message: "Product successfully deleted"
    });
  } catch (error) {
    return res.json({
      status: "error",
      message: error.message
    });
  }
});


router.get('/getcart', async (req, res) => {
  const jwtSecretKey = 'process.env.MY_SECRET';

  const token = req.body.token;

  // try {
    const verified = jwt.verify(token, jwtSecretKey);
    const userId = verified.id;

    console.log("Decoded User ID:", userId); // Log userId for debugging

    // Find the user by the correct identifier
    const user = await user1.findOne({ _id:userId });
    console.log("User found:", user); // Log user for debugging

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }
    const response={}
    if(user) {
      const cartItems = await user1.aggregate([
        {
          $match: {_id:user._id}
        },
        {
          $lookup:{
            from:'product1',
            let: {cart:user.cart},    
            pipeline:[
              {
                $match:{
                  $expr:{
                    $in:["$_id",{
                      $map:{
                        input:"$$cart",
                        as:"cartId",
                        in:{$toObjectId:"$$cartId"}
                         }
                    }]
                  }
                }
              }
            ],
            as:'productDetails'
          }
        }
     ])
    console.log(cartItems);
    response.status=200
    response.ok=true
    response.message="Cart fetched succesfully"
    res.json({
      res:cartItems
    })
    
  // } catch (error) {
  //   console.error("Error:", error); // Log error for debugging
  //   return res.status(400).json({
  //     status: "error",
  //     message: error.message === 'jwt malformed' ? 'Invalid token' : 'An error occurred'
  //   });
  // }
    }
  })



module.exports = router;