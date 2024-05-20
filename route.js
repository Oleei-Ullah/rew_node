import sampleHandler from "./handlers/routeHandlers/sampleHanlder.js"
import userHandler from "./handlers/routeHandlers/userHandler.js";

const routes = {
    sample: sampleHandler,
    users: userHandler.handler
}

export default routes;