# Rebloc (Backend)
> A basic blockchain in Node.js and Typescript

Created by [@haj300](https://github.com/haj300) and [@nils-earth](https://github.com/nils-earth) in order to play around and learn about blockchain in the context of react, typescript and more.
Based on [this fantastic tutorial](https://medium.com/coinmonks/implementing-blockchain-and-cryptocurrency-with-pow-consensus-algorithm-part-1-545fb32be0c2) by [Kashish Khullar](https://medium.com/@kashishkhullar)

For node.js-setup with typescript [this tutorial](https://khalilstemmler.com/blogs/typescript/node-starter-project/) was helpful.


Download the matching frontend from [Github](https://github.com/nils-earth/rebloc)

## ⚡️ Getting started
Give it a classic `npm install` before you run `npm run dev` the first time.

## 💡 What it does
### Block
The block is the atomic part of the blockchain and holds a bunch of functionality. It consists of the following paramters:

- timestamp: the time of creation of block in milliseconds
- lastHash: hash of the last block on the chain
- hash: hash of the current block
- data: data in the block, for example transactions or values
- nonce: basically noise to generate different hashes
- difficulty: measure to describe the mining difficulty, here the number of leading 0s as winning condition

The function `createNewBlock` can be understood as a constructor, whereas the function `mineBlock` can be seen as the process of finding the right hash. With the help of the hash and all the input paramters the block can be validated by recomputing the hash and comparing it with the hash on the block.

The difficulty is adjusted based on the time since the last block was mined.

### Blockchain
The blockchain is basically just an array of blocks. However, as a block is depended on the previous block, blockchain has to start with a genesis block.

Hence, the chain can be validated by checking if it starts with the genesis block and by looping through the blocks and checking if they are all valid. A node can receive a blockchain from a peer and will replace its own blockchain iwth the new one if the new blockchain is A valid and B longer than the current chain.

### P2P-network
A P2P-network is built between the peers using websockets to send the blockchain between each other once a new block is mined.
The port for the P2P connection is set via the environment, for example `P2P_PORT=5001`.
The environment variable `PEERS` is a a list of the peers' addresses like 
```PEERS=ws://localhost:5002,ws://localhost:5003```

### Webserver
A webserver is used to talk to a node via postman or via the [frontend](https://github.com/nils-earth/rebloc). A port is for this and set via the environment, e.g. `HTTP_PORT=3001`.
The webserver has two endpoints:
- `/blocks` to GET the current chain.
- `/mine` to POST data which is mined into the next block and then redirect to `/blocks`.


****

## More background and setups

### 👥 Running Peer-to-Peer
Open three terminals, they will be the three nodes for now. Run the following commands in terminal 1-3 respectively.

1. `npm run dev`
2. `HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev`
3. `HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5002,ws://localhost:5001 npm run dev`

Then you can use postman to trigger the different endpoints, either to get the blockchain or to mine new blocks
- `localhost:3001/blocks` (or 3002, 3003) to get the blockchain of the given node -> should be the same for all!
- `localhost:3001/mine` (or 3002, 3003) with a JSON-payload like `{"data" : "foo"}` -> should sync to all other nodes.


### 🤖 Github actions
Github actions are set up to build and push a multi-platform image to docker hub whenever the main-branch gets updated.

**Manual Dockerize**

- to build docker-container: `docker build -t nilsweber/blocks .`
- to run docker container: `docker run -p 3001:3001 nilsweber/blocks`
- use `push` and `pull` to sync with docker hub: `docker push nilsweber/blocks`
  
**Manual Multi-platform builds**

For example, when building on M1 for non-M1
```docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 --push -t nilsweber/blocks:latest .```


### 🕸 Starting a cluster of nodes
Maybe you want to run several nodes of the blockchain on your machine. Use the `./start-multiple-nodes.sh` file for this. You give it a number as argument to specify the number of nodes that you want to start, for example 5:
```$ ./start-multiple/nodes.sh 5```
starts up 5 nodes on the following addresses
- Node 1 on HTTP-port 3001 and P2P-port 5001
- Node 2 on HTTP-port 3002 and P2P-port 5002
- Node 3 on HTTP-port 3003 and P2P-port 5003
- Node 4 on HTTP-port 3004 and P2P-port 5004
- Node 5 on HTTP-port 3005 and P2P-port 5005

****


## 🥳 Gitmoji
Check out [Gitmoji](https://gitmoji.dev/) to beautifully label your commits.


## 📋 TODO
- [x] Build basic blockchain ([Part 2](https://medium.com/coinmonks/implementing-blockchain-and-cryptocurrency-with-pow-consensus-algorithm-in-node-js-part-2-4524d0bf36a1)) 
- [x] Refactor into functional style with typescript
- [x] Make into simple webserver ([Part 3](https://medium.com/coinmonks/part-3-implementing-blockchain-and-cryptocurrency-with-pow-consensus-algorithm-d9b8cb928e3e))
- [x] Build P2P synchronisation ([Part 4](https://medium.com/coinmonks/part-4-implementing-blockchain-and-cryptocurrency-with-pow-consensus-algorithm-9201eb7e8a41))
- [x] Implement difficulty, nonce ([Part 5](https://medium.com/coinmonks/part-5-implementing-blockchain-and-cryptocurrency-with-pow-consensus-algorithm-a7f8853d23dc))
- [ ] Write tests with jest (get them running)
- [x] Dockerize
- [ ] sync peers through the network
- [ ] Host on different nodes (raspi, digitalocean, laptop)
