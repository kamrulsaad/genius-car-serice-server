import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import { MongoClient, ObjectId, ServerApiVersion } from  'mongodb'
const port = process.env.PORT || 5000;
const app = express();

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0hwwt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect()
        const servicesData = client.db('geniusCarServices').collection('services')

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = servicesData.find(query)
            const services = await cursor.toArray()
            res.send(services);
        })

        app.get('/service/:id', async (req, res) =>{
            const id = req.params.id
            const query = {_id : ObjectId(id)}
            const service = await servicesData.findOne(query);
            res.send(service)
        })

    }
    finally{

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello from genius server')
})

app.listen(port, () => {
    console.log(port)
})