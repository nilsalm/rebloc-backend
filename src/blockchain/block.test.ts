import { BlockType, createGenesisBlock, mineBlock } from "./block";

/**
 * describe is jest specific function
 * name of the object as string for which the test is written
 * function that will define a series of tests
 */
describe("Block", () => {
  let data: string, lastBlock: BlockType, block: BlockType;

  /**
   * beforeEach allows us to run some code before
   * running any test
   * example creating an instance
   */
  beforeEach(() => {
    data = "bar";
    lastBlock = createGenesisBlock();
    block = mineBlock(lastBlock, data);
  });

  /**
   * it function is used to write unit tests
   * first param is a description
   * second param is callback arrow function
   */
  it("sets the 'data' to match the input", () => {
    /**
     * expect is similar to assert
     * it expects something
     */
    expect(block.data).toEqual(data);
  });

  it("sets the 'lastHash' to match the hash of the last block", () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
  });
});
