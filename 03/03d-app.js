import {createServer} from "http"
import { commands } from "./03d-controllers.js";

function ServerCallserver(request,response){
    
    let input = request.url.split("/")
    let found = false
    for(let i=0;i<commands.length;i++){
        if(request.url.startsWith("/"+commands[i].name)){
            commands[i].func(input,response)
            found = true
            break
        }
    }

    if(!found){
        console.log("Error:"+ request.url)
        response.writeHead(404)
        response.end("command not found")
    }

}

let server = createServer(ServerCallserver);
server.listen(555);