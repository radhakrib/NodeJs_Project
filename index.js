import express from 'express'
import path from 'path'
const app = express();
import { MongoClient, ObjectId } from 'mongodb';

const publicPath = path.resolve('public')
app.use(express.static(publicPath));


app.set("view engine", 'ejs');

const dbName = "node-project";
const collectionName = "todo-list"
const url = "mongodb://localhost:27017"
const client = new MongoClient(url)

const connection = async () => {
    const connect = await client.connect();
    return await connect.db(dbName)
}
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, resp) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.find().toArray();
    resp.render("list", { result });
})
app.get("/add", (req, resp) => {
    resp.render("add");
})
app.get("/update", (req, resp) => {
    resp.render("update")
})
app.post("/add", async (req, resp) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = collection.insertOne(req.body)
    if (result) {
        resp.redirect("/");
    }
    else {
        resp.redirect("/add");
    }

})
app.post("/update", (req, resp) => {
    resp.redirect("/")
})
app.get("/delete/:id", async (req, resp) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = collection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result) {
        resp.redirect("/");

    }
    else {
        resp.send("Some error occured");
    }
})
app.get("/update/:id", async (req, resp) => {

    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.findOne({ _id: new ObjectId(req.params.id) });
    console.log(result);
    if (result) {
        resp.render("update", { result });
    }
    else {
        resp.send("some error");
    }

})
app.post("/update/:id", async (req, resp) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    const filter = { _id: new ObjectId(req.params.id) }
    const updateData = { $set: { title: req.body.title, description: req.body.description } }
    const result = await collection.updateOne(filter, updateData);
    if (result) {
        resp.redirect("/");
    }
    else {
        resp.send("some error occured");
    }

})
app.listen(3200);