const calculator={
    '+': (num1,num2) => num1+num2,
    '-':(num1,num2) => num1-num2,
    '*': (num1,num2) => num1*num2,
    '/':(num1,num2) => num1/num2,
};

let op=process.argv[3]
let num1=Number(process.argv[2])
let num2=Number(process.argv[4])

if(calculator[op]){
    console.log(calculator[op](num1,num2))
}
else{
    console.log("Error")
}