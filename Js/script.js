

carregarMoedas();

async function carregarMoedas() {
    const url = 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$format=json&$select=simbolo,nomeFormatado';
    const listaMoedasOrigem = document.getElementById("IdMoedasOrigem");
    const listaMoedasDestino = document.getElementById("IdMoedasDestino");

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Erro ao carregar moedas. Código de erro: ' + response.status);
        }

        const moedas = await response.json();

        for (const moeda of moedas.value) {
            const optionMoeda = new Option(moeda.nomeFormatado, moeda.simbolo);
            listaMoedasOrigem.appendChild(optionMoeda);
            listaMoedasDestino.appendChild(optionMoeda.cloneNode(true));
        }
    } catch (error) {
        alert(error.message);
    }
}

async function calcularCotacao() {
    const moedaOrigem = document.getElementById("IdMoedasOrigem").value;
    const moedaDestino = document.getElementById("IdMoedasDestino").value;
    const valorConverter = document.getElementById("valorConverterInput").value;
    const saidaTextArea = document.getElementById("saidaTextArea");

    if (moedaOrigem === moedaDestino) {
        alert("Escolha moedas diferentes.");
        return;
    }

    const dataAtual = obterDataFormatada();
const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@moeda='${moedaOrigem}'&@dataInicial='${dataAtual}'&@dataFinalCotacao='${dataAtual}'&$top=100&$format=json&$select=paridadeCompra,paridadeVenda,cotacaoCompra,cotacaoVenda,dataHoraCotacao,tipoBoletim`;

    
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Erro ao obter cotação. Código de erro: ' + response.status);
        }

        const data = await response.json();
        const cotacao = data.value[0];
        const valorPagar = valorConverter / cotacao.cotacaoCompra;
        saidaTextArea.value = `${valorConverter} ${moedaOrigem} custam ${valorPagar.toFixed(3)} ${moedaDestino}.`;
    } catch (error) {
        alert(error.message);
    }
}
function obterDataFormatada() {
    const hoje = new Date();
    const dd = String(hoje.getDate()).padStart(2, '0');
    const mm = String(hoje.getMonth() + 1).padStart(2, '0'); // O mês é base 0, então adicionei 1.
    const yyyy = hoje.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
}


