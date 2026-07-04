// ==========================
// DEBUG VOZ (opcional)
// ==========================
speechSynthesis.onvoiceschanged = () => {
    console.log("Vozes carregadas:", speechSynthesis.getVoices());
};

// ==========================
// SEGURANÇA GLOBAL
// ==========================
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
    // FALA GLOBAL (TTS ESTÁVEL)
    // ==========================
    window.falar = function (texto) {
        if (!texto) return;

        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(texto);

        utterance.lang = "pt-BR";
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        const iniciar = () => {
            const voices = speechSynthesis.getVoices();

            const vozPT =
                voices.find(v => v.lang === "pt-BR") ||
                voices.find(v => v.lang.startsWith("pt")) ||
                voices[0];

            if (vozPT) utterance.voice = vozPT;

            speechSynthesis.speak(utterance);
        };

        const voices = speechSynthesis.getVoices();

        if (!voices || voices.length === 0) {
            speechSynthesis.onvoiceschanged = iniciar;
        } else {
            iniciar();
        }

        utterance.onerror = (e) => console.error("Erro voz:", e);
    };

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

            const div = document.getElementById("resultado");
            if (div) div.innerText = "🔎 Lendo receita...";

            try {
                const { data: { text } } = await Tesseract.recognize(file, "por");

                if (div) div.innerText = text;

                processar(text);

            } catch (e) {
                console.error(e);
                alert("Erro ao ler receita");
            }
        };
    }

    // ==========================
    // VOZ (INPUT)
    // ==========================
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = "pt-BR";

        const btnVoz = document.getElementById("voz");

        if (btnVoz) {
            btnVoz.onclick = () => recognition.start();
        }

        recognition.onresult = (e) => {
            processar(e.results[0][0].transcript);
        };
    }

    // ==========================
    // LIBRAS
    // ==========================
    const btnLibras = document.getElementById("libras");

    if (btnLibras) {
        btnLibras.onclick = () => {
            const btn = document.querySelector("[vw-access-button]");
            if (btn) btn.click();
        };
    }

    // ==========================
    // BUSCA INTELIGENTE (FINAL CORRIGIDA)
    // ==========================
    function buscar(textoOCR) {

        const t = normalizar(textoOCR);
        const lista = window.medicamentos || [];

        const encontrados = [];

        for (const m of lista) {

            const nome = normalizar(m.nome);
            const forma = normalizar(m.forma || "");
            const dosagem = normalizar(m.dosagem || "");

            const base = nome.split(" ")[0];

            let ok =
                t.includes(nome) ||
                t.includes(base) ||
                (dosagem && t.includes(dosagem)) ||
                (forma && t.includes(forma));

            if (!ok && m.sinonimos) {
                ok = m.sinonimos.some(s =>
                    t.includes(normalizar(s))
                );
            }

            if (ok) {
                encontrados.push(m);
            }
        }

        return encontrados;
    }

    // ==========================
    // PROCESSAMENTO
    // ==========================
   function processar(textoOCR) {

    const div = document.getElementById("resultadoMedicamento");
    if (!div) return;

    const encontrados = buscar(textoOCR);

    if (encontrados.length === 0) {
        div.innerHTML = `
    <div style="
        color: red;
        font-weight: bold;
        font-size: 16px;
        margin-top: 10px;
    ">
        👎 Nenhum medicamento identificado na rede municipal.
    </div>
`;

    div.innerHTML = "💊 <h3>Medicamentos encontrados</h3>";

    for (const m of encontrados) {

        const textoFala = `${m.nome} ${m.dosagem || ""}. Disponível no SUS.`;

        // ==========================
        // STATUS VISUAL (EMOJIS)
        // ==========================
        let statusIcon = "👍";
        let statusLabel = "Disponível no SUS";
        let statusColor = "green";

        if (m.status === "indisponivel") {
            statusIcon = "👎";
            statusLabel = "Indisponível";
            statusColor = "red";
        }

        if (m.status === "estoque_baixo") {
            statusIcon = "⚠️";
            statusLabel = "Estoque baixo";
            statusColor = "orange";
        }

        div.innerHTML += `
            <div style="
                padding:12px;
                margin:10px 0;
                border-radius:10px;
                border:1px solid #ddd;
                background:#fafafa;
            ">

                <!-- TÍTULO -->
                <div style="font-size:18px;font-weight:bold;">
                    💊 ${m.nome}
                </div>

                <!-- DETALHES -->
                <div style="margin-top:5px;">
                    📦 ${m.forma || "—"}<br>
                    ⚖️ ${m.dosagem || "—"}
                </div>

                <!-- STATUS -->
                <div style="
                    margin-top:10px;
                    font-weight:bold;
                    color:${statusColor};
                    font-size:15px;
                ">
                    ${statusIcon} ${statusLabel}
                </div>

                <!-- AÇÕES -->
                <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">

                    <a href="https://www.assis.sp.gov.br/portal/secretarias-paginas/19/medicamentos-disponiveis/"
                       target="_blank"
                       style="
                           padding:6px 10px;
                           background:#1976d2;
                           color:white;
                           border-radius:6px;
                           text-decoration:none;
                       ">
                        📍 Estoque
                    </a>

                    <button class="btn-ouvir"
                        data-text='${JSON.stringify(textoFala)}'
                        style="
                            padding:6px 10px;
                            border-radius:6px;
                            border:none;
                            background:#4caf50;
                            color:white;
                            cursor:pointer;
                        ">
                        🔊 Ouvir
                    </button>

                </div>

            </div>
        `;
    }
}

    // ==========================
    // BOTÃO OUVIR (ROBUSTO)
    // ==========================
    document.addEventListener("click", function (e) {
        const btn = e.target.closest(".btn-ouvir");
        if (!btn) return;

        const texto = JSON.parse(btn.dataset.text);
        window.falar(texto);
    });

    // ==========================
    // CONSULTA MANUAL
    // ==========================
    window.consultarMedicamento = function () {

        const input = document.getElementById("inputMedicamento");

        if (!input || !input.value.trim()) {
            alert("Digite um medicamento");
            return;
        }

        processar(input.value);
    };

    // ==========================
    // UNIDADES SUS
    // ==========================
    window.mostrarUnidades = function () {

        const div = document.getElementById("listaUnidades");
        if (!div) return;

        let html = "<h3>🏥 Unidades do SUS em Assis-SP</h3>";

        const lista = window.unidadesDispensadoras || [];

        for (const u of lista) {
            html += `
                <div style="margin-bottom:10px;padding:10px;border:1px solid #ccc;">
                    📍 <b>${u.nome}</b><br>
                    🏠 ${u.endereco}<br>
                    📞 ${u.telefone || ""}<br>
                    🌍 ${u.regiao || ""}<br>
                    💊 ${u.componente || ""}
                </div>
            `;
        }

        div.innerHTML = html;
    };

});
