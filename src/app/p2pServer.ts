import WebSocket from "ws"
import { ChainType, replaceChain } from "../blockchain/blockchain";


//declare the peer to peer server port 
const P2P_PORT = process.env.P2P_PORT ? parseInt(process.env.P2P_PORT) : 5001;


//list of address to connect to
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

export interface P2PServerType {
  blockchain: ChainType;
  sockets: Array<WebSocket>;
}

export const newP2PServer = (blockchain: ChainType) => {
  const server: P2PServerType = {
    blockchain: blockchain,
    sockets: []
  }
  return server
}

export const P2PServerListen = (p2pServer: P2PServerType) => {
  // create the p2p server with port as argument
  const wsServer = new WebSocket.Server({ port: P2P_PORT })

  // event listener and a callback function for any new connection
  // on any new connection the current instance will send the current chain
  // to the newly connected peer
  wsServer.on('connection', socket => P2PConnectSocket(p2pServer, socket));

  // to connect to the peers that we have specified
  P2PConnectToPeers(p2pServer);

  console.log(`Listening for peer to peer connection on port : ${P2P_PORT}`);
}

// after making connection to a socket
const P2PConnectSocket = (p2pServer: P2PServerType, socket: WebSocket) => {
  // push the socket too the socket array
  p2pServer.sockets.push(socket)
  console.log("Socket connected");
  
  // register a message event listener to the socket
  P2PMessageHandler(p2pServer, socket);

  // on new connection send the blockchain chain to the peer
  P2PSendChain(p2pServer, socket);
}

const P2PConnectToPeers = (p2pServer: P2PServerType) => {
  //connect to each peer
  peers.forEach(peer => {

    // create a socket for each peer
    const socket = new WebSocket(peer);
    
    // open event listner is emitted when a connection is established
    // saving the socket in the array
    socket.on('open',() => P2PConnectSocket(p2pServer, socket));

  });
}

const P2PMessageHandler = (p2pServer: P2PServerType, socket: WebSocket) => {
  //on recieving a message execute a callback function
  socket.on('message', message =>{
    const data = JSON.parse(message.toString());
    // console.log("data ", data);

    const newChain: ChainType = {
      chain: data,
      meta: "new chain"
    }
    p2pServer.blockchain = replaceChain(p2pServer.blockchain, newChain)
  });
}


/**
 * helper function to send the chain instance
 */

const P2PSendChain = (p2pServer: P2PServerType, socket: WebSocket) => {
    socket.send(JSON.stringify(p2pServer.blockchain.chain));
}

/**
 * utility function to sync the chain
 * whenever a new block is added to
 * the blockchain
 */

export const P2PSyncChain = (p2pServer: P2PServerType) => {
    p2pServer.sockets.forEach(socket =>{
        P2PSendChain(p2pServer, socket);
    });
}

 