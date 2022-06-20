const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const client = new MongoClient(process.env.MONGO_CONNECTION);
client.connect().then(() => console.log("connected to db"));

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/searchone", async (req, res) => {
  try {
    if (req.query.post) {
      let results;
      if (req.query.post.includes(",") || req.query.post.includes(" ")) {
        results = await client
          .db("myFirstDatabase")
          .collection("posts")
          .aggregate([
            {
              $search: {
                index: "autocomplete",
                autocomplete: {
                  query: req.query.post,
                  path: "title",
                  tokenOrder: "any",
                },
              },
            },
            {
              $project: {
                title: 1,
                _id: 1,
                post: 1,

              },
            },
            {
              $limit: 10,
            },
          ])
          .toArray();

        return res.send(results);
      }

      result = await client
        .db("myFirstDatabase")
        .collection("posts")
        .aggregate([
          {
            $search: {
              index: "autocomplete",
              autocomplete: {
                query: req.query.post,
                path: "title",
                tokenOrder: "any",
              },
            },
          },
          {
            $project: {
              title: 1,
              _id: 1,
              post: 1,

            },
          },
          {
            $limit: 10,
          },
        ])
        .toArray();

      return res.send(result);
    }
    res.send([]);
  } catch (error) {
    console.error(error);
    res.send([]);
  }
});

app.get("/", async (req, res) => {
  let result = await client
    .db("myFirstDatabase")
    .collection("posts")
    .findOne({ title: "Bilgisayar Programcılığı" });

  res.send(result);
});

app.listen(4000, console.log("listening on 4000"));
