
function buscarMedicamentosComBase(textoOCR) {

    const texto = normalizar(textoOCR);

    const resultados = [];
    const jaAdicionados = new Set();

    medicamentos.forEach(m => {

        const nome = normalizar(m.nome);
        let encontrou = false;

        if (
            texto.includes(nome) ||
            nome.includes(texto) ||
            texto.includes(nome.split(" ")[0])
        ) {
            encontrou = true;
        }

        if (!encontrou && m.sinonimos) {
            encontrou = m.sinonimos.some(s => {
                const sn = normalizar(s);
                return texto.includes(sn) || sn.includes(texto);
            });
        }

        if (!encontrou) {
            const corrigido = corrigirMedicamento(texto, medicamentos);
            if (corrigido) {
                m = corrigido;
                encontrou = true;
            }
        }

        if (encontrou) {

            const chave = chaveMedicamento(m);

            if (!jaAdicionados.has(chave)) {
                jaAdicionados.add(chave);
                resultados.push(m);
            }
        }
    });

    return resultados;
}
