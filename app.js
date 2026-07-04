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

    // =========================
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

    // remove duplicados
    const unicos = [...new Map(encontradosTotais.map(m => [m.nome, m])).values()];

    let html = `
        <h3 style="color:#1565c0;">
            📷 Resultado da Receita
        </h3>
    `;

    // ==========================
    // MEDICAMENTOS ENCONTRADOS
    // ==========================
    if (unicos.length > 0) {

        html += `<h4 style="color:green;">🟢 Encontrados</h4>`;

        for (const m of unicos) {

            const textoFala =
                `${m.nome} ${m.dosagem || ""}. Este medicamento faz parte da relação de medicamentos de Assis-SP.`;

            html += `
                <div style="
                    background:#e8f5e9;
                    border-left:6px solid #2e7d32;
                    padding:12px;
                    margin:10px 0;
                    border-radius:10px;
                ">

                    <div style="font-size:18px;font-weight:bold;">
                        💊 ${m.nome}
                    </div>

                    <div style="margin-top:5px;">
                        📦 ${m.forma || "-"}<br>
                        ⚖️ ${m.dosagem || "-"}
                    </div>

                    <div style="margin-top:10px;font-weight:bold;color:#1b5e20;">
                        😊 👍 Este medicamento faz parte da relação de medicamentos de Assis-SP.
                    </div>

                    <button class="btn-ouvir"
                        data-text='${JSON.stringify(textoFala)}'
                        style="margin-top:10px;padding:6px 10px;border-radius:6px;">
                        🔊 Ouvir
                    </button>

                </div>
            `;
        }
    }

    // ==========================
    // NÃO ENCONTRADOS
    // ==========================
    if (naoEncontrados.length > 0) {

        html += `<h4 style="color:red;">🔴 Não encontrados</h4>`;

        for (const item of naoEncontrados) {

            html += `
                <div style="
                    background:#ffebee;
                    border-left:6px solid #d32f2f;
                    padding:12px;
                    margin:10px 0;
                    border-radius:10px;
                    color:#c62828;
                    font-weight:bold;
                ">
                    😞 👎 ${item}
                </div>
            `;
        }
    }

    div.innerHTML = html;
}
    // ==========================
    // NENHUM MEDICAMENTO ENCONTRADO
    // ==========================
    if (encontrados.length === 0) {

        div.innerHTML = `
            <div style="
                margin:15px 0;
                padding:18px;
                background:#ffebee;
                border-left:8px solid #d32f2f;
                border-radius:10px;
                text-align:center;
            ">

                <div style="font-size:42px;">
                    😞 👎
                </div>

                <div style="
                    color:#c62828;
                    font-size:20px;
                    font-weight:bold;
                    margin-top:10px;
                ">
                    Nenhum medicamento identificado na rede municipal.
                </div>

            </div>
        `;

        return;
    }

    // ==========================
    // TÍTULO
    // ==========================
    div.innerHTML = `
        <h3 style="color:#1565c0;">
            😊 Resultado da consulta
        </h3>
    `;

    // ==========================
    // MEDICAMENTOS
    // ==========================
    for (const m of encontrados) {

        const textoFala =
            `${m.nome} ${m.dosagem || ""}. ` +
            `Este medicamento faz parte da relação de medicamentos de Assis-SP.`;

        div.innerHTML += `

            <div style="
                background:#ffffff;
                border:1px solid #dcdcdc;
                border-radius:12px;
                padding:15px;
                margin-bottom:15px;
                box-shadow:0 2px 6px rgba(0,0,0,.08);
            ">

                <!-- Nome -->
                <div style="
                    font-size:22px;
                    font-weight:bold;
                    color:#0d47a1;
                ">
                    💊 ${m.nome}
                </div>

                <!-- Forma e dosagem -->
                <div style="
                    margin-top:8px;
                    font-size:16px;
                ">
                    📦 <b>Forma:</b> ${m.forma || "-"}<br>
                    ⚖️ <b>Dosagem:</b> ${m.dosagem || "-"}
                </div>

                <!-- Situação -->
                <div style="
                    margin-top:15px;
                    padding:15px;
                    background:#e8f5e9;
                    border-left:7px solid #2e7d32;
                    border-radius:8px;
                    color:#1b5e20;
                    font-weight:bold;
                    line-height:1.6;
                ">

                    <div style="font-size:40px;">
                        😊 👍
                    </div>

                    Este medicamento faz parte da relação de medicamentos de Assis-SP.

                </div>

                <!-- Link -->
                <div style="margin-top:15px;">

                    <a href="https://www.assis.sp.gov.br/portal/secretarias-paginas/19/medicamentos-disponiveis/"
                       target="_blank"
                       style="
                           display:inline-block;
                           background:#1976d2;
                           color:white;
                           text-decoration:none;
                           padding:10px 16px;
                           border-radius:8px;
                           font-weight:bold;
                       ">
                        📍 Consultar disponibilidade nas unidades de saúde
                    </a>

                </div>

                <!-- Botão ouvir -->
                <div style="margin-top:15px;">

                    <button
                        class="btn-ouvir"
                        data-text='${JSON.stringify(textoFala)}'
                        style="
                            padding:10px 16px;
                            border:none;
                            border-radius:8px;
                            background:#43a047;
                            color:white;
                            cursor:pointer;
                            font-size:15px;
                            font-weight:bold;
                        ">

                        🔊 Ouvir resposta

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
// UNIDADES DISPENSADORAS DE MEDICAMENTOS
// ==========================
window.mostrarUnidades = function () {

    const div = document.getElementById("listaUnidades");
    if (!div) return;

    let html = `
        <h3 style="
            color:#1565c0;
            text-align:center;
            margin-bottom:20px;
            font-size:24px;
        ">
            💊 Unidades Dispensadoras de Medicamentos de Assis-SP
        </h3>
    `;

    const lista = window.unidadesDispensadoras || [];

    if (lista.length === 0) {
        div.innerHTML = `
            <div style="
                background:#ffebee;
                border-left:6px solid #d32f2f;
                padding:15px;
                border-radius:10px;
                color:#c62828;
                font-weight:bold;
                text-align:center;
            ">
                😞 Nenhuma unidade cadastrada.
            </div>
        `;
        return;
    }

    for (const u of lista) {

        html += `
            <div style="
                background:#ffffff;
                border:1px solid #dcdcdc;
                border-left:6px solid #1976d2;
                border-radius:12px;
                padding:15px;
                margin-bottom:15px;
                box-shadow:0 2px 6px rgba(0,0,0,.08);
            ">

                <div style="
                    font-size:20px;
                    font-weight:bold;
                    color:#1565c0;
                    margin-bottom:12px;
                ">
                    🏥 ${u.nome}
                </div>

                <div style="margin-bottom:8px;">
                    📍 <b>Endereço:</b><br>
                    ${u.endereco}
                </div>

                <div style="margin-bottom:8px;">
                    📞 <b>Telefone:</b><br>
                    ${u.telefone || "Não informado"}
                </div>

                <div style="margin-bottom:8px;">
                    🌎 <b>Região:</b><br>
                    ${u.regiao || "-"}
                </div>

                <div style="
                    background:#e8f5e9;
                    padding:10px;
                    border-radius:8px;
                    color:#1b5e20;
                    font-weight:bold;
                ">
                    💊 ${u.componente || "-"}
                </div>

            </div>
        `;
    }

    div.innerHTML = html;
};
