import express from 'express';

const app = express();
const defaultPort = 4000;
app.set('port', defaultPort);


var http = require("http").Server(app);

// simple '/' endpoint sending a Hello World
// response
app.get("/", (req: any, res: any) => {
    res.send("hello world");
});

// start our simple server up on localhost:3000
const server = http.listen(defaultPort, () =>
    console.log(`listening on ${defaultPort}`)
);