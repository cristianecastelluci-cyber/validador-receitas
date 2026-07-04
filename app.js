// ==========================================================
// 1. VARIÁVEIS GLOBAIS E CONFIGURAÇÃO
// ==========================================================
window.medicamentos = window.medicamentos || [];
window.unidadesDispensadoras = window.unidadesDispensadoras || [];

// ==========================================================
// 2. FUNÇÕES DE UTILIDADE (Globais)
// ==========================================================
function normalizar(texto) {
    return (texto || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

window.falar = function (texto) {
    if (!texto) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "pt-BR";
    speechSynthesis.speak(utterance);
};

// ==========================================================
// 3. LÓGICA DE BUSCA E PROCESSAMENTO (Globais)
// ==========================================================
function buscar(textoOCR) {
    const t = normalizar(textoOCR);
    return (window.medicamentos || []).filter(m => {
        const nome = normalizar(m.nome);
        const base = nome.split(" ")[0];
        let ok = t.includes(nome) || t.includes(base);
        if (!ok && m.sinonimos) ok = m.sinonimos.some(s => t.includes(normalizar(s)));
        return ok;
    });
}

window.processar = function(textoOCR) {
    const div = document.getElementById("resultadoMedicamento");
    if (!div) return;
    const encontrados = buscar(textoOCR);
    
    if (encontrados.length === 0) {
        div.innerHTML = `<div style="padding:18px; background:#ffebee; border-radius:10px; text-align:center;">😞 Nenhum medicamento identificado.</div>`;
        return;
    }

    div.innerHTML = `<h3>😊 Resultado da consulta</h3>` + encontrados.map(m => `
        <div style="background:#fff; border:1px solid #ddd; padding:15px; margin-bottom:10px; border-radius:10px;">
            <b>💊 ${m.nome}</b><br>Dosagem: ${m.dosagem || "-"}<br>
            <button class="btn-ouvir" data-text='${m.nome} faz parte da rede municipal.'>🔊 Ouvir</button>
        </div>`).join('');
};

window.consultarMedicamento = function () {
    const input = document.getElementById("inputMedicamento");
    if (input && input.value.trim()) window.processar(input.value);
};

window.mostrarUnidades = function () {
    const div = document.getElementById("listaUnidades");
    if (!div) return;
    div.innerHTML = (window.unidadesDispensadoras || []).map(u => `
        <div style="background:#fff; padding:10px; margin-bottom:5px; border-left:5px solid #1976d2;">
            🏥 ${u.nome}<br>📍 ${u.endereco}
        </div>`).join('');
};

// ==========================================================
// 4. INICIALIZAÇÃO DE EVENTOS (Apenas o necessário)
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // Configura OCR
    const upload = document.getElementById("upload");
    const btnCamera = document.getElementById("btnCamera");
    if (btnCamera && upload) btnCamera.onclick = () => upload.click();

    if (upload) {
        upload.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            document.getElementById("resultado").innerText = "🔎 Lendo receita...";
            const { data: { text } } = await Tesseract.recognize(file, "por");
            window.processar(text);
        };
    }

    // Delegação para botões dinâmicos
    document.addEventListener("click", (e) => {
        if (e.target.matches(".btn-ouvir")) window.falar(e.target.dataset.text);
    });
});
