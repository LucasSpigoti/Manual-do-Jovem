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

function showResult() {
    const listaPerguntas = typeof meuQuiz !== 'undefined' ? meuQuiz : questions;
    document.getElementById('quiz-container').style.display = 'none';
    const resultDiv = document.getElementById('quiz-result');
    resultDiv.style.display = 'block';
    document.getElementById('score-text').innerText = `Você acertou ${score} de ${listaPerguntas.length} perguntas!`;

    // Se o usuário acertou mais de 70%, libera o certificado
    if (score >= (listaPerguntas.length * 0.7)) {
        document.getElementById('certificate-area').style.display = 'block';
    }
}

function generateCertificate() {
    const name = document.getElementById('user-name').value;
    if (!name) return alert("Por favor, digite seu nome!");

    const canvas = document.getElementById('certificate-canvas');
    const ctx = canvas.getContext('2d');

    // 1. Fundo do Certificado
    ctx.fillStyle = '#0a0a0a'; // Preto profundo
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 2. Borda Neon
    ctx.strokeStyle = '#00bcd4';
    ctx.lineWidth = 20;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // 3. Textos
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    
    ctx.font = '30px Segoe UI';
    ctx.fillText('CERTIFICADO DE CONCLUSÃO', canvas.width / 2, 150);

    ctx.font = '20px Segoe UI';
    ctx.fillStyle = '#00bcd4';
    ctx.fillText('Certificamos que', canvas.width / 2, 220);

    ctx.font = 'bold 45px Segoe UI';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(name.toUpperCase(), canvas.width / 2, 300);

    ctx.font = '20px Segoe UI';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('concluiu com êxito o treinamento de', canvas.width / 2, 380);

    ctx.font = 'bold 25px Segoe UI';
    ctx.fillStyle = '#00e5ff';
    ctx.fillText('MERCADO DE TRABALHO E CURRÍCULO', canvas.width / 2, 430);

    ctx.font = '15px Segoe UI';
    ctx.fillStyle = '#888';
    ctx.fillText('Gerado pelo Manual do Jovem - ' + new Date().toLocaleDateString(), canvas.width / 2, 530);

    // Mostrar prévia e botão de download
    const dataUrl = canvas.toDataURL('image/png');
    document.getElementById('preview-container').innerHTML = `<img src="${dataUrl}" style="width:100%; max-width:400px; margin-top:20px; border:1px solid #333;">`;
    document.getElementById('download-btn').style.display = 'inline-block';
}

function downloadCertificate() {
    const canvas = document.getElementById('certificate-canvas');
    const link = document.createElement('a');
    link.download = 'meu-certificado.png';
    link.href = canvas.toDataURL();
    link.click();
}
