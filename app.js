
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
