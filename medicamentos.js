// ==========================
// FUNÇÃO AUXILIAR (base)
// ==========================
function gerarBase(nome) {
    return nome
        .toLowerCase()
        .split("+")[0]
        .split(",")[0]
        .split(" ")[0]
        .trim();
}
const medicamentos = [

{
    nome: "Aciclovir",
    forma: "comprimido",
    dosagem: "200 mg"
},

{
    nome: "Aciclovir",
    forma: "creme",
    dosagem: "50 mg/g"
},

{
    nome: "Ácido acetilsalicílico",
    forma: "comprimido",
    dosagem: "100 mg",
    sinonimos: ["AAS"]
},

  {
    nome: "Ácido fólico",
    forma: "comprimido",
    dosagem: "5 mg"
},

{
    nome: "Ácido fólico",
    forma: "gotas",
    dosagem: "0,2 mg/mL"
},

{
    nome: "Ácido folínico",
    forma: "comprimido",
    dosagem: "15 mg"
},

{
    nome: "Ácido valpróico",
    forma: "comprimido",
    dosagem: "250 mg"
},

{
    nome: "Ácido valpróico",
    forma: "comprimido",
    dosagem: "500 mg"
},

{
    nome: "Ácido valpróico",
    forma: "solução oral",
    dosagem: "50 mg/mL"
},

{
    nome: "Albendazol",
    forma: "comprimido mastigável",
    dosagem: "400 mg"
},

{
    nome: "Albendazol",
    forma: "suspensão oral",
    dosagem: "40 mg/mL"
},

{
    nome: "Alendronato de sódio",
    forma: "comprimido",
    dosagem: "70 mg"
},

{
    nome: "Algestona Acetofenida + Enantato de Estradiol",
    forma: "solução injetável",
    dosagem: "150 mg + 10 mg/mL"
},

{
    nome: "Alopurinol",
    forma: "comprimido",
    dosagem: "100 mg"
},

{
    nome: "Alopurinol",
    forma: "comprimido",
    dosagem: "300 mg"
},

{
    nome: "Ambroxol, cloridrato de",
    forma: "xarope",
    dosagem: "30 mg/5 mL"
},

{
    nome: "Aminofilina",
    forma: "comprimido",
    dosagem: "100 mg"
},

{
    nome: "Amiodarona, cloridrato de",
    forma: "comprimido",
    dosagem: "100 mg"
},

{
    nome: "Amiodarona, cloridrato de",
    forma: "comprimido",
    dosagem: "200 mg"
},

{
    nome: "Amitriptilina, cloridrato de",
    forma: "comprimido",
    dosagem: "25 mg"
},

{
    nome: "Amoxicilina + clavulanato de potássio",
    forma: "suspensão oral",
    dosagem: "50 mg + 12,5 mg/mL"
},

{
    nome: "Amoxicilina",
    forma: "cápsula",
    dosagem: "500 mg",
    sinonimos: [
        "Amoxicilina",
        "Amoxilina",
        "Amoxacilina",
        "Amoxilina 500mg"
    ]
},

{
    nome: "Amoxicilina",
    forma: "pó para suspensão oral",
    dosagem: "50 mg/mL"
},

{
    nome: "Anlodipino, besilato de",
    forma: "comprimido",
    dosagem: "5 mg",
    sinonimos: [
        "Anlodipino",
        "Amlodipino"
    ]
},

{
    nome: "Atenolol",
    forma: "comprimido",
    dosagem: "25 mg"
},

{
    nome: "Atenolol",
    forma: "comprimido",
    dosagem: "50 mg"
},

{
    nome: "Azitromicina",
    forma: "comprimido",
    dosagem: "500 mg"
},

{
    nome: "Azitromicina",
    forma: "pó para suspensão oral",
    dosagem: "40 mg/mL"
},

  {
    nome: "Babosa (Aloe vera)",
    forma: "gel ou creme",
    dosagem: "60 g",
    sinonimos: ["Aloe vera"]
},

{
    nome: "Betametasona + Gentamicina",
    forma: "creme dermatológico",
    dosagem: "30 g"
},

{
    nome: "Betametasona",
    forma: "creme dermatológico",
    dosagem: "30 g"
},

{
    nome: "Biperideno, cloridrato de",
    forma: "comprimido",
    dosagem: "2 mg"
},

{
    nome: "Bisacodil",
    forma: "comprimido",
    dosagem: "5 mg"
},

{
    nome: "Bisoprolol, fumarato de",
    forma: "comprimido",
    dosagem: "10 mg"
},

{
    nome: "Bisoprolol, fumarato de",
    forma: "comprimido",
    dosagem: "2,5 mg"
},

{
    nome: "Bromoprida",
    forma: "solução oral",
    dosagem: "4 mg/mL"
},

{
    nome: "Budesonida",
    forma: "aerossol nasal",
    dosagem: "50 mcg"
},

{
    nome: "Captopril",
    forma: "comprimido",
    dosagem: "25 mg"
},

{
    nome: "Carbamazepina",
    forma: "comprimido",
    dosagem: "200 mg"
},

{
    nome: "Carbamazepina",
    forma: "xarope",
    dosagem: "20 mg/mL"
},

{
    nome: "Carbocisteína",
    forma: "xarope",
    dosagem: "20 mg/mL"
},

{
    nome: "Carbonato de cálcio + Colecalciferol",
    forma: "comprimido",
    dosagem: "1250 mg + 400 UI"
},

{
    nome: "Carbonato de cálcio",
    forma: "comprimido",
    dosagem: "1250 mg"
},

{
    nome: "Carbonato de lítio",
    forma: "comprimido",
    dosagem: "300 mg"
},

{
    nome: "Carvedilol",
    forma: "comprimido",
    dosagem: "3,125 mg"
},

{
    nome: "Carvedilol",
    forma: "comprimido",
    dosagem: "6,25 mg"
},

{
    nome: "Carvedilol",
    forma: "comprimido",
    dosagem: "12,5 mg"
},

{
    nome: "Carvedilol",
    forma: "comprimido",
    dosagem: "25 mg"
},

{
    nome: "Cáscara Sagrada",
    forma: "cápsula",
    dosagem: "75 mg"
},

{
    nome: "Castanha da Índia",
    forma: "comprimido",
    dosagem: "100 mg"
},

{
    nome: "Cefalexina",
    forma: "cápsula",
    dosagem: "500 mg"
},

{
    nome: "Cefalexina",
    forma: "suspensão oral",
    dosagem: "50 mg/mL"
},

{
    nome: "Cetoconazol",
    forma: "creme",
    dosagem: "2%"
},

{
    nome: "Ciclobenzaprina, cloridrato de",
    forma: "comprimido",
    dosagem: "10 mg"
},

{
    nome: "Cilostazol",
    forma: "comprimido",
    dosagem: "50 mg"
},

{
    nome: "Cinarizina",
    forma: "comprimido",
    dosagem: "75 mg"
},

{
    nome: "Ciprofloxacino + Dexametasona",
    forma: "colírio",
    dosagem: "5 mL"
},

{
    nome: "Ciprofloxacino, cloridrato de",
    forma: "comprimido",
    dosagem: "500 mg"
},

{
    nome: "Claritromicina",
    forma: "cápsula ou comprimido",
    dosagem: "500 mg"
},

{
    nome: "Clindamicina, cloridrato de",
    forma: "cápsula",
    dosagem: "300 mg"
},

{
    nome: "Clomipramina, cloridrato de",
    forma: "comprimido",
    dosagem: "25 mg"
},

{
    nome: "Clonazepam",
    forma: "comprimido",
    dosagem: "2 mg"
},

{
    nome: "Clonazepam",
    forma: "solução oral",
    dosagem: "2,5 mg/mL"
},

{
    nome: "Clonidina, cloridrato de",
    forma: "comprimido",
    dosagem: "0,150 mg"
},

{
    nome: "Clopidogrel, bissulfato de",
    forma: "comprimido",
    dosagem: "75 mg"
},

{
    nome: "Cloreto de sódio + Cloreto de benzalcônio",
    forma: "solução nasal",
    dosagem: "0,9%"
},

{
    nome: "Clorpromazina, cloridrato de",
    forma: "comprimido",
    dosagem: "25 mg"
},

{
    nome: "Clorpromazina, cloridrato de",
    forma: "comprimido",
    dosagem: "100 mg"
},

{
    nome: "Clorpromazina, cloridrato de",
    forma: "solução oral",
    dosagem: "40 mg/mL"
},

{
    nome: "Colchicina",
    forma: "comprimido",
    dosagem: "0,5 mg"
},

{
    nome: "Complexo B",
    forma: "comprimido"
},

      {
        nome: "Deltametrina",
        forma: "shampoo",
        dosagem: "frasco com 100 ml"
    },
    {
        nome: "Dexametasona",
        forma: "comprimido",
        dosagem: "4 mg"
    },
    {
        nome: "Dexametasona",
        forma: "creme",
        dosagem: "0,1%, bisnaga com 10 g"
    },
    {
        nome: "Dexametasona + Neomicina + Polimixina B",
        forma: "colírio",
        dosagem: "frasco com 5 ml"
    },
    {
        nome: "Dexclorfeniramina, maleato de",
        forma: "comprimido",
        dosagem: "2 mg"
    },
    {
        nome: "Dexclorfeniramina, maleato de",
        forma: "xarope",
        dosagem: "0,4 mg/mL, frasco com 120 ml"
    },
    {
        nome: "Diazepam",
        forma: "comprimido",
        dosagem: "10 mg"
    },
    {
        nome: "Diltiazem",
        forma: "comprimido",
        dosagem: "60 mg"
    },
    {
        nome: "Digoxina",
        forma: "comprimido",
        dosagem: "0,25 mg"
    },
    {
        nome: "Dimeticona",
        forma: "solução oral",
        dosagem: "75 mg/mL, frasco com 10 ml"
    },
    {
        nome: "Dipirona Sódica",
        forma: "comprimido",
        dosagem: "500 mg"
    },
    {
        nome: "Dipirona Sódica",
        forma: "solução oral",
        dosagem: "500 mg/mL, frasco com 20 ml"
    },
    {
        nome: "Domperidona",
        forma: "comprimido",
        dosagem: "10 mg"
    },
    {
        nome: "Domperidona",
        forma: "solução oral",
        dosagem: "1 mg/mL, frasco com 100 ml"
    },
    {
        nome: "Doxazosina, mesilato de",
        forma: "comprimido",
        dosagem: "2 mg"
    },
    {
        nome: "Doxazosina, mesilato de",
        forma: "comprimido",
        dosagem: "4 mg"
    },
    {
        nome: "Doxiciclina",
        forma: "comprimido",
        dosagem: "100 mg"
    },
    {
        nome: "Duloxetina",
        forma: "comprimido",
        dosagem: "30 mg"
    },
    {
        nome: "Enalapril, maleato de",
        forma: "comprimido",
        dosagem: "10 mg"
    },
    {
        nome: "Enalapril, maleato de",
        forma: "comprimido",
        dosagem: "20 mg"
    },
    {
        nome: "Enalapril, maleato de",
        forma: "comprimido",
        dosagem: "5 mg"
    },
    {
        nome: "Escitalopram",
        forma: "comprimido",
        dosagem: "10 mg"
    },
    {
        nome: "Escopolamina",
        forma: "comprimido",
        dosagem: "10 mg"
    },
    {
        nome: "Espironolactona",
        forma: "comprimido",
        dosagem: "25 mg"
    },
    {
        nome: "Espironolactona",
        forma: "comprimido",
        dosagem: "50 mg"
    },
    {
        nome: "Estriol",
        forma: "creme vaginal",
        dosagem: "1 mg/g, bisnaga com 50 g + aplicador"
    },
    {
        nome: "Fenobarbital",
        forma: "comprimido",
        dosagem: "100 mg"
    },
    {
        nome: "Fenobarbital",
        forma: "solução oral",
        dosagem: "40 mg/mL, frasco com 20 ml"
    },
    {
        nome: "Finasterida",
        forma: "comprimido",
        dosagem: "5 mg"
    },
    {
        nome: "Fluconazol",
        forma: "cápsula",
        dosagem: "150 mg"
    },
    {
        nome: "Fluoxetina, cloridrato de",
        forma: "cápsula ou comprimido",
        dosagem: "20 mg"
    },
    {
        nome: "Furosemida",
        forma: "comprimido",
        dosagem: "40 mg"
    },
    {
        nome: "Ginkgo biloba",
        forma: "comprimido",
        dosagem: "80 mg"
    },
    {
        nome: "Gliclazida",
        forma: "comprimido de liberação controlada",
        dosagem: "30 mg"
    },
    {
        nome: "Gliclazida",
        forma: "comprimido de liberação controlada",
        dosagem: "60 mg"
    },
    {
        nome: "Glimepirida",
        forma: "comprimido",
        dosagem: "2 mg"
    },
    {
        nome: "Glimepirida",
        forma: "comprimido",
        dosagem: "4 mg"
    },
    {
        nome: "Guaco (Mikania glomerata Spreng.)",
        forma: "xarope ou solução oral",
        dosagem: "35 mg/mL, frasco com 120 ml"
    },
    {
        nome: "Haloperidol",
        forma: "comprimido",
        dosagem: "5 mg"
    },
    {
        nome: "Haloperidol",
        forma: "solução oral",
        dosagem: "2 mg/mL, frasco com 20 ml"
    },
    {
        nome: "Haloperidol decanoato",
        forma: "solução injetável",
        dosagem: "50 mg/mL, ampola com 1 ml"
    },
    {
        nome: "Heparina sódica",
        forma: "solução injetável",
        dosagem: "5.000 UI, ampola com 0,25 ml"
    },
    {
        nome: "Hidralazina, cloridrato de",
        forma: "comprimido",
        dosagem: "25 mg"
    },
    {
        nome: "Hidroclorotiazida",
        forma: "comprimido",
        dosagem: "25 mg"
    },
    {
        nome: "Hidróxido de alumínio",
        forma: "suspensão oral",
        dosagem: "100 ml"
    },
    {
        nome: "Ibuprofeno",
        forma: "suspensão oral",
        dosagem: "50 mg/mL, frasco com 30 ml"
    },
    {
        nome: "Ibuprofeno",
        forma: "comprimido",
        dosagem: "600 mg"
    },
    {
        nome: "Imipramina",
        forma: "comprimido",
        dosagem: "25 mg"
    },
    {
        nome: "Insulina Humana NPH",
        forma: "solução injetável",
        dosagem: "100 UI, frasco com 10 ml"
    },
    {
        nome: "Insulina Humana NPH",
        forma: "caneta",
        dosagem: "100 UI/mL, 3 mL"
    },
    {
        nome: "Insulina Humana Regular",
        forma: "solução injetável",
        dosagem: "100 UI, frasco com 10 ml"
    },
    {
        nome: "Insulina Humana Regular",
        forma: "caneta",
        dosagem: "100 UI/mL, 3 mL"
    },
    {
        nome: "Isoflavona de soja (Glycine max L. Merr.)",
        forma: "cápsula",
        dosagem: "75 mg"
    },
    {
        nome: "Isossorbida, mononitrato de",
        forma: "comprimido",
        dosagem: "20 mg"
    },
    {
        nome: "Isossorbida, mononitrato de",
        forma: "comprimido",
        dosagem: "40 mg"
    },
    {
        nome: "Itraconazol",
        forma: "cápsula",
        dosagem: "100 mg"
    },
    {
        nome: "Ivermectina",
        forma: "comprimido",
        dosagem: "6 mg"
    },

      {
        nome: "Lactulose",
        forma: "solução oral",
        dosagem: "667 mg/mL, frasco com 120 ml"
    },
    {
        nome: "Levodopa + Benserazida BD",
        forma: "comprimido",
        dosagem: "100 mg + 25 mg"
    },
    {
        nome: "Levodopa + Benserazida",
        forma: "cápsula gel HBS",
        dosagem: "100 mg + 25 mg"
    },
    {
        nome: "Levodopa + Benserazida",
        forma: "comprimido",
        dosagem: "200 mg + 50 mg"
    },
    {
        nome: "Levomepromazina",
        forma: "comprimido",
        dosagem: "100 mg"
    },
    {
        nome: "Levomepromazina",
        forma: "comprimido",
        dosagem: "25 mg"
    },
    {
        nome: "Levomepromazina",
        forma: "solução oral",
        dosagem: "40 mg/mL, frasco com 20 ml"
    },
    {
        nome: "Levonorgestrel + Etinilestradiol",
        forma: "comprimido",
        dosagem: "0,15 mg + 0,03 mg"
    },
    {
        nome: "Levotiroxina sódica",
        forma: "comprimido",
        dosagem: "100 mcg"
    },
    {
        nome: "Levotiroxina sódica",
        forma: "comprimido",
        dosagem: "25 mcg"
    },
    {
        nome: "Levotiroxina sódica",
        forma: "comprimido",
        dosagem: "50 mcg"
    },
    {
        nome: "Levotiroxina sódica",
        forma: "comprimido",
        dosagem: "75 mcg"
    },
    {
        nome: "Loratadina",
        forma: "comprimido",
        dosagem: "10 mg"
    },
    {
        nome: "Loratadina",
        forma: "xarope",
        dosagem: "1 mg/mL, frasco com 100 ml"
    },
    {
        nome: "Losartana potássica",
        forma: "comprimido",
        dosagem: "50 mg"
    },
    {
        nome: "Medroxiprogesterona + Estradiol cipionato",
        forma: "solução injetável",
        dosagem: "25 mg + 5 mg/0,5 mL, ampola com 1 mL"
    },
    {
        nome: "Medroxiprogesterona, acetato de",
        forma: "solução injetável",
        dosagem: "150 mg/mL, ampola com 1 mL"
    },
    {
        nome: "Metformina, cloridrato de",
        forma: "comprimido",
        dosagem: "500 mg"
    },
    {
        nome: "Metformina, cloridrato de",
        forma: "comprimido",
        dosagem: "850 mg"
    },
    {
        nome: "Metildopa",
        forma: "comprimido",
        dosagem: "250 mg"
    },
    {
        nome: "Metilfenidato",
        forma: "comprimido",
        dosagem: "10 mg"
    },
    {
        nome: "Metoprolol succinato",
        forma: "comprimido de liberação controlada",
        dosagem: "100 mg"
    },
    {
        nome: "Metoprolol succinato",
        forma: "comprimido de liberação controlada",
        dosagem: "25 mg"
    },
    {
        nome: "Metoprolol succinato",
        forma: "comprimido de liberação controlada",
        dosagem: "50 mg"
    },
    {
        nome: "Metronidazol (benzoilmetronidazol)",
        forma: "suspensão oral",
        dosagem: "40 mg/mL, frasco com 100 ml"
    },
    {
        nome: "Metronidazol",
        forma: "comprimido",
        dosagem: "250 mg"
    },
    {
        nome: "Metronidazol",
        forma: "gel vaginal",
        dosagem: "100 mg/g, tubo com 50 g + aplicador"
    },
    {
        nome: "Naltrexona, cloridrato de",
        forma: "comprimido",
        dosagem: "50 mg"
    },
    {
        nome: "Neomicina + Fluocinolona + Polimixina B + Lidocaína",
        forma: "solução otológica",
        dosagem: "frasco com 10 ml"
    },
    {
        nome: "Neomicina + Bacitracina",
        forma: "pomada dermatológica",
        dosagem: "5 mg + 250 UI, tubo com 15 g"
    },
    {
        nome: "Nifedipino",
        forma: "comprimido",
        dosagem: "20 mg"
    },
    {
        nome: "Nimesulida",
        forma: "comprimido",
        dosagem: "100 mg"
    },
    {
        nome: "Nirmatrelvir/Ritonavir",
        forma: "comprimido",
        dosagem: "150 mg/100 mg"
    },
    {
        nome: "Nistatina",
        forma: "creme vaginal",
        dosagem: "100.000 UI/4 g, tubo com 60 g + aplicador"
    },
    {
        nome: "Nistatina",
        forma: "suspensão oral",
        dosagem: "100.000 UI/mL, frasco com 50 ml"
    },
    {
        nome: "Nitrazepam",
        forma: "comprimido",
        dosagem: "5 mg"
    },
    {
        nome: "Nitrofurantoína",
        forma: "cápsula",
        dosagem: "100 mg"
    },
    {
        nome: "Noretisterona",
        forma: "comprimido",
        dosagem: "0,35 mg"
    },
    {
        nome: "Noretisterona + Estradiol valerato",
        forma: "solução injetável",
        dosagem: "50 mg + 5 mg, seringa com 1 mL"
    },
    {
        nome: "Norfloxacino",
        forma: "comprimido",
        dosagem: "400 mg"
    },
    {
        nome: "Nortriptilina, cloridrato de",
        forma: "cápsula",
        dosagem: "25 mg"
    },
    {
        nome: "Óleo mineral",
        forma: "solução oral",
        dosagem: "frasco com 100 mL"
    },
    {
        nome: "Omeprazol",
        forma: "cápsula",
        dosagem: "20 mg"
    },
    {
        nome: "Ondansetrona, cloridrato de",
        forma: "comprimido",
        dosagem: "4 mg"
    },
    {
        nome: "Ondansetrona, cloridrato de",
        forma: "comprimido",
        dosagem: "8 mg"
    },
    {
        nome: "Oseltamivir",
        forma: "cápsula",
        dosagem: "30 mg"
    },
    {
        nome: "Oseltamivir",
        forma: "cápsula",
        dosagem: "45 mg"
    },
    {
        nome: "Oseltamivir",
        forma: "cápsula",
        dosagem: "75 mg"
    },
    {
        nome: "Óxido de zinco + Colecalciferol + Retinol",
        forma: "pomada dermatológica",
        dosagem: "tubo com 45 g"
    },
    {
        nome: "Paracetamol",
        forma: "comprimido",
        dosagem: "500 mg"
    },
    {
        nome: "Paracetamol",
        forma: "solução oral",
        dosagem: "200 mg/mL, frasco com 15 ml"
    },
    {
        nome: "Passiflora incarnata",
        forma: "cápsula ou comprimido",
        dosagem: "260 mg"
    },
    {
        nome: "Periciazina",
        forma: "solução oral",
        dosagem: "1%, frasco com 20 ml"
    },
    {
        nome: "Periciazina",
        forma: "solução oral",
        dosagem: "4%, frasco com 20 ml"
    },
    {
        nome: "Permetrina",
        forma: "loção",
        dosagem: "5 mg/g (5%)"
    },
    {
        nome: "Pirimetamina",
        forma: "comprimido",
        dosagem: "25 mg"
    },
    {
        nome: "Plantago ovata",
        forma: "envelope",
        dosagem: "3,5 g"
    },
    {
        nome: "Polivitamínicos + Sais minerais",
        forma: "comprimido"
    },
    {
        nome: "Prednisolona",
        forma: "colírio",
        dosagem: "1%, frasco com 5 ml"
    },
    {
        nome: "Prednisolona fosfato sódico",
        forma: "solução oral",
        dosagem: "3 mg/mL, frasco com 60 ml"
    },
    {
        nome: "Prednisona",
        forma: "comprimido",
        dosagem: "20 mg"
    },
    {
        nome: "Prednisona",
        forma: "comprimido",
        dosagem: "5 mg"
    },
    {
        nome: "Prometazina",
        forma: "comprimido",
        dosagem: "25 mg"
    },
    {
        nome: "Propafenona, cloridrato de",
        forma: "comprimido",
        dosagem: "300 mg"
    },
    {
        nome: "Propatilnitrato",
        forma: "comprimido",
        dosagem: "10 mg"
    },
    {
        nome: "Propiltiouracila",
        forma: "comprimido",
        dosagem: "100 mg"
    },
    {
        nome: "Propranolol, cloridrato de",
        forma: "comprimido",
        dosagem: "40 mg"
    },
    {
        nome: "Protetor Solar",
        forma: "FPS 50",
        dosagem: "frasco com 100 ml"
    },

      {
        nome: "Ramipril",
        forma: "comprimido sulcado",
        dosagem: "5 mg"
    },
    {
        nome: "Retinol acetato + Colecalciferol",
        forma: "solução oral",
        dosagem: "50.000 UI + 10.000 UI, frasco gotejador com 10 ml"
    },
    {
        nome: "Risperidona",
        forma: "comprimido",
        dosagem: "2 mg"
    },
    {
        nome: "Sais para reidratação oral",
        forma: "pó para solução oral",
        dosagem: "envelope com 27,9 g"
    },
    {
        nome: "Salbutamol, sulfato de",
        forma: "aerossol",
        dosagem: "100 mcg/dose"
    },
    {
        nome: "Secnidazol",
        forma: "comprimido",
        dosagem: "1000 mg"
    },
    {
        nome: "Sertralina",
        forma: "comprimido",
        dosagem: "50 mg"
    },
    {
        nome: "Sinvastatina",
        forma: "comprimido",
        dosagem: "20 mg"
    },
    {
        nome: "Sulfadiazina de prata",
        forma: "creme",
        dosagem: "1%, tubo com 30 g"
    },
    {
        nome: "Sulfametoxazol + Trimetoprima",
        forma: "comprimido",
        dosagem: "400 mg + 80 mg"
    },
    {
        nome: "Sulfametoxazol + Trimetoprima",
        forma: "suspensão oral",
        dosagem: "40 mg + 8 mg/mL, frasco com 100 ml"
    },
    {
        nome: "Sulfato ferroso",
        forma: "comprimido",
        dosagem: "40 mg Fe++"
    },
    {
        nome: "Sulfato ferroso",
        forma: "solução oral",
        dosagem: "25 mg/mL Fe++, frasco com 30 ml"
    },
    {
        nome: "Tiamina, cloridrato de",
        forma: "comprimido",
        dosagem: "300 mg"
    },
    {
        nome: "Tioridazina",
        forma: "comprimido",
        dosagem: "100 mg"
    },
    {
        nome: "Tobramicina",
        forma: "colírio",
        dosagem: "0,3%, frasco com 5 ml"
    },
    {
        nome: "Tramadol, cloridrato de",
        forma: "cápsula",
        dosagem: "50 mg"
    },
    {
        nome: "Tramadol, cloridrato de",
        forma: "solução oral",
        dosagem: "100 mg/mL, frasco com 15 ml"
    },
    {
        nome: "Varfarina sódica",
        forma: "comprimido",
        dosagem: "5 mg"
    },
    {
        nome: "Verapamil, cloridrato de",
        forma: "comprimido",
        dosagem: "80 mg"
    },
    {
        nome: "Zinco, sulfato de",
        forma: "xarope",
        dosagem: "4 mg/mL, frasco com 100 ml"
    }
];
