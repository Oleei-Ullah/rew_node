import tokenHandler from "./handlers/routeHandlers/tokenHandler.js";
import userHandler from "./handlers/routeHandlers/userHandler.js";

const routes = {
    users: userHandler.handler,
    tokens: tokenHandler.handler
}

export default routes;