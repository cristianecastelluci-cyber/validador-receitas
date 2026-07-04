
// ==========================
// BOTÃO CÂMERA
// ==========================
document.getElementById("btnCamera").onclick = () => {
    document.getElementById("upload").click();
};


// ==========================
// OCR DA RECEITA
// ==========================
document.getElementById("upload").onchange = async (event) => {

    const file = event.target.files[0];
    if (!file) return;

    const resultadoOCR = document.getElementById("resultado");
    const resultadoMedicamento = document.getElementById("resultadoMedicamento");

    resultadoOCR.innerText = "🔎 Lendo receita...";

    const { data: { text } } = await Tesseract.recognize(
        file,
        "por"
    );

    resultadoOCR.innerText = text;

    processarMedicamentos(text);
};


// ==========================
// VOZ (RECONHECIMENTO)
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
// BUSCA MEDICAMENTOS
// ==========================
function buscarMedicamentos(textoOCR) {

    const texto = normalizar(textoOCR);

    return medicamentos.filter(m => {

        if (texto.includes(normalizar(m.nome)))
            return true;

        if (m.sinonimos?.some(s =>
            texto.includes(normalizar(s))
        ))
            return true;

        return false;
    });
}


// ==========================
// FALA (SÍNTESE DE VOZ)
// ==========================
function falar(texto) {

    const speech = new SpeechSynthesisUtterance(texto);
    speech.lang = "pt-BR";
    speechSynthesis.speak(speech);
}


// ==========================
// PROCESSAMENTO PRINCIPAL
// ==========================
function processarMedicamentos(textoOCR) {

    const encontrados = buscarMedicamentos(textoOCR);

    const div = document.getElementById("resultadoMedicamento");

    if (encontrados.length === 0) {

        const msg = "Nenhum medicamento identificado na lista da rede municipal.";

        div.innerHTML = msg;
        falar(msg);

        return;
    }

    div.innerHTML = "<h3>💊 Medicamentos encontrados:</h3>";

    encontrados.forEach(m => {

        const msg = `
${m.nome} - ${m.dosagem}.
Medicamento disponível na rede municipal.
Verifique o estoque atual em cada unidade aqui:
https://www.assis.sp.gov.br/portal/secretarias-paginas/19/medicamentos-disponiveis/
        `;

        div.innerHTML += `
            <div style="padding:10px; border-bottom:1px solid #ccc;">
                <b>${m.nome}</b><br>
                ${m.forma || ""} - ${m.dosagem || ""}<br><br>

                <span style="color:green;">
                    ✔ Medicamento disponível na rede municipal
                </span><br>

                <a href="https://www.assis.sp.gov.br/portal/secretarias-paginas/19/medicamentos-disponiveis/" target="_blank">
                    Ver estoque oficial
                </a>
            </div>
        `;

        falar(msg);
    });
}


// ==========================
// UNIDADES SUS
// ==========================
function mostrarUnidades() {

    const div = document.getElementById("listaUnidades");

    let html = "<hr><h3>🏥 Unidades do SUS em Assis-SP</h3>";

    unidadesDispensadoras.forEach(u => {
        html += `
            <div style="margin-bottom:10px; padding:10px; border:1px solid #ccc;">
                📍 <b>${u.nome}</b><br>
                🏠 ${u.endereco}<br>
                📞 ${u.telefone}<br>
                🌍 Região: ${u.regiao}<br>
                💊 Componente: ${u.componente}
            </div>
        `;
    });
document.getElementById("libras").onclick = () => {

    alert("🤟 VLibras ativado! Use o botão azul na tela para tradução em Libras.");

    // opcional: abrir automaticamente o widget
    const btn = document.querySelector('[vw-access-button]');
    if (btn) btn.click();
};
    div.innerHTML = html;
}
