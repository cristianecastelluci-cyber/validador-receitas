window.medicamentos = window.medicamentos || [];

document.addEventListener("DOMContentLoaded", () => {

// ==========================
// NORMALIZAÇÃO
// ==========================
function normalizar(texto) {
    return (texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

// ==========================
// CHAVE ÚNICA (EVITA DUPLICAÇÃO)
// ==========================
function chaveMedicamento(m) {
    return normalizar(m.nome) + "|" + (m.forma || "") + "|" + (m.dosagem || "");
}

// ==========================
// BOTÃO CÂMERA
// ==========================
const btnCamera = document.getElementById("btnCamera");
const upload = document.getElementById("upload");

if (btnCamera && upload) {
    btnCamera.onclick = () => upload.click();
}

// ==========================
// OCR
// ==========================
if (upload) {
    upload.onchange = async (event) => {

        const file = event.target.files[0];
        if (!file) return;

        const resultadoOCR = document.getElementById("resultado");
        if (resultadoOCR) resultadoOCR.innerText = "🔎 Lendo receita...";

        try {
            const { data: { text } } = await Tesseract.recognize(file, "por");

            if (resultadoOCR) resultadoOCR.innerText = text;

            processarMedicamentos(text);

        } catch (e) {
            alert("Erro ao ler imagem");
        }
    };
}

// ==========================
// VOZ
// ==========================
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";

    const btnVoz = document.getElementById("voz");

    if (btnVoz) {
        btnVoz.onclick = () => recognition.start();
    }

    recognition.onresult = (event) => {
        processarMedicamentos(event.results[0][0].transcript);
    };
}

// ==========================
// LIBRAS
// ==========================
const btnLibras = document.getElementById("libras");

if (btnLibras) {
    btnLibras.onclick = () => {
        alert("VLibras ativado");
    };
}

// ==========================
// CORREÇÃO SIMPLES OCR
// ==========================
function corrigirMedicamento(texto, lista) {

    const t = normalizar(texto);

    let melhor = null;
    let scoreMax = 0;

    lista.forEach(m => {

        const nome = normalizar(m.nome);
        let score = 0;

        if (nome.includes(t) || t.includes(nome)) score += 5;

        t.split(" ").forEach(p => {
            if (p.length > 3 && nome.includes(p)) score += 2;
        });

        if (score > scoreMax) {
            scoreMax = score;
            melhor = m;
        }
    });

    return scoreMax >= 3 ? melhor : null;
}

// ==========================
// BUSCA (SEM DUPLICAÇÃO)
// ==========================
function buscarMedicamentos(textoOCR) {

    const texto = normalizar(textoOCR);

    const resultados = [];
    const jaAdicionados = new Set();

    medicamentos.forEach(m => {

        const nome = normalizar(m.nome);
        let encontrou = false;

        if (
            texto.includes(nome) ||
            nome.includes(texto) ||
            texto.includes(nome.split(" ")[0])
        ) {
            encontrou = true;
        }

        if (!encontrou && m.sinonimos) {
            encontrou = m.sinonimos.some(s =>
                texto.includes(normalizar(s))
            );
        }

        if (!encontrou) {
            const corrigido = corrigirMedicamento(texto, medicamentos);
            if (corrigido) {
                m = corrigido;
                encontrou = true;
            }
        }

        if (encontrou) {

            const chave = chaveMedicamento(m);

            if (!jaAdicionados.has(chave)) {
                jaAdicionados.add(chave);
                resultados.push(m);
            }
        }
    });

    return resultados;
}

// ==========================
// FALA
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
        const msg = "Nenhum medicamento identificado na rede municipal.";
        div.innerHTML = msg;
        falar(msg);
        return;
    }

    div.innerHTML = "<h3>💊 Medicamentos encontrados</h3>";

    encontrados.forEach(m => {

        const msg = `${m.nome} - ${m.dosagem}. Disponível no SUS.`;

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
// UNIDADES SUS
// ==========================
window.mostrarUnidades = function () {

    const div = document.getElementById("listaUnidades");
    if (!div) return;

    let html = "<h3>🏥 Unidades do SUS em Assis-SP</h3>";

    unidadesDispensadoras.forEach(u => {
        html += `
            <div style="margin-bottom:10px;padding:10px;border:1px solid #ccc;">
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
