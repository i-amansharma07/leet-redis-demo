import express from "express";
import { createClient } from "redis";

import { WebSocket, WebSocketServer } from "ws";

const socketClients = new Map<string, WebSocket>();

const redisClient = createClient();
const pubSubClient = createClient();
startRedisClient();
startPubSubClient();

const app = express();
app.use(express.json());
const server = app.listen(8080);
const wss: WebSocketServer = new WebSocketServer({ server });
initWebsocket();

interface ElementType {
  user_id: string;
  problem_id: string;
  lang: string;
  code: string;
  status?: string;
}

app.post("/submit", (req, res) => {
  const { user_id, problem_id, lang, code } = req.body;

  redisClient.lPush(
    "submissions",
    JSON.stringify({ user_id, problem_id, lang, code })
  );

  return res.status(200).json({ msg: "Code Uploaded Successfully" });
});

function initWebsocket() {
  wss.on("connection", async (ws: WebSocket, req) => {
    const user_id = req.headers["user_id"] as string;
    socketClients.set(user_id, ws);

    await pubSubClient.SUBSCRIBE("results", (context) => {
      const parsedContext: ElementType = JSON.parse(context);
      const to = socketClients.get(parsedContext.user_id);

      to?.send(context, (err) => {
        console.error(err?.message);
      });
    });

    ws.on("close", () => {
      socketClients.delete(user_id);
    });
  });
}

async function startRedisClient() {
  try {
    await redisClient.connect();
    console.log("CONNECTED TO REDIS");
  } catch (error) {
    console.error("REDIS NOT CONNECTED TO REDIS");
  }
}
async function startPubSubClient() {
  try {
    await pubSubClient.connect();
    console.log("PUBSUB CONNECTED TO REDIS");
  } catch (error) {
    console.error("PUBSUB NOT CONNECTED TO REDIS");
  }
}

setInterval(() => {
  console.log(socketClients);
}, 3000);

app.listen(8080, () => {
  console.log("server is running at : ", "8080");
});
