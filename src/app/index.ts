import { newChain, addBlockToChain } from "../blockchain/blockchain";
import { blockToString } from "../blockchain/block";
import express from "express";
import bodyParser from "body-parser";

const HTTP_PORT = process.env.HTTP_PORT || 3001;

// we can run our app something like the following to run on a
// different port
// HTTP_PORT = 3002 npm run dev

//create a new app
const app = express();

//using the blody parser middleware
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// create a new blockchain instance
const blockchain = newChain();

//EXPOSED APIs

//api to get the blocks
app.get("/blocks", (req, res) => {
  res.json(blockchain.chain);
});

//api to add blocks
app.post("/mine", (req, res) => {
  const block = addBlockToChain(blockchain, req.body.data);
  console.log(`New block added: ${blockToString(block)}`);

  res.redirect("/blocks");
});

// app server configurations
app.listen(HTTP_PORT, () => {
  console.log(`listening on port ${HTTP_PORT}`);
});
