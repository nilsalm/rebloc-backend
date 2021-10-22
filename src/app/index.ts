import { newChain, addBlockToChain } from "../blockchain/blockchain";
import { blockToString } from "../blockchain/block";
import express from "express";
import cors from "cors"
import { createProxyMiddleware } from "http-proxy-middleware";
import { newP2PServer, P2PServerListen, P2PSyncChain } from "./p2pServer";


const HTTP_PORT = process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT) : 3001;

// we can run our app something like the following to run on a
// different port: 
// HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev
// HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5002,ws://localhost:5001 npm run dev

//create a new app
const app = express();

//using the blody parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors())


// create a new blockchain instance
const blockchain = newChain();

const p2pServer = newP2PServer(blockchain)
P2PServerListen(p2pServer)


//EXPOSED APIs

//api to get the blocks
app.get("/blocks", (req, res) => {
  res.json(p2pServer.blockchain.chain);
});

//api to add blocks
app.post("/mine", (req, res) => {
  const block = addBlockToChain(p2pServer.blockchain, req.body.data);
  console.log(`New block added: ${blockToString(block)}`);
  
  P2PSyncChain(p2pServer)
  res.redirect("/blocks");
});

// app server configurations
app.listen(HTTP_PORT, () => {
  console.log(`listening on port ${HTTP_PORT}`);
});
