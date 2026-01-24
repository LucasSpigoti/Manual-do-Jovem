const slides = document.querySelectorAll(".slide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progress-bar");

let currentSlideIndex = 0;

function updateSlides() {
    // Remove a classe active de todos
    slides.forEach(slide => slide.classList.remove("active"));
    
    // Adiciona ao slide atual
    slides[currentSlideIndex].classList.add("active");

    // Atualiza a barra de progresso
    const progress = ((currentSlideIndex + 1) / slides.length) * 100;
    progressBar.style.width = `${progress}%`;

    // Gerencia o estado dos botões
    prevBtn.disabled = currentSlideIndex === 0;
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

// Inicializa a página no estado correto
updateSlides();


// Quiz
const questions = [
    { q: "Qual é o principal objetivo da seção “Dados Pessoais” no currículo?", options: ["Mostrar hobbies e interesses pessoais ", "Identificar o candidato e facilitar o contato pelo recrutador", "Apresentar experiências profissionais", "Listar cursos e certificações"], correct: 1 },

    { q: "Qual dessas informações NÃO deve ser incluída no currículo, segundo o slide?", options: ["E-mail profissional", "Telefone atualizado", "CPF e RG", "Nome completo"], correct: 2 },

    { q: "Qual é a forma correta de organizar a Formação Acadêmica no currículo?", options: ["Do mais antigo para o mais recente", "Em ordem alfabética", "Do mais recente para o mais antigo", "Por ordem de importância pessoal"], correct: 2 },


    { q: "Sobre a seção “Conhecimentos em Informática”, o que é recomendado?", options: ["Colocar tudo que já ouviu falar", "Informar apenas o que realmente sabe usar", "Usar termos técnicos difíceis", "Não informar nível de conhecimento"], correct: 1 },

    { q: "Qual é a função principal do LinkedIn, segundo o conteúdo do treinamento?", options: ["Criar currículos com modelos prontos", "Publicar fotos pessoais", "Fazer cursos online gratuitos", "Conectar profissionais, empresas e oportunidades"], correct: 3 }
];

let currentQuestion = 0;
let score = 0;

function startQuiz() {
    document.querySelectorAll('.slide').forEach(s => s.style.display = 'none');
    document.getElementById('quiz-container').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    const qData = questions[currentQuestion];
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
    if(choice === questions[currentQuestion].correct) {
        score++;
        document.getElementById('quiz-feedback').innerText = "Correto! ✅";
        document.getElementById('quiz-feedback').style.color = "#4caf50";
    } else {
        document.getElementById('quiz-feedback').innerText = "Quase lá! ❌";
        document.getElementById('quiz-feedback').style.color = "#ff5252";
    }

    setTimeout(() => {
        currentQuestion++;
        if(currentQuestion < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }, 1000);
}

function showResult() {
    document.getElementById('quiz-container').style.display = 'none';
    const resultDiv = document.getElementById('quiz-result');
    resultDiv.style.display = 'block';
    document.getElementById('score-text').innerText = `Você acertou ${score} de ${questions.length} perguntas!`;
}