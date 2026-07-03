document.getElementById("receita").onclick = async () => {

const file = document.getElementById("upload").files[0];

if (!file) {
alert("Envie uma imagem da receita primeiro!");
return;
}

document.getElementById("resultado").innerText = "Lendo receita...";

const reader = new FileReader();

reader.onload = async function () {

const result = await Tesseract.recognize(
reader.result,
'por'
);

const texto = result.data.text;

document.getElementById("resultado").innerText = texto;

analisarMedicamentos(texto);

};

reader.readAsDataURL(file);

};

function analisarMedicamentos(texto) {

let medicamentos = ["losartana", "metformina", "amoxicilina", "dipirona"];

let encontrados = medicamentos.filter(m =>
texto.toLowerCase().includes(m)
);

alert("Medicamentos encontrados: " + encontrados.join(", "));

}
