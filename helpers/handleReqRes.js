import { StringDecoder } from "string_decoder";
import url from "url";
import notFoundHandler from "../handlers/routeHandlers/notFoundHandler.js";
import routes from "../route.js";
import lib from "../lib/data.js";

const handler = {};

// lib.create('test', 'newfile', {name: 'abdullah', age: 20}, (err) => {
//   console.log(err);
// })

// lib.read('test', 'newfile', (err, data) => {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log(data);
//   }
// })


// lib.update('test', 'newfile', {name: 'John Carter', profession: 'employee'}, (err) => {
//   console.log(err);
// })


// lib.delete('test', 'newfile', (err) => {
//     console.log(err);
// })
handler.handleReqRes = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const query = parsedUrl.query;
  const headerObject = req.headers;
  const method = req.method.toLowerCase();

  let parsedData = "";
  const decoder = new StringDecoder("utf8");

  const requestProperties = {
    parsedUrl,
    path,
    trimmedPath,
    query,
    headerObject,
    method
  };

  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  req.on("data", (buffer) => {
    parsedData += decoder.write(buffer);
  });

  req.on("end", () => {
    parsedData += decoder.end();

    chosenHandler(requestProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payload = typeof payload === "object" ? payload : {};

      res.setHeader('Content-type', 'application/json')
      res.writeHead(statusCode);
      res.end(JSON.stringify(payload));
    });
  });
};

export default handler;
