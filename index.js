const express = require('express')
const bodyParser = require('body-parser');
const cors = require ('cors')
const fileUpload = require('express-fileupload')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
const admin = require("firebase-admin");
const fs = require('fs-extra');
const { query } = require('express');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('foods'));
app.use(fileUpload());


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cwobc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });






const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})




async function verifyToken(req, res, next) {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
      const token = req.headers.authorization.split(' ')[1];

      try {
          const decodedUser = await admin.auth().verifyIdToken(token);
          req.decodedEmail = decodedUser.email;
      }
      catch {

      }

  }
  next();
}


async function run() {
  try{
      await client.connect();
      const foodsCollection = client.db(`${process.env.DB_NAME}`).collection("foodCollections");
      const orderCollection = client.db(`${process.env.DB_NAME}`).collection("orders");
      const usersCollection = client.db(`${process.env.DB_NAME}`).collection("users");
      console.log('database connection successfully')
      // client.close();


      // app.post('/addFood',  async (req, res)=>{
      //   const name = req.body.name;
      //   const weight = req.body.weight;
      //   const price = req.body.price;
      //   const file = req.files.file;
      //   const newImg = file.data;
      //   const encImg = newImg.toString('base64');
      //   var image = {
      //     contentType: file.mimetype,
      //     size: file.size,
      //     img: Buffer.from(encImg, 'base64')
      //   };
      //     const result   =  await foodsCollection.insertOne({ name, weight, price, image })
      //     res.json(result)
      //       console.log(result)
      //   })

      app.post('/allProduct', async (req,res)=>{
        const newService = req.body;
        const result  = await foodsCollection.insertOne(newService)
        res.json(result)
        
    })
    
        app.get('/allProduct', async (req,res)=>{
           const cursor = foodsCollection.find()
           const result = await cursor.toArray();
           res.json(result)
    
    })
    
       app.delete('/allProduct/:id', async (req,res)=>{
        const id = req.params.id
        const query = {_id: ObjectId(id)}
        const result = await foodsCollection.deleteOne(query)
        res.send(result) 
    
    })
    
    
       app.get('/allProduct/:id', async (req,res)=>{
        const id = req.params.id
        const query = {_id: ObjectId(id)}
        const result = await foodsCollection.findOne(query)
        res.send(result)
       })
    
    
       app.put('/allProduct/:id', async (req,res)=>{
        const id = req.params.id
        const updateProduct = req.body
        const filter ={_id: ObjectId(id)}
       const updateDoc = {
        $set:{
          name: updateProduct.name,
          price: updateProduct.price,
          weight: updateProduct.weight,

        },
       };
   
        const result = await foodsCollection.updateOne(filter, updateDoc)
        res.send(result)
    })
    
    
    app.post('/order', async (req,res)=>{
      const newOrder = req.body;
      const result = await orderCollection.insertOne(newOrder)
      res.json(result)
      
    })
    
    
    app.get('/myOrder', async (req, res) => {
      let query = {};
      const email = req.query.email;
      if(email){
        query = {user: email}
      }
          const cursor = orderCollection.find(query);
          const orders = await cursor.toArray();
          res.json(orders);

  });


    
    app.put('/myOrder/:id', async (req, res) => {
      const id = req.params.id;
      const payment = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
          $set: {
              payment: payment
          }
      };
      const result = await orderCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    
    
app.get('/myOrder/:id',verifyToken, async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await orderCollection.findOne(query);
  res.json(result);
})
    
    // delete order
    app.delete('/myOrder/:id', async (req,res)=>{
      const id = req.params.id
      const query = {_id: ObjectId(id)}
      const result = await orderCollection.deleteOne(query)
      res.send(result) 
  
  })
    
    
    app.post('/create-payment-intent', async (req, res) => {
      const price = req?.body?.price
      console.log(price)
      const amount = price * 100
      if (amount > 999999) {
          return res.status(500).send({ message: 'Your price is too high' })
      }
      if(price){
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: "usd",
          payment_method_types: [
              "card"
          ],
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
    });
      }
      
    
      
    
    })
    
     // use post to get products by ids
     app.post('/productByIds', async (req, res) =>{
      const keys = req.body;
      const ids = keys.map(id => ObjectId(id));
      const query = {_id: {$in: ids}}
      const cursor = foodsCollection.find(query);
      const products = await cursor.toArray();
      console.log(keys);
      res.send(products);
    })
    
    // usres
    
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
          isAdmin = true;
      }
      res.json({ admin: isAdmin });
    })
    
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });
    
    app.put('/users', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });
    
    app.put('/users/admin', verifyToken, async (req, res) => {
      const user = req.body;
      const requester = req.decodedEmail;
      if (requester) {
          const requesterAccount = await usersCollection.findOne({ email: requester });
          if (requesterAccount.role === 'admin') {
              const filter = { email: user.email };
              const updateDoc = { $set: { role: 'admin' } };
              const result = await usersCollection.updateOne(filter, updateDoc);
              res.json(result);
          }
      }
      else {
          res.status(403).json({ message: 'you do not have access to make admin' })
      }
    
    })


  }
  finally{
     // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Fresh Valey server is running');
});

