# Leet code like archticheture
[![N|Solid](https://res.cloudinary.com/ds18av88d/image/upload/v1752317341/dump/Screenshot_from_2025-07-12_14-19-24_ycox49.png)](https://res.cloudinary.com/ds18av88d/image/upload/v1752317341/dump/Screenshot_from_2025-07-12_14-19-24_ycox49.png)

## Installation
```sh
git clone https://github.com/i-amansharma07/leet-redis-demo.git
cd server && npm i 
cd ..
cd worker && npm i
```

Spin up redis inside a docker container (you must have docker installed locally)

```sh
docker run --name my-redis -d -p 6379:6379 redis
```
## Run Locally
```sh
cd server
npm run start
```
in second terminal
```sh
cd worker
npm run dev
```

## Send request via Postman
``` js
type : http
method : GET
endpoint : http://localhost:8080/submit
body :  { "user_id" : "user1", "problem_id" : "p123", "lang" : "c++", "code" : "const x = 5; \n consol.log(x);" }
```
``` js
type : websocket
endpoint : ws://localhost:8080/
header :  user_id - user1
```
