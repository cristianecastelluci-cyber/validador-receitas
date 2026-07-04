// ==========================
// DEBUG VOZ
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
    // FALA GLOBAL
    // ==========================
    window.falar = function (texto) {
        if (!texto) return;

        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = "pt-BR";

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
    // BUSCA
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
                ok = m.sinonimos.some(s => t.includes(normalizar(s)));
            }

            if (ok) encontrados.push(m);
        }

        return encontrados;
    }

    // ==========================
    // PROCESSAMENTO (RECEITA INTELIGENTE)
    // ==========================
    function processar(textoOCR) {

        const div = document.getElementById("resultadoMedicamento");
        if (!div) return;

        const linhas = textoOCR
            .split("\n")
            .map(l => l.trim())
            .filter(l => l.length > 0);

        let encontradosTotais = [];
        let naoEncontrados = [];

        for (const linha of linhas) {

            const encontrados = buscar(linha);

            if (encontrados.length > 0) {
                encontradosTotais.push(...encontrados);
            } else {
                naoEncontrados.push(linha);
            }
        }

        const unicos = [...new Map(encontradosTotais.map(m => [m.nome, m])).values()];

        let html = `<h3 style="color:#1565c0;">📷 Resultado da Receita</h3>`;

        if (unicos.length > 0) {

            html += `<h4 style="color:green;">🟢 Encontrados</h4>`;

            for (const m of unicos) {

                const textoFala =
                    `${m.nome} ${m.dosagem || ""}. Este medicamento faz parte da relação de medicamentos de Assis-SP.`;

                html += `
                <div style="background:#e8f5e9;padding:12px;margin:10px 0;border-radius:10px;border-left:6px solid #2e7d32;">
                    💊 <b>${m.nome}</b><br>
                    📦 ${m.forma || "-"}<br>
                    ⚖️ ${m.dosagem || "-"}<br><br>

                    😊👍 Disponível na rede municipal<br><br>

                    <button class="btn-ouvir" data-text='${JSON.stringify(textoFala)}'>
                        🔊 Ouvir
                    </button>
                </div>`;
            }
        }

        if (naoEncontrados.length > 0) {

            html += `<h4 style="color:red;">🔴 Não encontrados</h4>`;

            for (const item of naoEncontrados) {

                html += `
                <div style="background:#ffebee;padding:10px;margin:8px 0;border-left:5px solid red;border-radius:8px;">
                    😞 ${item}
                </div>`;
            }
        }

        div.innerHTML = html;
    }

    // ==========================
    // BOTÃO OUVIR
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
    // UNIDADES
    // ==========================
    window.mostrarUnidades = function () {

        const div = document.getElementById("listaUnidades");
        if (!div) return;

        let html = `<h3 style="color:#1565c0;">💊 Unidades Dispensadoras de Medicamentos de Assis-SP</h3>`;

        const lista = window.unidadesDispensadoras || [];

        if (lista.length === 0) {
            div.innerHTML = "Nenhuma unidade cadastrada.";
            return;
        }

        for (const u of lista) {

            html += `
            <div style="border:1px solid #ddd;padding:12px;margin:10px 0;border-radius:10px;">
                🏥 <b>${u.nome}</b><br>
                📍 ${u.endereco}<br>
                📞 ${u.telefone || "-"}<br>
                🌎 ${u.regiao || "-"}<br>
                💊 ${u.componente || "-"}
            </div>`;
        }

        div.innerHTML = html;
    };

});
