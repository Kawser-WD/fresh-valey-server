const express = require('express')
const bodyParser = require('body-parser');
const cors = require ('cors');
const fileUpload = require('express-fileupload')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const publicRouter = require('./publicRouter/publicRouter');
const adminRouter = require('./adminRouter/adminRouter');
require('dotenv').config();

const port = process.env.PORT || 4000;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('foods'));
app.use(fileUpload());


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qqegz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// client.connect(err => {
//   console.log(err)
//   const foodsCollection = client.db("foodsData").collection("foodCollections");
//   console.log('database connection successfully')
//   client.close();
// });


app.use('/', publicRouter)
app.use('/', adminRouter)

// adminRouter.post('/addFood', (req, res)=>{
//   const name = req.body.name;
//   const price = req.body.price;
//   const file = req.files.file;
//   console.log(name,price,file)
//   const filePath = `${__dirname}/foods/${file.name}`;
//   file.mv(filePath, err =>{
//       if(err){
//           console.log(err)
//           return res.status(500).send({msg:'faield to upload msg'})
//       }
//       const newImg = fs.readFileSync(filePath);
//       const encImg = newImg.toString('base64');
//       var image = {
//           contentType: req.files.file.mimetype,
//           size: req.files.file.size,
//           img: Buffer(encImg, 'base64')
//       }
//       foodsCollection.insertOne({name, price, image})
//       .then(result=>{
//           fs.remove(filePath, err =>{
//               if(err){
//                   console.log(err)
//               }
//               res.send(result.insertedCount > 0)
//           })
         
//       })
//       // return res.send({name: file.name, path: `/${file.name}`})
//   })

// })





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})