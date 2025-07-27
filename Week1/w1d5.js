// function loadScript(src) {
//     let script = document.createElement('script')
//     script.src = src
//     document.head.append(script)
// }

// loadScript('/Users/asadkhonrasulov/ZIOX_314/TenWeekRoadMap/Week1/myScript.js')


// A
// function takeOrder(item, callback) {
//     setTimeout(() => {
//         let orderDetails = item
//         console.log("Order taken: " + orderDetails)
//         callback(null, orderDetails)
//     }, 2000)
// }

// function cookOrder(order, callback) {
//     setTimeout(() => {
//         let cookedMeal = order
//         console.log("Cooking order: " + cookedMeal)
//         callback(null, cookedMeal)
//     }, 5000)
// }

// function serveOrder(meal, callback) {
//     setTimeout(() => {
//         console.log("Serving the meal: " + meal)
//         callback(null, "Enjoy your meal!")
//     }, 3000)
// }

// takeOrder("Plov", function (err, order) {
//     if (err) return console.error(err)
//     cookOrder(order, function (err, cookedMeal) {
//         if (err) return console.error(err)
//         serveOrder(cookedMeal, function (err, message) {
//             if (err) return console.error(err)
//             console.log(message)
//         })
//     })
// })

// B
function takeOrder(item) {
    let orderDetails = item
    console.log("Order taken: " + orderDetails)
    return new Promise (resolve => {
        setTimeout(() => {
            resolve(orderDetails)
        }, 2000)
    })
    
}

function cookOrder(order) {
    let cookedMeal = order
    console.log("Cooking order: " + cookedMeal)
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(cookedMeal)
        }, 5000)
    })
}

function serveOrder(meal) {
    console.log("Serving the meal: " + meal)
    return new Promise(resolve => {
        setTimeout(() => {
            resolve("Enjoy your meal!")
        }, 3000)
    })   
}

// takeOrder("Plov")
//     .then(order => cookOrder(order))
//     .then(meal => serveOrder(meal))
//     .then(msg => console.log(msg))

// C
// async function processOrder(item) {
//     const order = await takeOrder(item)
//     const meal = await cookOrder(order)
//     const message = await serveOrder(meal)
//     console.log(message)
// }
// processOrder("Plov")