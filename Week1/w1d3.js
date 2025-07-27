// const [a, ,,, b, ...[c, d]] = [1,2,3,4,5,6,7]
// console.log(a)
// console.log(b)
// console.log(c)
// console.log(d)
// console.log([c, d])

// const {a, b} = {a:23, b:21}
// console.log(a)
// console.log(b)

// const obj = {d:1, v:2, c:3}
// const {d,c,v} = obj
// console.log(d)
// console.log(c)
// console.log(v)

// const obj = { a: 1, b: { c: 2 } };
// const {
//   a,
//   b: { c: d },
// } = obj;
// console.log(a)
// console.log(d)

// const [a,b,c] = 'abc'
// console.log(a)
// console.log(b)
// console.log(c)



// A
// const [a, b, ...rest] = [1,2,3,4,5,6]
// console.log(a)
// console.log(b)
// console.log(rest)

// B
// const user = {
//     email: "asadbek09022003@gmail.com",
//     name: "Asad",
//     age: 22
// }
// const {name, email, age, role = "guest"} = user
// console.log(name)
// console.log(age)
// console.log(email)
// console.log(role)

// C
// const arr1 = [1,2,3]
// const arr2 = [4,5,6]
// const arrCombined = [...arr1, ...arr2]
// console.log(arrCombined)

// D
// function sumAll(first, second, ...rest) {
//     let sum = 0
//     sum += first + second
//     for (num of rest) {
//         sum += num
//     }
//     return sum
// }

// console.log(sumAll(1,2,3,4,5))

// E
// function printUser(user) {
//     ({name, email, role='guest'} = user)
//     console.log(name)
//     console.log(email)
// }

// printUser({name: 'Asad', email: 'asdljk@gmail.com'})
// printUser({name: 'Humo', email: 'sdfldzkj@gmail.com'})
// printUser({name: 'Dior', email: 'ddsfgo@gmail.com'})

// F
// function mergeScores (studentA, studentB) {
//     return {
//         name: `${studentA.name} & ${studentB.name}`,
//         scores: [...studentA.scores, ...studentB.scores]
//     }
// }

// console.log(mergeScores({name: 'Asad', scores: [1,2,3]}, {name: 'Humo', scores: [4,5,6]}))

// G
// function extractStreet (obj) {
//     ({address: {street}} = obj)
//     console.log(street)
// }

// extractStreet({address: {street: '1080 E 8th', city: 'Tucson'}})

// H
let obj = {a: 'a', b: 'b', c:'c'}
let objCopy = {...obj}
console.log('obj: ', obj)
console.log('objCopy: ', objCopy)
console.log('====================')
objCopy.a = 'f'
console.log('obj: ', obj)
console.log('objCopy: ', objCopy)