
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;

// middleware 
// middleware wdkhfas dfj

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.doqon.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });





async function run() {

    try {
        await client.connect();
        const database = client.db("AfricanShop");
        const servicesCollection = database.collection("services");
        const orderCollection = database.collection("order");
        const UserCollection = database.collection("users"); 
        const reviewCollection = database.collection("review"); 



        //get my order by gmail
      app.post('/services/xyz', async (req, res) => {
        const email = req.body.key;
        console.log(email);

        const query = {"email": email};

        const result = await orderCollection.find({}).toArray();

        res.json(result);
         })

    //delete order item by _id
    app.get("/order/deleteOrder/:id", async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const query = {_id: ObjectId(id)}

        const result = await orderCollection.deleteOne(query);

        console.log('delete successfully', result);
        res.json(result);
    })
        
   


        app.post('/services/order', async (req, res) => {
            const data = req.body;
            const result = await orderCollection.insertOne(data);
            console.log('data insert successfully', result);
            res.json(result);
        })



        //Get api home page limit product
        
        app.get('/services/limit', async (req, res) => {

            const cursor = servicesCollection.find({}).limit(6);
            const services = await cursor.toArray();
            res.send(services);
            console.log('database hitted services');

        });


        // all product unlimited

        app.get('/services', async (req, res) => {

          const cursor = servicesCollection.find({});
          const services = await cursor.toArray();
          res.send(services);
          console.log('database hitted services');

      });
        // 

   

        //    get single service 

        app.get('/services/jahid/:id', async (req, res) => {
          
            const id = req.params.id;
              console.log('getting specific id',id);
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query); 
            res.json(service);
            console.log(service);

        })



        // post api

        app.post('/services', async (req, res) => {

             const service = req.body;
              
            // console.log('hit the post api',service);
            console.log('hit the post api',service);
     
              
            const result = await servicesCollection.insertOne(service);
            res.json(result);

        })



        app.post('/users', async (req, res) => {

            const user = req.body;
             
           // console.log('hit the post api',service);
           console.log('hit the post new api',user);
    
             
           const result = await UserCollection.insertOne(user);
           console.log(result);
           res.json(result);

       })




//get my order by gmail
      app.post('/services/myOrder', async (req, res) => {
          const email = req.body.email;

          const query = {"email": email};

          const result = await orderCollection.find(query).toArray();

          res.json(result);
      })

      //delete order item by _id
      app.get("/order/deleteOrder/:id", async (req, res) => {
          const id = req.params.id;
          console.log(id);
          const query = {_id: ObjectId(id)}

          const result = await orderCollection.deleteOne(query);

          console.log('delete successfully', result);
          res.json(result);
      })

      //get all order
      app.get('/allOrder', async (req, res) => {
          const result = orderCollection.find({});
          const allOrders = await result.toArray();
          console.log('server is ready');
          res.json(allOrders);
      })
      

      //insert order
      app.post('/services/order', async (req, res) => {
          const data = req.body;
          const result = await orderCollection.insertOne(data);
          res.json(result);
      })



       app.put('/users', async(req, res) => {
        const user = req.body;
        const filter = { email: user.email };
        const options = { upsert: true };
        console.log('data submited');
        const updateDoc = { $set: user };
        const result = UserCollection.updateOne(filter, updateDoc, options);
        res.json(result);
      })

    //   status approve
    //update status
    app.post('/updateStatus', async (req, res) => {
        const id = req.body.id;
        const status = req.body.status;

        const filter = { _id: ObjectId(id) }
        const options = { upsert: true };
        const updateStatus =  {
            $set: {
              "status": status === 'pending' ? 'approved ' : 'pending'
            },
          };

        const result = await orderCollection.updateOne(filter, updateStatus, options);

        console.log('database hitted', result);
        res.json(result);
      })


    //   dashboard
      app.put('/users/admin', async (req, res) => {
        const user = req.body;
        const filter = { email: user.email };
        const updateDoc = { $set: {role: 'admin'} };
        const result = await UserCollection.updateOne(filter, updateDoc);
        console.log(result);
        res.json(result);
      })

      //check a user as admin or not
      app.get('/user/:email', async(req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const result = await UserCollection.findOne(query);
        let isAdmin = false;
        
        if(result?.role === "admin"){
          isAdmin = true;
        }

        res.json({ admin: isAdmin });

      })


      //add review
      app.post('/addReview', async(req, res) => {
        const data = req.body;
        const result = await reviewCollection.insertOne(data);

        res.json(result);
      })

      //get all review
      app.get('/getAllReview', async (req, res) => {
        
        const cursor = reviewCollection.find({});
        const review = await cursor.toArray();

        res.json(review);
      })



        
    } finally  {
        
    }


}

run().catch(console.dir);



app.get('/',(req, res) => {

    res.send('runnig assignment12 server');

});

app.listen(port , () => {

    console.log('runnig assignment-12 server', port);
})