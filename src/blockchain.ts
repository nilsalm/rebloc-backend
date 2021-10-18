import { BlockType, createGenesisBlock, mineBlock } from "./block";

export interface ChainType {
  chain: Array<BlockType>;
  meta?: string
}

export const newChain = () => {
  let c: ChainType;
  c.chain = [createGenesisBlock()];
  c.meta = "Nils chain"
  return c
}

export const addBlock = (chain: ChainType, data: string) => {
  const block = mineBlock(chain.chain[chain.chain.length-1], data);
  chain.chain.push(block);

  return block;
}

