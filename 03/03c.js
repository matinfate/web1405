import {createServer} from "http"

function ServerCallserver(request,response){

    let numbers = request.url.split("/")
    response.writeHead(200);
    let sum = Number(numbers[1])+Number(numbers[2])
    response.write(String(sum));
    response.end();
}

let server = createServer(ServerCallserver);
server.listen(555);