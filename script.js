const slides = document.querySelectorAll(".slide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progress-bar");
const navBar = document.querySelector(".navigation");

let currentSlideIndex = 0;

function updateSlides() {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[currentSlideIndex].classList.add("active");

    // Progresso baseado no total de slides
    const progress = ((currentSlideIndex + 1) / slides.length) * 100;
    progressBar.style.width = `${progress}%`;

    prevBtn.disabled = currentSlideIndex === 0;
    // Desativa o "Próximo" no slide do botão do Quiz
    nextBtn.disabled = currentSlideIndex === slides.length - 1; 
}

nextBtn.addEventListener("click", () => {
    if (currentSlideIndex < slides.length - 1) {
        currentSlideIndex++;
        updateSlides();
    }
});

prevBtn.addEventListener("click", () => {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        updateSlides();
    }
});

updateSlides();

// --- LÓGICA DO QUIZ (DINÂMICA) ---

let currentQuestion = 0;
let score = 0;

function startQuiz() {
    // Esconde a navegação e a barra de progresso para focar no quiz
    navBar.style.display = "none";
    document.querySelector(".progress-container").style.display = "none";
    
    // Esconde todos os slides e mostra o container do quiz
    document.querySelectorAll('.slide').forEach(s => s.style.display = 'none');
    document.getElementById('quiz-container').style.display = 'block';
    
    showQuestion();
}

function showQuestion() {
    // IMPORTANTE: Ele tenta usar 'meuQuiz' (do HTML), se não existir, usa 'questions' (do JS)
    const listaPerguntas = typeof meuQuiz !== 'undefined' ? meuQuiz : questions;
    const qData = listaPerguntas[currentQuestion];
    
    document.getElementById('quiz-question').innerText = qData.q;
    const optionsDiv = document.getElementById('quiz-options');
    optionsDiv.innerHTML = '';
    document.getElementById('quiz-feedback').innerText = '';

    qData.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'option-btn';
        btn.onclick = () => checkAnswer(index);
        optionsDiv.appendChild(btn);
    });
}

function checkAnswer(choice) {
    const listaPerguntas = typeof meuQuiz !== 'undefined' ? meuQuiz : questions;
    
    if(choice === listaPerguntas[currentQuestion].correct) {
        score++;
        document.getElementById('quiz-feedback').innerText = "Correto! ✅";
        document.getElementById('quiz-feedback').style.color = "#00e5ff";
    } else {
        document.getElementById('quiz-feedback').innerText = "Incorreto! ❌";
        document.getElementById('quiz-feedback').style.color = "#ff5252";
    }

    setTimeout(() => {
        currentQuestion++;
        if(currentQuestion < listaPerguntas.length) {
            showQuestion();
        } else {
            showResult();
        }
    }, 1000);
}

function showResult() {
    const listaPerguntas = typeof meuQuiz !== 'undefined' ? meuQuiz : questions;
    document.getElementById('quiz-container').style.display = 'none';
    const resultDiv = document.getElementById('quiz-result');
    resultDiv.style.display = 'block';
    document.getElementById('score-text').innerText = `Você acertou ${score} de ${listaPerguntas.length} perguntas!`;
}
