const quizData = [
    {
        question: "The measures taken to prevent fire or minimize the loss of life or property resulting from a fire, including limiting fire loads and hazards, confining the spread of fire, and training building occupants in evacuation procedures.",
        answer: "Fire Safety"
    },
    {
    question: "Any condition that increases the likelihood of a fire, obstructs access to firefighting equipment, or delays the egress of occupants in the event of fire.",
    answer: "Fire Hazard"
    },
    {
    question: "The amount of combustible material in a building, measured in pounds per square foot of floor area.",
    answer: "Fire Load"
    },
    {
    question: "Of or pertaining to a material capable of igniting and burning.",
    answer: "Combustible"
    },
    {
    question: "Noting or pertaining to a material, assembly, or construction having a fire-resistance rating required by its use. Also, fire-resistive.",
    answer: "Fire-Rated"
    },
    {
    question: "The time in hours a material or assembly can be expected to withstand exposure to fire without collapsing or developing openings that permit passage of flame or hot gases.",
    answer: "Fire-Resistance Rating"
    },
    {
    question: "The lowest temperature at which a substance will undergo spontaneous combustion and continue to burn without additional application of external heat.",
    answer: "Ignition Point"
    },
    {
    question: "The lowest temperature at which a combustible liquid will give off sufficient vapor to ignite momentarily when exposed to flame.",
    answer: "Flash Point"
    },
    {
    question: "A test measuring the time it takes for a controlled flame to spread across the face of a test specimen, the amount of fuel the material contributes to the fire, and the density of smoke developed by the fire.",
    answer: "Tunnel Test"
    },
    {
    question: "A rating of how quickly a fire can spread along the surface of an interior finish material.",
    answer: "Flame-Spread Rating"
    },
    {
    question: "A rating of the amount of combustible substances an interior finish material can contribute to a fire.",
    answer: "Fuel-Contribution Rating"
    },
    {
    question: "A rating of the amount of smoke an interior finish material can produce when it burns. Materials having this rating above 450 are not permitted inside buildings.",
    answer: "Smoke-Developed Rating"
    },
    {
    question: "A compound used to raise the ignition point of a flammable material, thus making it more resistant to fire.",
    answer: "Flame Retardant"
    },
    {
    question: "Any of various materials, such as concrete, lath and plaster, or gypsum board, used in making a building material, member, or system resistant to damage or destruction by fire.",
    answer: "Fireproofing"
    },
    {
    question: "A mixture of mineral fibers and an inorganic binder, applied by air pressure with a spray gun to provide a thermal barrier to the heat of a fire.",
    answer: "Spray-On Fireproofing"
    },
    {
    question: "A coating that, when exposed to the heat of a fire, swells to form a thick insulating layer of inert gas bubbles that retards flame spread and combustion.",
    answer: "Intumescent Paint"
    },
    {
    question: "A hollow structural-steel column filled with water to increase its fire resistance. If exposed to flame, the water absorbs heat and circulates to remove it.",
    answer: "Liquid-Filled Column"
    },
    {
    question: "Any floor, wall, or roof-ceiling construction having the required fire-resistance rating to confine the spread of fire.",
    answer: "Fire Separation"
    },
    {
    question: "A vertical or horizontal construction having the required fire-resistance rating to prevent the spread of fire from one occupancy to another in a mixed-occupancy building.",
    answer: "Occupancy Separation"
    },
    {
    question: "The separation required between an exterior wall of a building and a property line, public space, or adjacent building, measured at right angles to the exterior wall.",
    answer: "Distance Separation"
    },
    {
    question: "An area of a building enclosed by fire-rated construction capable of confining the spread of fire.",
    answer: "Fire Area"
    },
    {
        question: "A wall having the required fire-resistance rating to prevent the spread of fire from one part of a building to another, extending from the foundation to a parapet above the roof.",
        answer: "Fire Wall"
    }
];


let quizOrder = [];
let currentAnswers = [];
let currentQuestion = 0;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createQuiz() {
    // If quizOrder is not set, initialize and shuffle
    if (!quizOrder.length) {
        quizOrder = Array.from({length: quizData.length}, (_, i) => i);
        shuffleArray(quizOrder);
    }
    if (!currentAnswers.length || currentAnswers.length !== quizData.length) {
        currentAnswers = new Array(quizData.length).fill("");
    }
    const quizContainer = document.getElementById('quiz');
    quizContainer.innerHTML = '';

    quizOrder.forEach((qIdx, index) => {
        const question = quizData[qIdx];
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-container';
        if (index === 0) questionDiv.classList.add('active');

        questionDiv.innerHTML = `
            <div class="question">${index + 1}. ${question.question}</div>
            <div class="identification-input" style="display:flex;gap:8px;align-items:center;">
                <input type="text" id="input-${index}" data-q="${index}" autocomplete="off" placeholder="Type your answer..." value="${currentAnswers[index] || ''}" oninput="handleInput(${index})" />
                <button type="button" class="send-btn" id="send-${index}" onclick="sendAnswer(${index})" aria-label="Send answer" style="background:none;border:none;cursor:pointer;padding:0 6px;display:flex;align-items:center;">
                  <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' fill='none' viewBox='0 0 24 24'><path fill='var(--accent)' d='M2.01 21 23 12 2.01 3 2 10l15 2-15 2z'/></svg>
                </button>
            </div>
            <div class="feedback" id="feedback-${index}" aria-live="polite"></div>
        `;
        quizContainer.appendChild(questionDiv);
    });
    // Restore any previous answers (when resetting or revisiting)
    quizOrder.forEach((qIdx, index) => {
        if (currentAnswers[index] && currentAnswers[index] !== "") {
            const input = document.getElementById(`input-${index}`);
            if (input) input.value = currentAnswers[index];
        }
    });
    // Hide score page if visible
    const scorePage = document.getElementById('scorePage');
    if (scorePage) scorePage.style.display = 'none';
    updateNavigation();
}

// For identification: handle input and update answer
function handleInput(questionIndex) {
    const input = document.getElementById(`input-${questionIndex}`);
    currentAnswers[questionIndex] = input.value;
    // Remove feedback and enable input until send is pressed
    const feedbackEl = document.getElementById(`feedback-${questionIndex}`);
    feedbackEl.textContent = '';
    input.classList.remove('correct', 'wrong');
    updateNavigation();
}

function sendAnswer(questionIndex) {
    const input = document.getElementById(`input-${questionIndex}`);
    const feedbackEl = document.getElementById(`feedback-${questionIndex}`);
    const qIdx = quizOrder[questionIndex];
    const userAnswer = input.value.trim().toLowerCase();
    const correctAnswer = quizData[qIdx].answer.trim().toLowerCase();
        // Accept alternate answer for LIQUID-FILLED COLUMN
        let isCorrect = false;
        if (correctAnswer === 'liquid-filled column') {
            if (userAnswer === 'liquid filled column') {
                isCorrect = true;
            }
        }
        // Accept alternate answers for SMOKE-DEVELOPED RATING
        if (correctAnswer === 'smoke-developed rating') {
            if (userAnswer === 'smoke developed rating') {
                isCorrect = true;
            }
        }
        // Accept alternate answers for FIRE-RATED
        if (correctAnswer === 'fire-rated') {
            if (userAnswer === 'fire rated') {
                isCorrect = true;
            }
        }
        // Accept alternate answers for FIRE-RESISTANCE RATING
        if (correctAnswer === 'fire-resistance rating') {
            if (userAnswer === 'fire resistance rating') {
                isCorrect = true;
            }
        }
        // Accept alternate answers for FLAME-SPREAD RATING
        if (correctAnswer === 'flame-spread rating') {
            if (userAnswer === 'flame spread rating') {
                isCorrect = true;
            }
        }
        // Accept alternate answers for FUEL-CONTRIBUTION RATING 
        if (correctAnswer === 'fuel-contribution rating') {
            if (userAnswer === 'fuel contribution rating') {
                isCorrect = true;
            }
        }
            // Accept alternate answers for SPRAY-ON FIREPROOFING
            if (correctAnswer === 'spray-on fireproofing') {
                if (userAnswer === 'spray on fireproofing' || userAnswer === 'spray on fire proofing') {
                    isCorrect = true;
                }
            }
            // Accept alternate answers for SPRAY-ON FIREPROOFING
            if (correctAnswer === 'spray-on fireproofing') {
                if (userAnswer === 'spray on fireproofing' || userAnswer === 'spray on fire proofing') {
                    isCorrect = true;
                }
            }
            // Accept alternate answers for FIREPROOFING 
            if (correctAnswer === 'fireproofing') {
                if (userAnswer === 'fire proofing') {
                    isCorrect = true;
                }
            }
    if (userAnswer !== "") {
        input.disabled = true;
            if (userAnswer === correctAnswer || userAnswer.replace(/\s+/g, " ") === correctAnswer.replace(/\s+/g, " ") || isCorrect) {
                feedbackEl.textContent = 'Correct!';
                feedbackEl.style.color = '#2e7d32';
                input.classList.add('correct');
            } else {
                feedbackEl.textContent = `Incorrect. Correct answer: ${quizData[qIdx].answer}`;
                feedbackEl.style.color = '#c62828';
                input.classList.add('wrong');
            }
        setTimeout(() => {
            if (questionIndex < quizData.length - 1) {
                const questions = document.querySelectorAll('.question-container');
                questions[questionIndex].classList.remove('active');
                currentQuestion = questionIndex + 1;
                questions[currentQuestion].classList.add('active');
                updateNavigation();
                // Focus the next input if not already answered
                const nextInput = document.getElementById(`input-${currentQuestion}`);
                if (nextInput && !nextInput.disabled) nextInput.focus();
            }
        }, 500);
    } else {
        feedbackEl.textContent = '';
    }
    updateNavigation();
}

function checkAnswers() {
    let score = 0;
    const questions = document.querySelectorAll('.question-container');

    questions.forEach((question, index) => {
        const input = question.querySelector('input[type="text"]');
        const userAnswer = (input ? input.value.trim().toLowerCase() : "");
        const qIdx = quizOrder[index];
        const correctAnswer = quizData[qIdx].answer.trim().toLowerCase();
            // Accept alternate answer for LIQUID-FILLED COLUMN
            let isCorrect = false;
            if (correctAnswer === 'liquid-filled column') {
                if (userAnswer === 'liquid filled column') {
                    isCorrect = true;
                }
            }
            // Accept alternate answers for SMOKE-DEVELOPED RATING
            if (correctAnswer === 'smoke-developed rating') {
                if (userAnswer === 'smoke developed rating') {
                    isCorrect = true;
                }
            }
            // Accept alternate answers for FIRE-RATED
            if (correctAnswer === 'fire-rated') {
                if (userAnswer === 'fire rated') {
                    isCorrect = true;
                }
            }
            // Accept alternate answers for FIRE-RESISTANCE RATING
            if (correctAnswer === 'fire-resistance rating') {
                if (userAnswer === 'fire resistance rating') {
                    isCorrect = true;
                }
            }
            // Accept alternate answers for FLAME-SPREAD RATING
            if (correctAnswer === 'flame-spread rating') {
                if (userAnswer === 'flame spread rating') {
                    isCorrect = true;
                }
            }
            // Accept alternate answers for SPRAY-ON FIREPROOFING 
            if (correctAnswer === 'spray-on fireproofing') {
                if (userAnswer === 'spray on fireproofing') {
                    isCorrect = true;
                }
            }
            // Accept alternate answers for FIREPROOFING 
            if (correctAnswer === 'fireproofing') {
                if (userAnswer === 'fire proofing') {
                    isCorrect = true;
                }
            }
        input.disabled = true;
        const feedbackEl = document.getElementById(`feedback-${index}`);
            if (userAnswer === correctAnswer || userAnswer.replace(/\s+/g, " ") === correctAnswer.replace(/\s+/g, " ") || isCorrect) {
                score++;
                feedbackEl.textContent = 'Correct!';
                feedbackEl.style.color = '#2e7d32';
            } else {
                feedbackEl.textContent = `Incorrect. Correct answer: ${quizData[qIdx].answer}`;
                feedbackEl.style.color = '#c62828';
            }
    });

    // Hide all questions
    questions.forEach(q => q.style.display = 'none');

    // Show score page
    let scorePage = document.getElementById('scorePage');
    if (!scorePage) {
        scorePage = document.createElement('div');
        scorePage.id = 'scorePage';
        scorePage.className = 'score-page';
        document.getElementById('quiz').appendChild(scorePage);
    }
    scorePage.style.display = 'flex';

    const percentage = (score / quizData.length) * 100;
    scorePage.style.backgroundColor = percentage >= 70 ? '#c8e6c9' : '#ffcdd2';
    let extraMsg = '';
    if (percentage === 100) {
        extraMsg = 'iloveyoumoree baby koo galing galing talaga';
    } else if (percentage > 80) {
        extraMsg = 'kunti nalang ma perfect mo po yan baby ko';
    } else if (percentage >= 75) {
        extraMsg = 'galing naman ng baby kooo';
    } else if (percentage >= 50) {
        extraMsg = 'kaya mo yan baby';
    }
    scorePage.innerHTML = `<div style="font-weight:700;font-size:1.2rem;margin-bottom:8px;">Your score: ${score}/${quizData.length} (${percentage.toFixed(2)}%)</div>`
        + (extraMsg ? `<div class="encouragement">${extraMsg}</div>` : '')
        + `<button class="retry-btn" onclick="resetQuiz()" style="margin-top:18px;display:inline-block;">Try Again</button>`;

    // Hide navigation
    document.querySelector('.submit-btn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('prevBtn').style.display = 'none';
}

function nextQuestion() {
    if (currentQuestion < quizData.length - 1) {
        const questions = document.querySelectorAll('.question-container');
        questions[currentQuestion].classList.remove('active');
        currentQuestion++;
        questions[currentQuestion].classList.add('active');
        updateNavigation();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        const questions = document.querySelectorAll('.question-container');
        questions[currentQuestion].classList.remove('active');
        currentQuestion--;
        questions[currentQuestion].classList.add('active');
        updateNavigation();
    }
}


function updateNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.querySelector('.submit-btn');
    const counter = document.getElementById('questionCounter');
    const progress = document.getElementById('progress');

    prevBtn.disabled = currentQuestion === 0;

    // Only show submit button on last question and if answered
    const answered = currentAnswers[currentQuestion] && currentAnswers[currentQuestion].trim() !== "";
    if (currentQuestion === quizData.length - 1) {
        submitBtn.style.display = 'block';
        submitBtn.disabled = !answered;
    } else {
        submitBtn.style.display = 'none';
    }

    counter.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
    progress.style.width = `${((currentQuestion + 1) / quizData.length) * 100}%`;
    // Hide next button if present
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.style.display = 'none';
    prevBtn.style.display = 'block';
}

function resetQuiz() {
    // Shuffle question order for new try
    quizOrder = Array.from({length: quizData.length}, (_, i) => i);
    shuffleArray(quizOrder);
    currentAnswers = new Array(quizData.length).fill("");
    currentQuestion = 0;
    const quizContainer = document.getElementById('quiz');
    quizContainer.innerHTML = '';
    createQuiz();

    // Hide score page if present
    const scorePage = document.getElementById('scorePage');
    if (scorePage) scorePage.style.display = 'none';

    document.querySelector('.submit-btn').style.display = 'none';
    // Hide all retry buttons except the one on score page
    document.querySelectorAll('.retry-btn').forEach(btn => btn.style.display = 'none');
    document.getElementById('nextBtn').style.display = 'block';
    document.getElementById('prevBtn').style.display = 'block';
    updateNavigation();
}

// Initialize the quiz when the page loads
window.onload = function() {
    quizOrder = Array.from({length: quizData.length}, (_, i) => i);
    shuffleArray(quizOrder);
    currentAnswers = new Array(quizData.length).fill("");
    createQuiz();
};
