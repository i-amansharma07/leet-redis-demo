import { createClient } from "redis";

const redisClient = createClient();

connectToRedis();

async function processCode(submission: string) {
  console.log("processing code.....");

  return await new Promise((resolve) =>
    setTimeout(() => {
      resolve("Accepted");
      console.log("processing complete");
    }, 2000)
  );
}

async function connectToRedis() {
  try {
    await redisClient.connect();
    console.log("WORKER CONNETED TO REDIS");

    while (1) {
      const submission = await redisClient.BRPOP("submissions", 0);

      // const formattedSubmission = JSON.parse(submission);
      // console.log("formattedSubmission", formattedSubmission);
      // console.log(typeof formattedSubmission, formattedSubmission?.user_id);
      const result = await processCode(submission);
      console.log("result : ", result, "\n \n");
    }
  } catch (e: unknown) {
    //@ts-ignore
    console.error("WORKER FAILED TO CONNECT WITH REDIS", e?.message);
  }
}
