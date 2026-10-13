const commands = [
    {
        name:"sum",
        func:function(input){
            console.log(Number(input[0])+Number(input[1]))
        }
    },
    {
        name:"minus",
        func:function(input){
            console.log(Number(input[0])-Number(input[1]))
        }
    },
    {
        name:"print",
        func:function(input){
            console.log(input)
        }
    },
]

op=process.argv[2];
input=process.argv.slice(3)
found=false
for(i=0;i<commands.length;i++){
    if(commands[i].name==op){
        commands[i].func(input)
        found=true
        break
    }
}

if(!found){
    console.log("Error")
}

