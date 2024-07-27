document.addEventListener("DOMContentLoaded", () => {
    const quizForm = document.getElementById('quiz-form');
    const quizzesList = document.getElementById('quizzes');
    let quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];

    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const question = document.getElementById('question').value;
        const option1 = document.getElementById('option1').value;
        const option2 = document.getElementById('option2').value;
        const option3 = document.getElementById('option3').value;
        const option4 = document.getElementById('option4').value;
        const correctOption = document.getElementById('correct-option').value;

        const newQuestion = {
            question,
            options: [option1, option2, option3, option4],
            correctOption: parseInt(correctOption)
        };

        let currentQuiz = { questions: [] };

        if (quizzes.length > 0) {
            currentQuiz = quizzes[quizzes.length - 1];
        }

        currentQuiz.questions.push(newQuestion);

        if (quizzes.length === 0 || quizzes[quizzes.length - 1].questions.length === 0) {
            quizzes.push(currentQuiz);
        } else {
            quizzes[quizzes.length - 1] = currentQuiz;
        }

        localStorage.setItem('quizzes', JSON.stringify(quizzes));
        updateQuizzesList();
        quizForm.reset();
    });

    function updateQuizzesList() {
        quizzesList.innerHTML = '';
        quizzes.forEach((quiz, index) => {
            const li = document.createElement('li');
            li.textContent = `Quiz ${index + 1}`;
            li.addEventListener('click', () => {
                window.location.href = `take-quiz.html?quizIndex=${index}`;
            });
            quizzesList.appendChild(li);
        });
    }

    updateQuizzesList();
});

function loadQuiz() {
    const quizIndex = new URLSearchParams(window.location.search).get('quizIndex');
    const quizzes = JSON.parse(localStorage.getItem('quizzes'));
    const currentQuiz = quizzes[quizIndex];
    const quizContainer = document.getElementById('quiz-container');
    const submitQuizButton = document.getElementById('submit-quiz');
    let currentQuestionIndex = 0;
    let score = 0;

    function showQuestion(questionIndex) {
        const question = currentQuiz.questions[questionIndex];
        quizContainer.innerHTML = `
            <div>
                <h3>${question.question}</h3>
                <ul>
                    ${question.options.map((option, index) => `<li><label><input type="radio" name="option" value="${index + 1}"> ${option}</label></li>`).join('')}
                </ul>
            </div>
        `;
    }

    submitQuizButton.addEventListener('click', () => {
        const selectedOption = document.querySelector('input[name="option"]:checked');
        if (selectedOption) {
            const answer = parseInt(selectedOption.value);
            if (answer === currentQuiz.questions[currentQuestionIndex].correctOption) {
                score++;
            }
            currentQuestionIndex++;
            if (currentQuestionIndex < currentQuiz.questions.length) {
                showQuestion(currentQuestionIndex);
            } else {
                displayResults();
            }
        }
    });

    function displayResults() {
        quizContainer.style.display = 'none';
        submitQuizButton.style.display = 'none';
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = `
            <div>
                <h2>Your Score: ${score}/${currentQuiz.questions.length}</h2>
                ${currentQuiz.questions.map((question, index) => `
                    <div>
                        <h3>${index + 1}. ${question.question}</h3>
                        <p>Correct Answer: ${question.options[question.correctOption - 1]}</p>
                    </div>
                `).join('')}
            </div>
        `;
        resultsContainer.style.display = 'block';
    }

    showQuestion(currentQuestionIndex);
    submitQuizButton.style.display = 'block';
}

if (window.location.pathname.includes('take-quiz.html')) {
    loadQuiz();
}