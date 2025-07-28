// 1 - Type detector
function returnType(value) {
    return `Value '${value}' is a/an ${typeof(value)}`
}
// console.log(returnType(1))
// console.log(returnType('sdf'))
// console.log(returnType(Infinity))
// console.log(returnType(true))


// 2 - Operations handler
function performOp (a, b, op) {
    const result = op(a,b)
    return result
}
let add = (a,b) => a + b
let subtract = (a,b) => a - b
let divide = (a,b) => a / b
let multiply = (a,b) => a * b

// console.log(performOp(3,6,subtract))
// console.log(performOp(3,6,add))
// console.log(performOp(3,6,multiply))
// console.log(performOp(3,6,divide))


// 3 - Merge & Extract User Data
profileA = { name: "Ada",   email: "ada@ex.com" }
profileB = { age: 30,       email: "ada.lovelace@ex.com" }
profileC = { country: "UK", role: "admin" }
mergedProfiles = {...profileA, ...profileB, ...profileC}
// console.log(mergedProfiles)

function extractFields(profiles) {
    let {name, email, role} = profiles
    console.log(name)
    console.log(email)
    console.log(role)
}
// extractFields(mergedProfiles)


// 4 - Analytics on Sales Data
const salesRecords = [
    {amount: 4000, region: 'California'},
    {amount: 6000, region: 'Albania'},
    {amount: 32000, region: 'Ohio'},
    {amount: 65000, region: 'New York'},
    {amount: 12000, region: 'Washington'},
    {amount: 5000, region: 'Italy'},
    {amount: 8000, region: 'France'},
    {amount: 17000, region: 'China'}
]
// filter
let salesAboveTenK = salesRecords.filter(sale => sale.amount >= 10000)
// console.log(salesAboveTenK)

// map
let amountValuesOfAllSales = salesRecords.map(sale => sale.amount)
// console.log(amountValuesOfAllSales)
let amountValuesOfSalesAboveTenK = salesAboveTenK.map(sale => sale.amount)
// console.log(amountValuesOfSalesAboveTenK)

// reduce
let totalSales = salesRecords.reduce((sum, sale) => sum + sale.amount, 0)
// console.log(totalSales)
let totalSalesForAboveTenK = salesAboveTenK.reduce((sum, saleAboveTenK) => sum + saleAboveTenK.amount, 0)
// console.log(totalSalesForAboveTenK)

// for ...of
// for (sale of salesRecords) {
//     console.log(sale)
// }


// 5
// with callback
function loadQuestionWithCallback(callback) {
    setTimeout(() => {
        let questionData = {id: 1, question: "What is 2+2?", choices: ['2', '4', '5']}
        callback(questionData)
    }, 1000)
}

// loadQuestionWithCallback(function(data) {
//     console.log("Question loaded:", data)
// })

// with Promise()
function loadQuestionWithPromise() {
    return new Promise(resolve =>
        setTimeout(() => {
            let questionData = {id: 1, question: "What is 2+2?", choices: ['2', '4', '5']}
            resolve(questionData)
        }, 1000)
    )
}

// Using .then()
// loadQuestionWithPromise()
//     .then(data => {
//         console.log("Promise resolved with data:", data)
//     })

// Using async/await
async function handleQuestion() {
    const data = await loadQuestionWithPromise()
    console.log("Async/await data:", data)
}
// handleQuestion()