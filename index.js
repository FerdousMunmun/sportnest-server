const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);


const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { createRemoteJWKSet } = require("jose-cjs");
dotenv.config()
const app = express()
const PORT = process.env.PORT;
app.use(cors())
app.use(express.json())

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})










app.get('/', (req, res) =>{
  res.send('server is runing fine')
})




// mongodb code start

const uri = process.env.MONGODB_URI ;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// jwtcreate

const JWKS = createRemoteJWKSet(
      new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
    );

const verifyToken = async(req, res ,next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token found" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
try {
  const { payload } = await jwtVerify(token, JWKS )
 console.log(payload)
 next()
}
 catch(error){
  return res.status(403).json({message:"Forbidden"});
 }

  next();
};

async function run() {
  try {
    
    // await client.connect();
// mongodbcollection
    const db = client.db("sportnest");

    const facilityCollection = db.collection("facilities");
    const bookingCollection = db.collection("bookings")
// getapicreate

  app.get('/featured',async (req, res) => {
      const result = await facilityCollection.find().limit(4).toArray();
      res.json(result)
 });


    app.get('/facilities',async (req, res) => {
      const result = await facilityCollection.find().toArray();

      res.json(result)
 });

    

    app.post('/facilities',async (req, res) => {
      const facilityData = req.body
      console.log(facilityData)
      const result = await facilityCollection.insertOne(facilityData)

      res.json(result)
 })
//middlware
  app.get('/facilities/:id',verifyToken,async (req, res) => {
     const {id} = req.params
     const result = await facilityCollection.findOne({_id: new ObjectId(id)})

      res.json(result)
 })

// patchchapicreate

 app.patch('/facilities/:id',async (req, res) => {
     const {id} = req.params
     const upDatedData = req.body
     const result = await facilityCollection.updateOne(
      {_id: new ObjectId(id)},
      {$set: upDatedData}
     )

      res.json(result)
 })
// deleteapicreate

   app.delete('/facilities/:id',async (req, res) => {
     const {id} = req.params;
     const result = await facilityCollection.deleteOne({_id: new ObjectId(id)})

      res.json(result)
 })
  app.get('/booking/:userId',async (req, res) => {
     const userId = req.params.userId;
     const result = await bookingCollection.find({userId:userId}).toArray();

      res.json(result)
 });



    app.post('/booking', verifyToken, async (req, res) => {
     const bookingData = req.body;
     const result = await bookingCollection.insertOne(bookingData)

      res.json(result)
 });


  app.delete('/booking/:bookingId',verifyToken, async (req, res) => {
     const {bookingId} = req.params;
     const result = await bookingCollection.deleteOne({_id: new ObjectId(bookingId)})

      res.json(result)
 });
   
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




