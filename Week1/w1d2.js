const readline = require('readline')
const prompt = require('prompt-sync')()

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// })

function testIfParamChanges(param) {
    param = 5
}

num = 6
testIfParamChanges(num)
// console.log(num)

// tradional vs arrows
// function add(a, b) {return a+b}
// console.log(add(3, 2))
// const subtract = function (a,b) {return a-b}
// console.log(subtract(3, 2))
// const multiply = (a,b) => a*b
// console.log(multiply(3, 2))


// Dynamic calculator
const add = (a, b) => a + b
const subtract = (a, b) => a - b
const divide = (a, b) => a / b
const multiply = (a, b) => a * b
const calculate = (a, b, op) => {
    if (isNaN(a) || isNaN(b)) {
        console.log("Inputs must be numbers")
        return
    } else {
        console.log('here')
        return op(a, b)
    }
}

console.log(calculate(6,3,add))
console.log(calculate(6,3,subtract))
console.log(calculate(6,3,divide))
console.log(calculate(6,3,multiply))

// let input = prompt("Enter:")
// console.log(input)


// Prompt calculator
function promptCalculator() {
    let firstNumber
    let secondNumber
    let operation
    rl.question("Enter the first number: ", (input) => {
        firstNumber = +input
        console.log(firstNumber)
        rl.question("Enter the second number: ", (input) => {
            secondNumber = +input
            console.log(secondNumber)
            rl.question("Enter operation type: ", (input) => {
                operation = input
                if (operation == '+') {
                    console.log(calculate(firstNumber, secondNumber, add))
                } else if (operation == '-') {
                    console.log(calculate(firstNumber, secondNumber, subtract))
                } else if (operation == '/') {
                    console.log(calculate(firstNumber, secondNumber, divide))
                } else if (operation == '*') {
                    console.log(calculate(firstNumber, secondNumber, multiply))
                }
                rl.close()
            })
        })
    })
}

// promptCalculator()


// greetUser
const greetUser = (name = "Guest") => console.log('Hello, ' + name)
// console.log(greetUser("Asad"))
// console.log(greetUser())


// rest parameters
function sumAll(...nums) {
    let sum = 0
    for (num of nums) {
        sum += num
    }
    return sum
}

// console.log(sumAll(1,3,4,5))