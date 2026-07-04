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
    // VOZ GLOBAL (CORRIGIDA E ESTÁVEL)
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

            if (vozPT) {
                utterance.voice = vozPT;
            }

            speechSynthesis.speak(utterance);
        };

        const voices = speechSynthesis.getVoices();

        if (!voices || voices.length === 0) {
            speechSynthesis.onvoiceschanged = iniciar;
        } else {
            iniciar();
        }

        utterance.onstart = () => console.log("🔊 falando:", texto);
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
    // BUSCA INTELIGENTE
    // ==========================
   function buscar(textoOCR) {

    const t = normalizar(textoOCR);
    const lista = window.medicamentos || [];

    const encontrados = [];

    for (const m of lista) {

        const nome = normalizar(m.nome);
        const forma = normalizar(m.forma || "");
        const dosagem = normalizar(m.dosagem || "");

        // ==========================
        // MATCH FORTE (prioridade)
        // ==========================
        let ok =
            t.includes(nome) ||
            (nome && t.includes(nome + " " + dosagem)) ||
            (nome && t.includes(nome + " " + forma));

        // ==========================
        // SINÔNIMOS
        // ==========================
        if (!ok && m.sinonimos) {
            ok = m.sinonimos.some(s =>
                t.includes(normalizar(s))
            );
        }

        // ==========================
        // FALLBACK OCR FRACO
        // ==========================
        if (!ok) {
            const palavras = nome.split(" ");

            if (palavras.length > 1) {
                ok = palavras.some(p => t.includes(p));
            }
        }

        if (ok) {
            encontrados.push(m);
        }
    }

    return encontrados;
}
    // ==========================
    // PROCESSAMENTO PRINCIPAL
    // ==========================
    function processar(textoOCR) {

        const div = document.getElementById("resultadoMedicamento");
        if (!div) return;

        const encontrados = buscar(textoOCR);

        if (encontrados.length === 0) {
            div.innerHTML = "Nenhum medicamento identificado na rede municipal.";
            return;
        }

        div.innerHTML = "<h3>💊 Medicamentos encontrados</h3>";

        for (const m of encontrados) {

            const textoFala = `${m.nome} ${m.dosagem || ""}. Disponível no SUS.`;

            div.innerHTML += `
                <div style="padding:10px;border-bottom:1px solid #ddd">

                    <b>${m.nome}</b><br>
                    ${m.forma || ""} - ${m.dosagem || ""}<br><br>

                    <span style="color:green;font-weight:bold;">
                        ✔ Disponível no SUS
                    </span><br>

                    <a href="https://www.assis.sp.gov.br/portal/secretarias-paginas/19/medicamentos-disponiveis/"
                       target="_blank">
                       Ver estoque oficial
                    </a>

                    <br><br>

                    <!-- BOTÃO OUVIR -->
                    <button class="btn-ouvir"
                        data-text="${textoFala.replace(/"/g, '&quot;')}"
                        style="margin-top:8px;padding:6px 10px;cursor:pointer;border-radius:6px;">
                        🔊 Ouvir
                    </button>

                </div>
            `;
        }
    }

    // ==========================
    // EVENTO GLOBAL BOTÃO OUVIR
    // ==========================
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("btn-ouvir")) {
            const texto = e.target.dataset.text;
            window.falar(texto);
        }
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
