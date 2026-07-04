
document.getElementById("btnCamera").onclick = () => {
    document.getElementById("upload").click();
};

document.getElementById("upload").onchange = async (event) => {

    const file = event.target.files[0];

    if (!file) return;

    document.getElementById("resultado").innerText = "Lendo receita...";

    const reader = new FileReader();

    reader.onload = async function () {

        const result = await Tesseract.recognize(
            reader.result,
            'por'
        );

        const texto = result.data.text;

        document.getElementById("resultado").innerText = texto;
    };

    reader.readAsDataURL(file);
};
function mostrarUnidades() {

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

    document.getElementById("resultado").innerHTML = html;
}
