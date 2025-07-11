import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());
const redisClient = createClient();
startRedisClient();

app.post("/submit", (req, res) => {
  const { user_id, problem_id, lang, code } = req.body;

  redisClient.lPush(
    "submissions",
    JSON.stringify({ user_id, problem_id, lang, code })
  );
  console.log("pushed to redis");

  return res.status(200).json({ msg: "submitted successfully" });
});

async function startRedisClient() {
  try {
    await redisClient.connect();
    console.log("CONNECTED TO REDIS");
  } catch (error) {
    console.error("NOT CONNECTED TO REDIS");
  }
}

app.listen(8080, () => {
  console.log("server is running at : ", "8080");
});
