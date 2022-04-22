import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import { MongoClient, ServerApiVersion } from  'mongodb'
const port = process.env.PORT || 5000;
const app = express();

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0hwwt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log('server connected');
  client.close();
});


app.get('/', (req, res) => {
    res.send('Hello from genius server')
})

app.listen(port, () => {
    console.log(port)
})