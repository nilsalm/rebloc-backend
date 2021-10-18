import sha256 from "crypto-js/sha256";


interface BlockType {
  timestamp: number; // the time of creation of block in milliseconds
  lastHash: string; // hash of the last block on the chain
  hash: string; // hash of the current block
  data: string; // data in the block or the transactions
}

// var timestamp = Math.floor(new Date().getTime()); // epoch in ms


const createNewBlock = (timestamp: number, lastHash: string, hash: string, data: string) => {
  const block: BlockType = {
    timestamp: timestamp,
    lastHash: lastHash,
    hash: hash,
    data: data
  }
  return block;
}


const createGenesisBlock = () => {
  return createNewBlock(0, '----', 'genesis hash', 'genesis')
}


const hash = (timestamp: number, lastHash: string, data: string) => {
  return sha256(`${timestamp}${lastHash}${data}`).toString();
}


const mineBlock = (lastBlock: BlockType, data: string) => {
  let hash;
  let timestamp;
  const lastHash = lastBlock.hash;

  return createNewBlock(timestamp, lastHash, hash, data);
}


export const blockToString = (block: BlockType) => {
  return `Block - 
  Timestamp : ${block.timestamp} 
  Last Hash : ${block.lastHash.substring(0,19)} 
  Hash      : ${block.hash} 
  Data      : ${block.data}`;
}

