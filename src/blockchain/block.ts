import sha256 from "crypto-js/sha256";

const DIFFICULTY = 3;
const MINE_RATE = 10000;

export interface BlockType {
  timestamp: number;    // the time of creation of block in milliseconds
  lastHash: string;     // hash of the last block on the chain
  hash: string;         // hash of the current block
  data: string;         // data in the block or the transactions
  nonce: number;        // basically noise to generate different hashes
  difficulty: number;   // measure to describe the mining difficulty
}

const createNewBlock = (timestamp: number, lastHash: string, hash: string, data: string, nonce: number, difficulty: number) => {
  const block: BlockType = {
    timestamp: timestamp,
    lastHash: lastHash,
    hash: hash,
    data: data,
    nonce: nonce,
    difficulty: difficulty
  }
  return block;
}

export const createGenesisBlock = () => {
  return createNewBlock(0, '----', 'genesis hash', 'genesis', 0, DIFFICULTY)
}

const computeHash = (timestamp: number, lastHash: string, data: string, nonce: number, difficulty: number) => {
  return sha256(`${nonce}${difficulty}${timestamp}${lastHash}${data}`).toString();
}

export const mineBlock = (lastBlock: BlockType, data: string) => {
  let timestamp: number; 
  const lastHash = lastBlock.hash;
  let nonce = 0;
  let difficulty: number;
  let hash: string;

  //generate the hash of the block
  do {
    nonce++;
    timestamp = Math.floor(new Date().getTime()); // epoch in ms
    difficulty = adjustDifficulty(lastBlock, timestamp)
    hash = computeHash(timestamp, lastHash, data, nonce, difficulty);

    // checking if we have the required no of leading number of zeros
  } while(hash.substring(0, difficulty) !== '0'.repeat(difficulty));

  return createNewBlock(timestamp, lastHash, hash, data, nonce, difficulty);
}

export const blockToString = (block: BlockType) => {
  return `Block - 
  Timestamp  : ${block.timestamp} 
  Last Hash  : ${block.lastHash.substring(0,10)} 
  Hash       : ${block.hash.substring(0,10)} 
  Data       : ${block.data}
  Nonce      : ${block.nonce}
  Difficulty : ${block.difficulty}`;
}

export const recomputeHashForBlock = (block: BlockType) => {
  // decomposing
  const { timestamp, lastHash, data, nonce, difficulty } = block;
  return computeHash(timestamp, lastHash, data, nonce, difficulty);
}

const adjustDifficulty = (lastBlock: BlockType, currentTime: number) => {
  let { difficulty } = lastBlock;
  // difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1; 

  if (lastBlock.timestamp + MINE_RATE > currentTime) {
    return difficulty + 1
  } else {
    difficulty = difficulty - 1
    if (difficulty > 0) {
      return difficulty
    } else {
      return 1
    }
  }
}
