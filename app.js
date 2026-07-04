// ==========================
// INICIALIZAÇÃO SEGURA
// ==========================
document.addEventListener("DOMContentLoaded", () => {


// ==========================
// BOTÃO CÂMERA
// ==========================
const btnCamera = document.getElementById("btnCamera");
const upload = document.getElementById("upload");

if (btnCamera && upload) {
    btnCamera.onclick = () => {
        upload.click();
    };
}


// ==========================
// OCR DA RECEITA
// ==========================
if (upload) {
    upload.onchange = async (event) => {

        const file = event.target.files[0];
        if (!file) return;

        const resultadoOCR = document.getElementById("resultado");

        if (resultadoOCR) {
            resultadoOCR.innerText = "🔎 Lendo receita...";
        }

        const { data: { text } } = await Tesseract.recognize(file, "por");

        if (resultadoOCR) {
            resultadoOCR.innerText = text;
        }

        processarMedicamentos(text);
    };
}


// ==========================
// VOZ (RECONHECIMENTO)
// ==========================
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = null;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";

    const btnVoz = document.getElementById("voz");

    if (btnVoz) {
        btnVoz.onclick = () => {
            recognition.start();
        };
    }

    recognition.onresult = (event) => {
        const texto = event.results[0][0].transcript;
        processarMedicamentos(texto);
    };
}


// ==========================
// LIBRAS (VLIBRAS)
// ==========================
const btnLibras = document.getElementById("libras");

if (btnLibras) {
    btnLibras.onclick = () => {
        alert("🤟 VLibras ativado! Use o botão azul na tela.");
    };
}


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
// BUSCA INTELIGENTE (CORRIGIDA)
// ==========================
function buscarMedicamentos(textoOCR) {

    const texto = normalizar(textoOCR);

    return medicamentos.filter(m => {

        const nome = normalizar(m.nome);

        // ✔ MATCH FLEXÍVEL (resolve losartana vs losartana potássica)
        if (texto.includes(nome) || nome.includes(texto)) {
            return true;
        }

        // ✔ SINÔNIMOS
        if (m.sinonimos?.some(s => {
            const sn = normalizar(s);
            return texto.includes(sn) || sn.includes(texto);
        })) {
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
// FALA (SÍNTESE)
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

    if (!div) return;

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
        `;

        div.innerHTML += `
            <div style="padding:10px;border-bottom:1px solid #ccc;">
                <b>${m.nome}</b><br>
                ${m.forma || ""} - ${m.dosagem || ""}<br><br>

                <span style="color:green;">
                    ✔ Disponível no SUS
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
window.mostrarUnidades = function () {

    const div = document.getElementById("listaUnidades");

    if (!div) return;

    let html = "<h3>🏥 Unidades do SUS em Assis-SP</h3>";

    unidadesDispensadoras.forEach(u => {
        html += `
            <div style="margin-bottom:10px; padding:10px; border:1px solid #ccc;">
                📍 <b>${u.nome}</b><br>
                🏠 ${u.endereco}<br>
                📞 ${u.telefone || ""}<br>
                🌍 ${u.regiao || ""}<br>
                💊 ${u.componente || ""}
            </div>
        `;
    });

    div.innerHTML = html;
};

});
