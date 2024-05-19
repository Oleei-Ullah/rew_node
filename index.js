import http from "http";
import handler from "./utils/handleReqRes.js";

const app = {};

app.config = {
  port: 3000,
};

app.createServer = () => {
  const server = http.createServer(handler.handleReqRes);
  server.listen(app.config.port, () => {
    console.log(
      `Sever Created successfully. Running on port: ${app.config.port}`
    );
  });
};


app.createServer();
