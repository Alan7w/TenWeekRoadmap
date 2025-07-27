// let array = [1,2,4, 'sdf']
// let obj = {a:3, b:'abs', c: 12, d: 'skjnfd'}

// console.log('using regular for with i variable')
// // using regular for with i variable
// for (let i = 0; i < array.length; i++) {
//     console.log(array[i])
// }

// console.log('using for ...in')
// // using for ...in
// for (num in array) {
//     console.log(num)
// }

// console.log()
// for (element in obj) {
//     console.log(element)
// }

// console.log('using for ...of')
// // using for ...of
// for (item of array) {
//     console.log(item)
// }

// does not work because obj is not iterable and for ...of only works with iterable objects
// console.log()
// for (property of obj) {
//     console.log(property)
// }


// .map()
// let array = [1,2,3,4]
// console.log(array)
// console.log(array.map(num => num * 2))

// let arr = [
//     {key: 1, value: 10},
//     {key: 2, value: 11},
//     {key: 3, value: 12}
// ]
// console.log(arr.map(({key, value}) => ({[key]: value})))

// let arr2 = [1,2,3,4,5]
// const sum = arr2.reduce((accumulator, currentValue) => accumulator + currentValue)
// console.log(sum)
// console.log()

// A
let names = ['asad', 'humo', 'dior', 'fayz']
for (let i = 0; i < names.length; i++) {
    console.log('Name: ', names[i])
}
console.log()

// B
let array = [1,2,3,4]
const squared = array.map(num => num**2)
console.log(squared)
console.log()

// C
let products = [
    {id: 13202492, price: 250, name: 'headset', inStock: true},
    {id: 20392344, price: 750, name: 'GPU', inStock: false},
    {id: 45903093, price: 1500, name: 'PC', inStock: false},
    {id: 95804040, price: 2500, name: 'TV', inStock: true}
]
console.log(products.filter(product => product.price > 1000 & product.inStock))
console.log()

// D
let cart = [
    {price: 100, quantity: 2},
    {price: 200, quantity: 4},
    {price: 300, quantity: 3},
    {price: 400, quantity: 2}
]
let initialValue = 0;
const cost = cart.reduce((sum, item) => sum + (item.price * item.quantity), initialValue)
console.log(cost)
console.log()

// E
const totalCostInStock = products.filter(product => product.inStock).reduce((sum, product) => sum + product.price, 0)
console.log(totalCostInStock)
console.log()

// F
function myMap (array, fn) {
    let arrCopy = []
    for (element of array) {
        element = fn(element)
        arrCopy.push(element)
    }
    console.log(array)
    console.log()
    console.log(arrCopy)
}
myMap([1,2,3,4], (num) => num * 2)
console.log()

// G