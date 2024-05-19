import http from "http";
import reqResHanlder from "./utils/handleReqRes.js";

const {handleReqRes} = reqResHanlder;

const app = {};

app.config = {
  port: 3000,
};

app.createServer = () => {
  const server = http.createServer(handleReqRes);
  server.listen(app.config.port, () => {
    console.log(
      `Sever Created successfully. Running on port: ${app.config.port}`
    );
  });
};


app.createServer();
