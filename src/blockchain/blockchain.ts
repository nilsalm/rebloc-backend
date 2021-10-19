import { recomputeHashForBlock, BlockType, createGenesisBlock, mineBlock } from "./block";

export interface ChainType {
  chain: Array<BlockType>;
  meta?: string
}

export const newChain = () => {
  let c: ChainType = {
    chain : [createGenesisBlock()],
    meta : "Nils chain"
  }
  return c
}

export const addBlockToChain = (blockchain: ChainType, data: string) => {
  const block = mineBlock(blockchain.chain[blockchain.chain.length-1], data);
  blockchain.chain.push(block);

  return block;
}


export const isValidChain = (blockchain: ChainType) => {
  if (JSON.stringify(blockchain.chain[0]) !== JSON.stringify(createGenesisBlock())) {
    return false;
  }

  for(let i = 1; i < blockchain.chain.length; i++) {
    const block = blockchain.chain[i];
    const lastBlock = blockchain.chain[i-1];

    if ((block.lastHash !== lastBlock.hash) || 
        (block.hash !== recomputeHashForBlock(block))) {
          return false;
        }
  }

  return true;
}

export const replaceChain = (currentChain: ChainType, newChain: ChainType) => {
  if (newChain.chain.length <= currentChain.chain.length) {
    console.log("Received chain is not longer than the current chain.");
    return currentChain;
  } else if (!isValidChain(newChain)) {
    console.log("Received chain is invalid.");
    return currentChain;
  }

  console.log("Replacing the current chain with new chain.")
  return newChain;
} 

