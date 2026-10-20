import {createServer} from "http"

function ServerCallserver(request,response){

    console.log("hi")
}

let server = createServer(ServerCallserver);
server.listen(555);