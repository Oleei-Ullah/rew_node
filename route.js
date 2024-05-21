import checkHandler from "./handlers/routeHandlers/checkHandler.js";
import tokenHandler from "./handlers/routeHandlers/tokenHandler.js";
import userHandler from "./handlers/routeHandlers/userHandler.js";

const routes = {
    users: userHandler.handler,
    tokens: tokenHandler.handler,
    checks: checkHandler.handler
}

export default routes;