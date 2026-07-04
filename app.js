document.addEventListener("DOMContentLoaded", () => {

// ==========================
// BOTÃO CÂMERA
// ==========================
document.getElementById("btnCamera").onclick = () => {
    document.getElementById("upload").click();
};


// ==========================
// OCR
// ==========================
document.getElementById("upload").onchange = async (event) => {

    const file = event.target.files[0];
    if (!file) return;

    const resultadoOCR = document.getElementById("resultado");

    resultadoOCR.innerText = "🔎 Lendo receita...";

    const { data: { text } } = await Tesseract.recognize(file, "por");

    resultadoOCR.innerText = text;

    processarMedicamentos(text);
};


// ==========================
// VOZ
// ==========================
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "pt-BR";

document.getElementById("voz").onclick = () => {
    recognition.start();
};

recognition.onresult = (event) => {
    const texto = event.results[0][0].transcript;
    processarMedicamentos(texto);
};


// ==========================
// LIBRAS
// ==========================
document.getElementById("libras").onclick = () => {
    alert("🤟 VLibras ativado! Use o botão azul na tela.");
};


// ==========================
// NORMALIZAÇÃO
// ==========================
function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}


// ==========================
// BUSCA
// ==========================
function buscarMedicamentos(textoOCR) {

    const texto = normalizar(textoOCR);

    return medicamentos.filter(m => {

        const nome = normalizar(m.nome);

        // ✔ MATCH FLEXÍVEL (resolve "losartana" vs "losartana potássica")
        if (nome.includes(texto) || texto.includes(nome)) {
            return true;
        }

        // ✔ sinônimos
        if (m.sinonimos?.some(s =>
            normalizar(s).includes(texto) ||
            texto.includes(normalizar(s))
        )) {
            return true;
        }

        return false;
    });
}

// ==========================
// CONSULTA MANUAL
// ==========================
window.consultarMedicamento = function () {

    const input = document.getElementById("inputMedicamento");

    if (!input || !input.value.trim()) {
        alert("Digite um medicamento");
        return;
    }

    processarMedicamentos(input.value);
};


// ==========================
// FALA
// ==========================
function falar(texto) {
    const speech = new SpeechSynthesisUtterance(texto);
    speech.lang = "pt-BR";
    speechSynthesis.speak(speech);
}


// ==========================
// PROCESSAMENTO
// ==========================
function processarMedicamentos(textoOCR) {

    const encontrados = buscarMedicamentos(textoOCR);

    const div = document.getElementById("resultadoMedicamento");

    if (!encontrados.length) {
        const msg = "Nenhum medicamento identificado na rede municipal.";
        div.innerHTML = msg;
        falar(msg);
        return;
    }

    div.innerHTML = "<h3>💊 Medicamentos encontrados:</h3>";

    encontrados.forEach(m => {

        const msg = `
${m.nome} - ${m.dosagem}.
Medicamento disponível na rede municipal.
`;

        div.innerHTML += `
            <div style="padding:10px;border-bottom:1px solid #ccc;">
                <b>${m.nome}</b><br>
                ${m.forma || ""} - ${m.dosagem || ""}<br><br>

                <span style="color:green;">✔ Disponível no SUS</span><br>

                <a href="https://www.assis.sp.gov.br/portal/secretarias-paginas/19/medicamentos-disponiveis/" target="_blank">
                    Ver estoque oficial
                </a>
            </div>
        `;

        falar(msg);
    });
}


// ==========================
// UNIDADES
// ==========================
window.mostrarUnidades = function () {

    const div = document.getElementById("listaUnidades");

    let html = "<h3>🏥 Unidades do SUS</h3>";

    unidadesDispensadoras.forEach(u => {
        html += `
            <div style="margin-bottom:10px;padding:10px;border:1px solid #ccc;">
                📍 <b>${u.nome}</b><br>
                🏠 ${u.endereco}<br>
                📞 ${u.telefone}
            </div>
        `;
    });

    div.innerHTML = html;
};

});
