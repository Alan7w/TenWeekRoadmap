let questions = [
    {questionText: "1. What is the capital of France?", choices: ['Italy', 'Paris', 'Vancouver'], correctChoice: 'Paris'},
    {questionText: "2. What is 3 * 4 + 7 - 4 * 5?", choices: ['1', '0', '-1',], correctChoice: '-1'},
    {questionText: "3. Which planet is known as the Red Planet?", choices: ['Mars', 'Jupiter', 'Mercury'], correctChoice: 'Mars'},
    {questionText: "4. What is the chemical symbol for water?", choices: ['H2O', 'CH4', 'CO2'], correctChoice: 'H2O'},
    {questionText: "5. Which animal is commonly called man's best friend?", choices: ['Cat', 'Horse', 'Dog'], correctChoice: 'Dog'}
]

var score = 0

function manageQuiz(index) {
    var choices = document.getElementsByTagName('input')
    if (index < 5) {
        let question = questions[index]
        checkAnswerUpdateScore(choices, index)
        for (var i = 0; i < choices.length; i++) {
            choices[i].checked = false
            toggleNextButton(true)
            choices[i].nextSibling.textContent = question.choices[i]
        }
        let currentQuestion = document.getElementsByTagName('p')[0]
        currentQuestion.innerText = question.questionText
        currentQuestion.id = index
    } else {
        checkAnswerUpdateScore(choices, index)
        let scoreLabel = document.getElementById("score")
        scoreLabel.textContent += `${score}`
        scoreLabel.style.display = "block"
    }
}

function checkAnswerUpdateScore (choices, index) {
    for (var i = 0; i < choices.length; i++) {
        if (choices[i].checked == true && choices[i].nextSibling.textContent == questions[index-1].correctChoice) {
            score++
        }
    }
}

function toggleNextButton(boolean) {
    document.getElementById("nextButton").disabled = boolean
}