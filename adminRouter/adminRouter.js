// const express = require('express');
// const adminRouter = express.Router();
// const fileUpload = require('express-fileupload')
// const MongoClient = require('mongodb').MongoClient;
// const ObjectId = require("mongodb").ObjectId;
// const admin = require("firebase-admin");
// const fs = require('fs-extra')
// require('dotenv').config();
// const stripe = require('stripe')(process.env.STRIPE_SECRET);










// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cwobc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// const app = express();
// app.use(express.static('foods'));
// app.use(fileUpload());



// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// })




// async function verifyToken(req, res, next) {
//   if (req.headers?.authorization?.startsWith('Bearer ')) {
//       const token = req.headers.authorization.split(' ')[1];

//       try {
//           const decodedUser = await admin.auth().verifyIdToken(token);
//           req.decodedEmail = decodedUser.email;
//       }
//       catch {

//       }

//   }
//   next();
// }


// client.connect(err => {
//   const foodsCollection = client.db(`${process.env.DB_NAME}`).collection("foodCollections");
//   const orderCollection = client.db(`${process.env.DB_NAME}`).collection("orders");
//   const usersCollection = client.db(`${process.env.DB_NAME}`).collection("users");
//   console.log('database connection successfully')
//   // client.close();

//   adminRouter.post('/addFood', (req, res)=>{
//     const name = req.body.name;
//     const weight = req.body.weight;
//     const price = req.body.price;
//     const file = req.files.file;
//     const newImg = file.data;
//     const encImg = newImg.toString('base64');
//     var image = {
//       contentType: file.mimetype,
//       size: file.size,
//       img: Buffer.from(encImg, 'base64')
//     };
//         foodsCollection.insertOne({ name, weight, price, image })
//         .then(result=>{
//                 res.send(result.insertedCount > 0)
//         })
//         console.log(req.body)
//     })

//     adminRouter.get('/allProduct', (req,res)=>{
//       // const search = req.query.search;
//       // {name: {$regex: search}}
//         foodsCollection.find()
//         .toArray((err, documents)=>{
//             res.send(documents)
            
//         })

// })

//    adminRouter.delete('/allProduct/:id', (req,res)=>{
//     foodsCollection.deleteOne({_id: ObjectId(req.params.id)})
//     .then(result=>{
//       console.log(result)
//     })

// })


//    adminRouter.get('/allProduct/:id', (req,res)=>{
//     foodsCollection.find({_id: ObjectId(req.params.id)})
//     .toArray((err, documents) => {
//      res.send(documents)
//     })
//    })


//    adminRouter.patch('/allProduct/:id', (req,res)=>{
//     foodsCollection.updateOne({_id: ObjectId(req.params.id)},
//     {
//       $set:{name: req.body.name, price: req.body.price, weight: req.body.weight}
//     })
//     .then(result=>{
//       console.log(result)
//     })

// })


// adminRouter.post('/order',(req,res)=>{
//   const newOrder = req.body;
//   orderCollection.insertOne(newOrder)
//   .then(result=>{
//       res.send(result.insertedId)
//   })
//   console.log(req.body)
  
// })

// // adminRouter.get('/order',(req,res)=>{
// //   orderCollection.find({email:req.query.email})
// //   .toArray((err, order)=>{
// //       res.send(order)
// //   })
// // })

// adminRouter.get('/myOrder/:id', async (req, res) => {
//   const id = req.params.id;
//   const query = { _id: ObjectId(id) };
//   const result = await orderCollection.findOne(query);
//   res.json(result);
// })

// adminRouter.put('/myOrder/:id', (req, res) => {
//   const id = req.params.id;
//   const payment = req.body;
//   const filter = { _id: ObjectId(id) };
//   const updateDoc = {
//       $set: {
//           payment: payment
//       }
//   };
//   const result = orderCollection.updateOne(filter, updateDoc);
//   res.json(result);
// });


// adminRouter.get('/myOrder', (req,res)=>{
//   // console.log(req.query.email)
//   orderCollection.find({email:req.query.email})
//   .toArray((err, products)=>{
//     res.send(products)
//     console.log(products)
//   })
// })

// // delete order
// adminRouter.delete('/myOrder/:id', (req,res)=>{
//   // console.log(req.query.email)
//   orderCollection.deleteOne({_id: ObjectId(req.params.id)})
//   .then(result=>{
//     console.log(result)
//   })
// })



// adminRouter.post('/create-payment-intent', async (req, res) => {
//   const price = req?.body?.price
//   console.log(price)
//   const amount = price * 100
//   if (amount > 999999) {
//       return res.status(500).send({ message: 'Your price is too high' })
//   }
//   if(price){
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount,
//       currency: "usd",
//       payment_method_types: [
//           "card"
//       ],
//   });
//   res.send({
//     clientSecret: paymentIntent.client_secret,
// });
//   }
  

  

// })

//  // use post to get products by ids
//  adminRouter.post('/productByIds', (req, res) =>{
//   const keys = req.body;
//   const ids = keys.map(id => ObjectId(id));
//   const query = {_id: {$in: ids}}
//   const cursor = foodsCollection.find(query);
//   const products = cursor.toArray();
//   console.log(keys);
//   res.send(products);
// })

// // usres

// adminRouter.get('/users/:email', async (req, res) => {
//   const email = req.params.email;
//   const query = { email: email };
//   const user = await usersCollection.findOne(query);
//   let isAdmin = false;
//   if (user?.role === 'admin') {
//       isAdmin = true;
//   }
//   res.json({ admin: isAdmin });
// })

// adminRouter.post('/users', async (req, res) => {
//   const user = req.body;
//   const result = await usersCollection.insertOne(user);
//   console.log(result);
//   res.json(result);
// });

// adminRouter.put('/users', async (req, res) => {
//   const user = req.body;
//   const filter = { email: user.email };
//   const options = { upsert: true };
//   const updateDoc = { $set: user };
//   const result = await usersCollection.updateOne(filter, updateDoc, options);
//   res.json(result);
// });

// adminRouter.put('/users/admin', verifyToken, async (req, res) => {
//   const user = req.body;
//   const requester = req.decodedEmail;
//   if (requester) {
//       const requesterAccount = await usersCollection.findOne({ email: requester });
//       if (requesterAccount.role === 'admin') {
//           const filter = { email: user.email };
//           const updateDoc = { $set: { role: 'admin' } };
//           const result = await usersCollection.updateOne(filter, updateDoc);
//           res.json(result);
//       }
//   }
//   else {
//       res.status(403).json({ message: 'you do not have access to make admin' })
//   }

// })





// });
  





// module.exports = adminRouter;