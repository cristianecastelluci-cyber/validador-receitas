document.getElementById("btnCamera").onclick = () => {
    document.getElementById("upload").click();
};

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


// =============================
// NORMALIZAÇÃO
// =============================
function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}


// =============================
// BUSCA MEDICAMENTOS
// =============================
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


// =============================
// PROCESSAMENTO PRINCIPAL
// =============================
function processarMedicamentos(textoOCR) {

    const encontrados = buscarMedicamentos(textoOCR);

    const div = document.getElementById("resultadoMedicamento");

    if (encontrados.length === 0) {
        div.innerHTML = "⚠️ Nenhum medicamento identificado na sua lista.";
        return;
    }

    div.innerHTML = "<h3>💊 Medicamentos identificados:</h3>";

    encontrados.forEach(m => {

        div.innerHTML += `
            <div style="padding:10px; border-bottom:1px solid #ccc;">
                <b>${m.nome}</b><br>
                ${m.forma || ""} - ${m.dosagem || ""}<br><br>

                <span style="color:green;">
                    ✔ Medicamento disponível na rede municipal.
                </span><br>

                📌 Verifique o estoque atual em cada unidade aqui:<br>
                <a href="https://www.assis.sp.gov.br/portal/secretarias-paginas/19/medicamentos-disponiveis/" target="_blank">
                    Acessar lista oficial da Prefeitura
                </a>
            </div>
        `;
    });
}


// =============================
// UNIDADES DISPENSADORAS
// =============================
function mostrarUnidades() {

    const div = document.getElementById("resultado");

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

    div.innerHTML = html;
}
