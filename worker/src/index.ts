import { createClient } from "redis";

const redisClient = createClient();

connectToRedis();

interface ElementType {
  user_id: string;
  problem_id: string;
  lang: string;
  code: string;
  status?: string;
}

async function processCode(context: ElementType) {
  console.log("processing code.....");

  await new Promise((resolve) =>
    setTimeout(() => {
      if (true) {
        context["status"] = "Accepted";
        resolve("Accepted");
      }
      console.log("processing complete");
    }, 2000)
  );

  await redisClient.PUBLISH("results", JSON.stringify(context));
}

async function connectToRedis() {
  try {
    await redisClient.connect();
    console.log("WORKER CONNETED TO REDIS");

    while (1) {
      const { element } = await redisClient.BRPOP("submissions", 0);
      const parsedElement = JSON.parse(element);

      await processCode(parsedElement);
    }
  } catch (e: unknown) {
    //@ts-ignore
    console.error("WORKER FAILED TO CONNECT WITH REDIS", e?.message);
  }
}
