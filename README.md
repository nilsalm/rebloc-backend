# Basic Blockchain

Based on [this tutorial](https://medium.com/coinmonks/implementing-blockchain-and-cryptocurrency-with-pow-consensus-algorithm-part-1-545fb32be0c2) on Medium by [Kashish Khullar](https://medium.com/@kashishkhullar)

For node.js-setup with typescript [this tutorial](https://khalilstemmler.com/blogs/typescript/node-starter-project/) was helpful.


# Running Peer-to-Peer
Open three terminals, they will be the three nodes for now. Run the following commands in terminal 1-3 respectively (you can skip the third as well)

1. `npm run dev`
2. `HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev`
3. `HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5002,ws://localhost:5001 npm run dev`

Then you can use postman to trigger the different endpoints, either to get the blockchain or to mine new blocks
- `localhost:3001/blocks` (or 3002, 3003) to get the blockchain of the given node -> should be the same for all!
- `localhost:3001/mine` (or 3002, 3003) with a JSON-payload like `{"data" : "foo"}` -> should sync to all other nodes.
  
# Dockerize
- to build docker-container: `docker build -t nilsweber/blocks .`
- to run docker container: `docker run -p 3001:3001 nilsweber/blocks`
- use `push` and `pull` to sync with docker hub: `docker push nilsweber/blocks`
  
## building on M1 for non-M1
`docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 --push -t nilsweber/blocks:latest .`


# `.env` file
```
HTTP_PORT=3002
P2P_PORT=5002
PEERS=ws://localhost:5001
```

`docker run -p 3002:3002 -p 5002:5002 --env-file .env2 nilsweber/blocks`

## TODO
- [x] Build basic blockchain (part 2) 
- [x] Refactor into functional style with typescript
- [x] Make into simple webservre (part 3)
- [x] Build P2P synchronisation (part 4)
- [x] Implement difficulty, nonce, (part 5)
- [ ] Write tests with jest (get them running)
- [x] Dockerize
- [ ] sync peers through the network
- [ ] Host on different nodes (raspi, digitalocean, laptop)
