import { createGenesisBlock } from "./block";
import { newChain, addBlock, ChainType } from "./blockchain";


describe("Blockchain", () => {
  let blockchain: ChainType;

  beforeEach(() => {
    blockchain = newChain();
  });

  it("starts with the genesis block", () => {
    expect(blockchain.chain[0]).toEqual(createGenesisBlock());
  });

  it("adds a new block", () => {
    const data = "foo";
    let block = addBlock(blockchain, data)
    expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(data)
  });
});
