import { arrayBuffer } from "stream/consumers";
import WebSocket, { OPEN } from "ws"
import { ChainType, replaceChain } from "../blockchain/blockchain";
require("dotenv").config()

//declare the peer to peer server port 
const P2P_PORT = process.env.P2P_PORT ? parseInt(process.env.P2P_PORT) : 5001;

const LOCALHOST = process.env.LOCALHOST || 'localhost';

//list of address to connect to
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

// Adding the home node to peers
if (P2P_PORT !== 5001) [
  peers.push(`ws://${LOCALHOST}:5001`)
]

export interface P2PServerType {
  blockchain: ChainType;
  sockets: Array<WebSocket>;
  peers: string[];
}

export const newP2PServer = (blockchain: ChainType) => {
  const server: P2PServerType = {
    blockchain: blockchain,
    sockets: [],
    peers: [...peers]
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

  if (socket.url == null) {
    let idx = p2pServer.sockets.indexOf(socket)
    p2pServer.sockets.splice(idx, 1)
  }

  console.log("Socket connected", socket.url)

  p2pServer.sockets.push(socket)

  // register a message event listener to the socket
  P2PMessageHandler(p2pServer, socket);

  // on new connection send the blockchain chain to the peer
  P2PSendChain(p2pServer, socket);
  // P2PSendPeer(p2pServer, socket)
}

const P2PConnectToPeers = (p2pServer: P2PServerType) => {
  //connect to each peer
  p2pServer.peers.forEach(peer => {
    // only open a new connection if there is no existing one
    if (p2pServer.sockets.some(socket => socket.url === peer) == false) {
      // create a socket for each peer
      const socket = new WebSocket(peer);
      
      // open event listner is emitted when a connection is established
      // saving the socket in the array
      socket.on('open', () => {
        P2PConnectSocket(p2pServer, socket)
        P2PSendPeer(p2pServer, socket)
      });
    }
  });
}

const P2PMessageHandler = (p2pServer: P2PServerType, socket: WebSocket) => {
  //on recieving a message execute a callback function
  socket.on('message', message => {
    const data = JSON.parse(message.toString());
    // console.log("data ", data);

    switch (data.type) {
      case "chain":
        const newChain: ChainType = {
          chain: JSON.parse(data.data),
          meta: "new chain"
        }
        p2pServer.blockchain = replaceChain(p2pServer.blockchain, newChain)
        break;
      
      case "peers":
        let newPeers = JSON.parse(data.data)
        let oldPeers = p2pServer.peers;
        
        p2pServer.peers = updatePeers(p2pServer.peers, newPeers)
        
        if (oldPeers.length < p2pServer.peers.length) {
          P2PConnectToPeers(p2pServer)
        }
        break;
    
      default:
        break;
    }
  });
}


/**
 * helper function to send the chain instance
 */

const P2PSendChain = (p2pServer: P2PServerType, socket: WebSocket) => {
  let msg = {
    type: "chain",
    data: JSON.stringify(p2pServer.blockchain.chain)
  }
  socket.send(JSON.stringify(msg));
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



/**
 * helper function to send the list of peers
 */

const P2PSendPeer = (p2pServer: P2PServerType, socket: WebSocket) => {
  let msg = {
    type: "peers",
    data: JSON.stringify([...p2pServer.peers, getMyAdress()])
  }
  socket.send(JSON.stringify(msg));
}

/**
 * utility functions to sync the peers
 * whenever a new peer is added to the network
 */

const updatePeers = (currentPeers: string[], newPeers: string[]) => {
  let array = [...currentPeers, ...newPeers];
  let uniq = Array.from(new Set(array));
  return removeOwnAdress(uniq)
}

const removeOwnAdress = (array: string[]) => {
  let idx = array.indexOf(getMyAdress())
  if (idx > -1) {
    array.splice(idx, 1)
  }
  return array
}

const getMyAdress = () => {
  return `ws://${LOCALHOST}:${P2P_PORT}`
}
