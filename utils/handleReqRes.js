import { StringDecoder } from "string_decoder";
import url from "url";
import routes from "../route.js";
import notFoundHandler from "../handlers/routeHandlers/notFoundHandler.js";

const handler = {};

handler.handleReqRes = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const query = parsedUrl.query;

  const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;
  console.log(chosenHandler);

  const decoder = new StringDecoder("utf8");

  let parsedData = "";
  req.on("data", (buffer) => {
    parsedData += decoder.write(buffer);
  });

  req.on("end", () => {
    parsedData += decoder.end();
    console.log(parsedData);
    res.end("Hello Programmers");
  });
};

export default handler;
