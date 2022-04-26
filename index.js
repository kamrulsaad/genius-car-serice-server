import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'
const port = process.env.PORT || 5000;
const app = express();

app.use(cors())
app.use(express.json())

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: "Unauthorized acsess" })
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
        if (err) return res.status(403).send({ message: "Forbidden Acess" })
        req.decoded = decoded
    })
    next()
}


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0hwwt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const servicesData = client.db('geniusCarServices').collection('services')
        const ordersData = client.db('geniusCarServices').collection('orders')

        app.post('/login', async (req, res) => {
            const user = req.body
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_KEY, {
                expiresIn: '3d'
            })
            res.send(accessToken)
        })

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = servicesData.find(query)
            const services = await cursor.toArray()
            res.send(services);
        })

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const service = await servicesData.findOne(query);
            res.send(service)
        })

        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await servicesData.deleteOne(query)
            res.send(result)
        })

        app.post('/services', async (req, res) => {
            const newService = req.body;
            const result = await servicesData.insertOne(newService)
            res.send(result)
        })

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersData.insertOne(order)
            res.send(result)
        })

        app.get('/orders', verifyToken, async (req, res) => {
            const decodedEmail = req.decoded.email
            const email = req.query.email
            if (decodedEmail === email) {
                const query = { email }
                const result = ordersData.find(query)
                const orders = await result.toArray()
                console.log(orders);
                res.send(orders)
            }
            else{
                return res.status(403).send({message : "Forbidded Access"})
            }
        })

    }
    finally {

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello from genius server')
})

app.listen(port, () => {
    console.log(port)
})