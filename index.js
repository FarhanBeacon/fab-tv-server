const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vasbeiy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Database and Collection
    const channelsCollection = client.db("fabtv").collection("channels");
    const webSeriesCollection = client.db("fabtv").collection("webseries");
    const episodesCollection = client.db("fabtv").collection("episodes");
    //  get all channels
    app.get("/channels", async (req, res)=>{
        const query = {};
        const channels = await channelsCollection.find(query).toArray();
        res.send(channels);
    });

    // get all web series
    app.get("/webseries", async ( req, res) => {
        const query = {};
        const webseries = await webSeriesCollection.find(query).toArray();
        res.send(webseries);
    });

    // get all episodes
    app.get("/episodes", async (req, res) => {
        const query = {};
        const episodes = await episodesCollection.find(query).toArray();
        res.send(episodes);
    });

    // get episodes by web series id
    app.get("/episodes/:webSeriesId", async (req, res) => {
        const webSeriesId = req.params.webSeriesId;
        const query = { seriesId: webSeriesId };
        const episodes = await episodesCollection.find(query).toArray();
        res.send(episodes);
    });
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
