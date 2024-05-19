import http from 'http';
import url from 'url';
import { StringDecoder } from "string_decoder"

const decoder = new StringDecoder('utf8');

const app = {};

app.config = {
    port: 3000
}

app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`Sever Created successfully. Running on port: ${app.config.port}`);
    })
}

app.handleReqRes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const query = parsedUrl.query;

    let parsedData = '';
    req.on('data', (buffer) => {
        parsedData += decoder.write(buffer);
    })

    req.on('end', () => {
        parsedData += decoder.end()
        console.log(parsedData);
        res.end("Hello Programmers")
    })


}

app.createServer();