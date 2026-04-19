const bodyparser = require("body-parser");
const express = require("express");
const Blockchain = require("./blockchain");
const PubSub = require("./publishsubscribe");
const app = express();
app.use(express.json());
const default_port = 3000;
const blockchain = new Blockchain();
const pubsub = new PubSub(blockchain);
const request = require("request");
const ROOT_NODE_ADDRESS = `http://localhost:${default_port}`;
setTimeout(() => pubsub.broadcastChain(), 1000);
app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.post("/api/mine", (req, res) => {
  const { data } = req.body;
  blockchain.addBlock({ data });
  pubsub.broadcastChain();
  res.redirect("/api/blocks");
});

const synChains = () => {
  request(
    { url: `${ROOT_NODE_ADDRESS}/api/blocks` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootChain = JSON.parse(body);
        console.log("Replace chain on sync with", rootChain);
        blockchain.replaceChain(rootChain);
      }
    },
  );
};

let peer_port;
if (process.env.GENERATE_PEER_PORT === "true") {
  peer_port = default_port + Math.ceil(Math.random() * 1000);
}
const port = peer_port || default_port;
app.listen(port, () => {
  synChains();
  console.log(`Listening to Port:${port}`);
});
