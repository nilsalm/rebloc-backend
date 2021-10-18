import sha256 from "crypto-js/sha256";


export interface BlockType {
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


export const createGenesisBlock = () => {
  return createNewBlock(0, '----', 'genesis hash', 'genesis')
}


const computeHash = (timestamp: number, lastHash: string, data: string) => {
  return sha256(`${timestamp}${lastHash}${data}`).toString();
}

export const mineBlock = (lastBlock: BlockType, data: string) => {
  let timestamp: number = Math.floor(new Date().getTime()); // epoch in ms
  const lastHash = lastBlock.hash;
  let hash: string = computeHash(timestamp, lastHash, data);

  return createNewBlock(timestamp, lastHash, hash, data);
}


export const blockToString = (block: BlockType) => {
  return `Block - 
  Timestamp : ${block.timestamp} 
  Last Hash : ${block.lastHash.substring(0,10)} 
  Hash      : ${block.hash.substring(0,10)} 
  Data      : ${block.data}`;
}


export const recomputeHashForBlock = (block: BlockType) => {
  // decomposing
  const { timestamp, lastHash, data} = block;
  return computeHash(timestamp, lastHash, data);
}


