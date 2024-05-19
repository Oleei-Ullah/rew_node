import http from "http";
import reqResHanlder from "./helpers/handleReqRes.js";
import usedEnvironment from "./helpers/environments.js";

const {handleReqRes} = reqResHanlder;

const app = {};

app.createServer = () => {
  const server = http.createServer(handleReqRes);
  server.listen(usedEnvironment.port, () => {
    console.log(
      `Sever Created successfully. Running on port: ${usedEnvironment.port}`
    );
  });
};


app.createServer();
