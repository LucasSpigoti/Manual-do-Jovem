// ==========================================================================
// CONTROLE DOS SLIDES E PROGRESSO (USADO NO TREINAMENTO 1)
// ==========================================================================
const slides = document.querySelectorAll(".slide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progress-bar");
const navBar = document.querySelector(".navigation");

let currentSlideIndex = 0;

function updateSlides() {
    if (!slides.length || !progressBar) return;
    
    slides.forEach(slide => slide.classList.remove("active"));
    slides[currentSlideIndex].classList.add("active");

    const progress = ((currentSlideIndex + 1) / slides.length) * 100;
    progressBar.style.width = `${progress}%`;

    if (prevBtn) prevBtn.disabled = currentSlideIndex === 0;
    if (nextBtn) nextBtn.disabled = currentSlideIndex === slides.length - 1; 
}

if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        if (currentSlideIndex < slides.length - 1) {
            currentSlideIndex++;
            updateSlides();
        }
    });
}

if (prevBtn) {
    prevBtn.addEventListener("click", () => {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            updateSlides();
        }
    });
}

// Inicializa os slides ao carregar a página
updateSlides();


// ==========================================================================
// LÓGICA DINÂMICA DO QUIZ (COMPARTILHADO ENTRE OS TREINAMENTOS)
// ==========================================================================
let currentQuestion = 0;
let score = 0;

function startQuiz() {
    // Esconde a navegação inferior e o progresso dos slides
    if (navBar) navBar.style.display = "none";
    
    const progContainer = document.querySelector(".progress-container");
    if (progContainer) progContainer.style.display = "none";
    
    // Esconde os elementos específicos do player de vídeo (Treinamento 2) se existirem
    const videoCont = document.querySelector(".video-container");
    if (videoCont) {
        videoCont.style.padding = "20px 0";
        document.querySelectorAll(".video-container > p, .video-container > .video-wrapper, .video-container > button").forEach(el => el.style.display = "none");
    }

    // Esconde todos os slides normais
    document.querySelectorAll('.slide').forEach(s => s.style.display = 'none');
    
    // Exibe o container do quiz
    const quizBox = document.getElementById('quiz-container');
    if (quizBox) quizBox.style.display = 'block';
    
    showQuestion();
}

function showQuestion() {
    const listaPerguntas = typeof meuQuiz !== 'undefined' ? meuQuiz : [];
    if (!listaPerguntas.length) return;

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
    const listaPerguntas = typeof meuQuiz !== 'undefined' ? meuQuiz : [];
    
    if (choice === listaPerguntas[currentQuestion].correct) {
        score++;
        document.getElementById('quiz-feedback').innerHTML = '<i class="fas fa-check-circle"></i> GOLAÇO! Correto.';
        document.getElementById('quiz-feedback').style.color = "var(--verde-copa)";
    } else {
        document.getElementById('quiz-feedback').innerHTML = '<i class="fas fa-times-circle"></i> NA TRAVE! Incorreto.';
        document.getElementById('quiz-feedback').style.color = "#ff5252";
    }

    // Aguarda 1 segundo e passa para a próxima pergunta
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < listaPerguntas.length) {
            showQuestion();
        } else {
            showResult();
        }
    }, 1000);
}

function showResult() {
    const listaPerguntas = typeof meuQuiz !== 'undefined' ? meuQuiz : [];
    document.getElementById('quiz-container').style.display = 'none';
    
    const resultDiv = document.getElementById('quiz-result');
    resultDiv.style.display = 'block';
    document.getElementById('score-text').innerText = `Você acertou ${score} de ${listaPerguntas.length} perguntas!`;

    // Exige 70% de aproveitamento para liberar o certificado
    if (score >= (listaPerguntas.length * 0.7)) {
        document.getElementById('certificate-area').style.display = 'block';
    } else {
        document.getElementById('score-text').innerText += ' Estude mais um pouco e faça o treinamento novamente para alcançar a pontuação do certificado!';
    }
}


// ==========================================================================
// GERAÇÃO INTELIGENTE DE CERTIFICADOS (CANVAS)
// ==========================================================================
function generateCertificate() {
    const nameInput = document.getElementById('user-name').value.trim();
    
    if (nameInput === "") {
        alert("Por favor, digite seu nome completo para a emissão do certificado.");
        return;
    }

    const canvas = document.getElementById('certificate-canvas');
    const ctx = canvas.getContext('2d');

    // Resolução ideal em proporção horizontal para o modelo enviado
    canvas.width = 1000;
    canvas.height = 700;

    const imgBackground = new Image();
    const nomeCurso = document.title; 

    // Define qual imagem carregar dependendo da página em que o aluno está
    if (nomeCurso.includes("Comunicação Assertiva")) {
        // Modelo específico e exclusivo do Treinamento 2
        imgBackground.src = 'Modern Vintage Certificate of Achievement.jpg';
    } else {
        // Modelo para a Oficina de Currículo ou demais módulos futuros
        imgBackground.src = 'modelo-generico.png'; 
    }

    imgBackground.onload = function() {
        // Desenha a imagem de fundo escolhida sobre o canvas limpo
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imgBackground, 0, 0, canvas.width, canvas.height);

        // Estilização clássica e formal para escrita do nome
        ctx.font = 'italic bold 36px "Georgia", "Times New Roman", serif'; 
        ctx.fillStyle = '#1c2826'; // Grafite escuro elegante combinando com as fontes do papel
        ctx.textAlign = 'center'; 

        // Carimba o nome exatamente acima da linha pontilhada do arquivo "Modern Vintage Certificate of Achievement.jpg"
        ctx.fillText(nameInput, 500, 355);

        // Atualiza dinamicamente o container de prévia na interface do usuário
        const previewContainer = document.getElementById('preview-container');
        previewContainer.innerHTML = ""; 

        const imgPreview = document.createElement('img');
        imgPreview.src = canvas.toDataURL('image/jpeg', 0.9); // Mantém compressão limpa e boa qualidade
        imgPreview.style.maxWidth = "100%";
        imgPreview.style.borderRadius = "4px";
        imgPreview.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.4)";
        
        previewContainer.appendChild(imgPreview);

        // Revela o botão para salvar o arquivo localmente
        document.getElementById('download-btn').style.display = 'inline-block';
    };

    imgBackground.onerror = function() {
        alert(`Não foi possível carregar a imagem de fundo do certificado para: "${nomeCurso}". Verifique se o arquivo está com o nome correto na pasta.`);
    };
}

function downloadCertificate() {
    const canvas = document.getElementById('certificate-canvas');
    const link = document.createElement('a');
    link.download = 'meu-certificado.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}
