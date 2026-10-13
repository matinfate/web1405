function print(input){
    console.log("Username: "+input[0]+" Email: "+input[1]+" Age: "+input[2])
}

let op = process.argv[2]
let input=process.argv.slice(3)

if(op=="print"){
    print(input)
}
else{
    console.log("Error")
}