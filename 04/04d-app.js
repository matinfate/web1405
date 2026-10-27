import framework from "./04d-framework.js";

const app = framework()
const port = 8000

app.get('sum',function(request,response){
            let items = request
            response.writeHead(200);
            let output = Number(items[2])+Number(items[3])
            response.write(String(output));
            response.end();      
})

app.get('minus',function(request,response){
            let items = request
            response.writeHead(200);
            let output = Number(items[2])-Number(items[3])
            response.write(String(output));
            response.end();      
        })

app.get('print',function(request,response){
            response.writeHead(200);
            response.write(String(request));
            response.end();      
        })


app.listen(port, () => {
    console.log("Hello world")
})