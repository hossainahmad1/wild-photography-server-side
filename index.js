const express = require('express');
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2wczu4w.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const reviewCollection = client.db('reviewDb').collection('review');
        const serviceCollection = client.db('reviewDb').collection('service');


        app.post('/reviewadd', async (req, res) => {
            const services = req.body;
            const result = await reviewCollection.insertOne(services)
            res.send(result)
        })


        app.get('/reviewlimit', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query)
            const review = await cursor.limit(3).toArray()
            res.send(review)
        })
        app.get('/review', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query)
            const review = await cursor.toArray()
            res.send(review)
        })

        app.get('/reviewlimit/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await reviewCollection.findOne(query)
            res.send(result)
        })


        // service api
        app.post('/service', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result)
        })


        app.get('/service', async (req, res) => {
            let query = {}
            if (req.query.serviceid) {
                query = {
                    serviceid: req.query.serviceid
                }
            }

            const cursor = serviceCollection.find(query)
            const service = await cursor.toArray()
            res.send(service)
        })

        app.get('/servicemail', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = serviceCollection.find(query);
            const review = await cursor.toArray();
            res.send(review)
        })

        app.patch('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const updateDoc = {
                $set: {
                    
                }
            }
            const result = await serviceCollection.updateOne(query, updateDoc);
            res.send(result);
        })





        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(err => console.log(err))




app.get('/', (req, res) => {
    res.send('Review server is running')
})


app.listen(port, () => {
    console.log(`server running on port${port}`)
})


