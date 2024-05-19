import { StringDecoder } from "string_decoder";
import url from "url";

const handler = {};

handler.handleReqRes = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const query = parsedUrl.query;

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
