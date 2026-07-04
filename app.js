// ==========================================================
// FUNÇÕES GLOBAIS (Acessíveis a todo o sistema)
// ==========================================================

function normalizar(texto) {
    return (texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

window.falar = function (texto) {
    if (!texto) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "pt-BR";
    
    const iniciar = () => {
        const voices = speechSynthesis.getVoices();
        const vozPT = voices.find(v => v.lang === "pt-BR") || voices.find(v => v.lang.startsWith("pt")) || voices[0];
        if (vozPT) utterance.voice = vozPT;
        speechSynthesis.speak(utterance);
    };

    if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.onvoiceschanged = iniciar;
    } else {
        iniciar();
    }
};

window.buscar = function(textoOCR) {
    const t = normalizar(textoOCR);
    const lista = window.medicamentos || [];
    return lista.filter(m => {
        const nome = normalizar(m.nome);
        const forma = normalizar(m.forma || "");
        const dosagem = normalizar(m.dosagem || "");
        const base = nome.split(" ")[0];

        let ok = t.includes(nome) || t.includes(base) || (dosagem && t.includes(dosagem)) || (forma && t.includes(forma));
        if (!ok && m.sinonimos) {
            ok = m.sinonimos.some(s => t.includes(normalizar(s)));
        }
        return ok;
    });
};

window.processar = function(textoOCR) {
    const div = document.getElementById("resultadoMedicamento");
    if (!div) return;

    const encontrados = window.buscar(textoOCR);

    if (encontrados.length === 0) {
        div.innerHTML = `
            <div style="margin:15px 0; padding:18px; background:#ffebee; border-left:8px solid #d32f2f; border-radius:10px; text-align:center;">
                <div style="font-size:42px;">😞 👎</div>
                <div style="color:#c62828; font-size:20px; font-weight:bold; margin-top:10px;">Nenhum medicamento identificado na rede municipal.</div>
            </div>`;
        return;
    }

    let htmlConteudo = [`<h3 style="color:#1565c0;">😊 Resultado da consulta</h3>`];

    encontrados.forEach(m => {
        const textoFala = `${m.nome} ${m.dosagem || ""}. Este medicamento faz parte da relação de medicamentos de Assis-SP.`;
        htmlConteudo.push(`
            <div style="background:#ffffff; border:1px solid #dcdcdc; border-radius:12px; padding:15px; margin-bottom:15px; box-shadow:0 2px 6px rgba(0,0,0,.08);">
                <div style="font-size:22px; font-weight:bold; color:#0d47a1;">💊 ${m.nome}</div>
                <div style="margin-top:8px; font-size:16px;">
                    📦 <b>Forma:</b> ${m.forma || "-"}<br>
                    ⚖️ <b>Dosagem:</b> ${m.dosagem || "-"}
                </div>
                <div style="margin-top:15px; padding:15px; background:#e8f5e9; border-left:7px solid #2e7d32; border-radius:8px; color:#1b5e20; font-weight:bold;">
                    <div style="font-size:40px;">😊 👍</div>
                    Este medicamento faz parte da relação de medicamentos de Assis-SP.
                </div>
                <div style="margin-top:15px;">
                    <button class="btn-ouvir" data-text='${JSON.stringify(textoFala)}' style="padding:10px 16px; border:none; border-radius:8px; background:#43a047; color:white; cursor:pointer; font-weight:bold;">🔊 Ouvir resposta</button>
                </div>
            </div>`);
    });

    div.innerHTML = htmlConteudo.join('');
};

// ==========================================================
// INICIALIZAÇÃO DE EVENTOS
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // Botão Câmera
    const btnCamera = document.getElementById("btnCamera");
    const upload = document.getElementById("upload");
    if (btnCamera && upload) btnCamera.onclick = () => upload.click();

    // OCR
    if (upload) {
        upload.onchange = async (event) => {
            const file = event.target.files[0];
            if (!file) return;
            const div = document.getElementById("resultado");
            if (div) div.innerText = "🔎 Lendo receita...";
            try {
                const { data: { text } } = await Tesseract.recognize(file, "por");
                if (div) div.innerText = text;
                window.processar(text);
            } catch (e) {
                console.error(e);
                alert("Erro ao ler imagem da receita.");
            }
        };
    }

    // Botão Ouvir Global (Delegação de Eventos)
    document.addEventListener("click", (e) => {
        if (e.target.matches(".btn-ouvir")) {
            window.falar(JSON.parse(e.target.dataset.text));
        }
    });

    // Consulta Manual
    window.consultarMedicamento = () => {
        const input = document.getElementById("inputMedicamento");
        if (input && input.value.trim()) window.processar(input.value);
    };
});
