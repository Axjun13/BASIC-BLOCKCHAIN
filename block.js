const hextobinary = require("hex-to-binary");
const { time } = require("node:console");
const { GENESIS_DATA, mine_Rate } = require("./config");
const cryptohash = require("./crypto-hash");
const { diffieHellman } = require("node:crypto");
const { disconnect } = require("node:process");
class Block {
  constructor({ timestamp, prevhash, hash, data, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.prevhash = prevhash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }
  static genesis() {
    return new this(GENESIS_DATA);
  }
  static mineblock({ prevblock, data }) {
    let hash, timestamp;
    const prevhash = prevblock.hash;
    let nonce = 0;
    let { difficulty } = prevblock;
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustdifficulty({
        originalblock: prevblock,
        timestamp,
      });
      hash = cryptohash(timestamp, prevhash, data, nonce, difficulty);
    } while (
      hextobinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    );
    return new this({
      timestamp,
      prevhash,
      data,
      difficulty,
      nonce,
      hash,
    });
  }
  static adjustdifficulty({ originalblock, timestamp }) {
    const { difficulty } = originalblock;
    if (difficulty < 1) return 1;
    const difference = timestamp - originalblock.timestamp;
    if (difference > mine_Rate) return difficulty - 1;
    return difficulty + 1;
  }
}

const block1 = new Block({
  timestamp: "2/09/22",
  hash: "0xacb",
  prevhash: "0xc12",
  data: "hello",
});
// const genesisBlock = Block.genesis();
// console.log(genesisBlock);
// const result = Block.mineblock({ prevblock: block1, data: "block2" });
// console.log(result);
module.exports = Block;
