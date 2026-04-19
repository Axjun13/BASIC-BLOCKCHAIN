const Blockchain = require("./blockchain");

const blockchain = new Blockchain();
blockchain.addBlock({ data: "new data" });
console.log(blockchain.chain[blockchain.chain.length - 1]);
let prevtimestamp, nexttimestamp, nextblock, timediff, averagetime;

const times = [];
for (let i = 0; i < 1000; i++) {
  prevtimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;
  blockchain.addBlock({ data: `block ${i}` });
  nextblock = blockchain.chain[blockchain.chain.length - 1];
  nexttimestamp = nextblock.timestamp;
  timediff = nexttimestamp - prevtimestamp;
  times.push(timediff);
  averagetime = times.reduce((total, num) => total + num) / times.length;
  console.log(
    `Time to mine block: ${timediff}ms , Difficulty:${nextblock.difficulty}, Averagetime: ${averagetime}ms`,
  );
}
