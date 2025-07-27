let a = '1qa'
var num = true
const pi = 3.14
const b = null
var inf = Infinity

// console.log(a, typeof a)
// console.log(num, typeof num)
// console.log(pi, typeof pi)
// console.log(b, typeof b)
// console.log(inf, typeof inf)
// console.log("5" + 5, typeof ('5' + 5))
// console.log("3" * 2, typeof ('3' * 2))
// console.log('asln' + 1, typeof ('asln' + 1))
// console.log('gntj' + true, typeof ('gntj' + true))
// console.log('gntj' * true, typeof ('gntj' * true))
// console.log('gntj' * 2, typeof ('gntj' * 2))
// console.log("gntj" + ("Q"* 2), typeof ('gntj' * 2))

// a = '1sdf'
// console.log(a[2], typeof a[2])
// a[0] = 'f'
// console.log(a, typeof a)
// b = true 
// console.log(num, typeof num)

{
    // let g = false
    // const f = true
    var h = null
}
function convertToFarenheit(degreInCelcius) {
    // var dump
    // console.log(g)
    // console.log(f)
    console.log(h)

    let factor = 9/5
    const add32 = 32
    return (degreInCelcius * factor) + add32
}

// console.log(factor)  // error: factor not defined
// console.log(add32)   // error as well
// console.log(convertToFarenheit(36))
// console.log(convertToFarenheit(20))
// console.log(convertToFarenheit(1))


function guessTheNumber() {
    let input = prompt("Guess a number: ")
    console.log(input)
}

guessTheNumber()