"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)();
connectToRedis();
function processCode(submission) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("processing code.....");
        return yield new Promise((resolve) => setTimeout(() => {
            resolve("Accepted");
            console.log("processing complete");
        }, 2000));
    });
}
function connectToRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield redisClient.connect();
            console.log("WORKER CONNETED TO REDIS");
            while (1) {
                const submission = yield redisClient.BRPOP("submissions", 0);
                // const formattedSubmission = JSON.parse(submission);
                // console.log("formattedSubmission", formattedSubmission);
                // console.log(typeof formattedSubmission, formattedSubmission?.user_id);
                const result = yield processCode(submission);
                console.log("result : ", result, "\n \n");
            }
        }
        catch (e) {
            //@ts-ignore
            console.error("WORKER FAILED TO CONNECT WITH REDIS", e === null || e === void 0 ? void 0 : e.message);
        }
    });
}
