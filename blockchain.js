const { time } = require("node:console");
const Block = require("./block");
const cryptohash = require("./crypto-hash");

class BlockChain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineblock({
      prevblock: this.chain[this.chain.length - 1],
      data,
    });
    this.chain.push(newBlock);
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.error("The incomming chain is not longer");
      return;
    }
    if (!BlockChain.isValidChain(chain)) {
      console.error("The incoming chain is not valid");
      return;
    }
    this.chain = chain;
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }
    for (let i = 1; i < chain.length; i++) {
      const { timestamp, prevhash, hash, nonce, difficulty, data } = chain[i];
      const lastdifficulty = chain[i - 1].difficulty;
      const reallasthash = chain[i - 1].hash;
      if (prevhash !== reallasthash) return false;
      const validatedhash = cryptohash(
        timestamp,
        prevhash,
        nonce,
        difficulty,
        data,
      );
      if (hash !== validatedhash) return false;
      if (Math.abs(lastdifficulty - difficulty) > 1) return false;
    }
    return true;
  }
}
const blockchain = new BlockChain();
blockchain.addBlock({ data: "Block1" });
blockchain.addBlock({ data: "Block2" });
const result = BlockChain.isValidChain(blockchain.chain);
console.log(blockchain.chain);
console.log(result);
module.exports = BlockChain;
