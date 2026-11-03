import { createServer } from "http"

function framework() {

    let controllers = []

    let app = {
        get: function (path, func) {
            controllers.push({
                name: path,
                func: func
            })
        },
        listen: function (port, callback) {
            function ServerCallserver(request, response) {

                let data = ""
                request.on("data", function (x) {
                    data += x.toString()

                })
                request.on("end", function () {
                    console.log(data)
                    request.data = data.toString()
                    let found = false
                    for (let i of controllers) {
                        if (request.url.startsWith("/" + i.name)) {
                            i.func(request, response)
                            found = true
                            break
                        }
                    }

                    if (!found) {
                        console.log("Error:" + request.url)
                        response.writeHead(404)
                        response.end("command not found")
                    }
                })


            }

            let server = createServer(ServerCallserver);
            server.listen(port, callback);
        }
    }

    return app
}

export default framework