import {createServer} from "http"
import { commands } from "./03d-controllers.js";

function ServerCallserver(request,response){
    
    let input = request.url.split("/")

    for(let i=0;i<commands.length;i++){
        if(request.url.startsWith("/"+commands[i].name)){
            commands[i].func(input,response)
            break
        }
    }

}

let server = createServer(ServerCallserver);
server.listen(555);