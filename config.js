const mine_Rate = 1000; // 1ms
const initialdifficulty = 2;
const GENESIS_DATA = {
  timestamp: 1,
  prevhash: "0x000",
  hash: "0x123",
  data: [],
  difficulty: initialdifficulty,
  nonce: 0,
};

module.exports = { GENESIS_DATA, mine_Rate };
