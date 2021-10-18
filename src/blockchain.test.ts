import { createGenesisBlock } from "./block";
import { newChain, addBlockToChain, ChainType, isValidChain, replaceChain } from "./blockchain";


describe("Blockchain", () => {
  let blockchain: ChainType, blockchain2: ChainType;

  beforeEach(() => {
    blockchain = newChain();
    blockchain2 = newChain();
  });

  it("starts with the genesis block", () => {
    expect(blockchain.chain[0]).toEqual(createGenesisBlock());
  });

  it("adds a new block", () => {
    const data = "foo";
    let block = addBlockToChain(blockchain, data)
    expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(data)
  });

  it('validates a valid chain',()=>{
    addBlockToChain(blockchain2, 'foo');
    // conventional method for check true and false is toBe
    expect(isValidChain(blockchain2)).toBe(true);
  });

  it('invalidates a chain with a corrupt the genesis block',()=>{
      blockchain2.chain[0].data = 'bad data';

      expect(isValidChain(blockchain2)).toBe(false);
  });

  it('invalidates a corrput chain',()=>{
      addBlockToChain(blockchain2, 'foo');
      blockchain2.chain[1].data = 'not foo';

      expect(isValidChain(blockchain2)).toBe(false);
  });

  it('replaces the chain with a valid chain',()=>{
      addBlockToChain(blockchain2, 'goo');
      blockchain = replaceChain(blockchain, blockchain2);
      expect(blockchain.chain).toEqual(blockchain2.chain);
  });

  it('does not replaces the chain with a one with less than or equal to chain',()=>{
      addBlockToChain(blockchain, 'foo');
      blockchain = replaceChain(blockchain, blockchain2);
      expect(blockchain.chain).not.toEqual(blockchain2.chain);
  });
});
