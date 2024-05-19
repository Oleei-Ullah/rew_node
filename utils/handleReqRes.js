import { StringDecoder } from "string_decoder";
import url from "url";
import notFoundHandler from "../handlers/routeHandlers/notFoundHandler.js";
import routes from "../route.js";

const handler = {};

handler.handleReqRes = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const query = parsedUrl.query;
  const headers = req.headers;

  let parsedData = "";
  const decoder = new StringDecoder("utf8");

  const requestProperties = {
    parsedUrl,
    path,
    trimmedPath,
    query,
    headers
  }

  const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

  chosenHandler(requestProperties, (statusCode, payload) => {
    statusCode = typeof(statusCode) === 'number' ? statusCode : 500;
    payload = typeof(payload) === 'object' ? payload : {}

    res.writeHead(statusCode);
    res.end(JSON.stringify(payload));
  })

  req.on("data", (buffer) => {
    parsedData += decoder.write(buffer);
  });

  req.on("end", () => {
    parsedData += decoder.end();
    res.end("Hello Programmers");
  });
};

export default handler;
