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
    // VOZ (FALAR)
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
    // FUNÇÃO GLOBAL DE FALA (IMPORTANTE)
    // ==========================
    window.falar = function (texto) {
        const u = new SpeechSynthesisUtterance(texto);
        u.lang = "pt-BR";
        speechSynthesis.speak(u);
    };

    // ==========================
    // BUSCA INTELIGENTE
    // ==========================
    function buscar(textoOCR) {

        const t = normalizar(textoOCR);
        const lista = window.medicamentos || [];

        const encontrados = [];
        const usados = new Set();

        for (const m of lista) {

            const nome = normalizar(m.nome);

            let ok =
                t.includes(nome) ||
                nome.includes(t) ||
                t.includes(nome.split(" ")[0]);

            if (!ok && m.sinonimos) {
                ok = m.sinonimos.some(s =>
                    t.includes(normalizar(s))
                );
            }

            if (ok) {

                const chave = normalizar(m.nome + m.forma + m.dosagem);

                if (!usados.has(chave)) {
                    usados.add(chave);
                    encontrados.push(m);
                }
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

                    <!-- BOTÃO OUVIR (CORRETO) -->
                    <button onclick="window.falar(${JSON.stringify(textoFala)})"
                        style="margin-top:8px;padding:5px 10px;cursor:pointer;">
                        🔊 Ouvir
                    </button>

                </div>
            `;
        }
    }
    
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-ouvir")) {
        const texto = decodeURIComponent(e.target.dataset.text);
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
