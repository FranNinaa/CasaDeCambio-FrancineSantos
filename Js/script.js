// Define as URLs dos endpoints para obter informações sobre moedas e cotações
const endPointMoedas = "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$format=json";
const endPointCotacao = "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@moeda=@moeda&@dataInicial=@dataInicial&@dataFinalCotacao=@dataFinalCotacao&$top=100&$format=json&$select=paridadeCompra,paridadeVenda,cotacaoCompra,cotacaoVenda,dataHoraCotacao,tipoBoletim";

// Função assíncrona para preencher as opções nos seletores de moedas no HTML
async function preencherOptions() {
    const respostaEndPoint = await fetch(endPointMoedas);
    const moedas = await respostaEndPoint.json();

    const moedaOrigemSelect = document.querySelector("#IdMoedasOrigem");
    const moedaDestinoSelect = document.querySelector("#IdMoedasDestino");

    // Preenche as opções dos seletores de moedas com os dados obtidos
    moedas.value.forEach((moeda) => {
        moedaOrigemSelect.innerHTML += `<option value="${moeda.simbolo}">${moeda.nomeFormatado}</option>`;
        moedaDestinoSelect.innerHTML += `<option value="${moeda.simbolo}">${moeda.nomeFormatado}</option>`;
    });
}

// Chama a função para preencher as opções dos seletores de moedas
preencherOptions();

// Função assíncrona para calcular a cotação de moedas
async function calcularCotacao() {
    const moedaOrigem = document.querySelector("#IdMoedasOrigem").value;
    const moedaDestino = document.querySelector("#IdMoedasDestino").value;
    const valorDesejado = parseFloat(document.querySelector("#valorConverterInput").value);

    // Verifica se o valor inserido é um número válido
    if (isNaN(valorDesejado)) {
        alert("Insira um valor válido.");
        return;
    }

    // Verifica se as moedas selecionadas são diferentes
    if (moedaOrigem === moedaDestino) {
        alert("Insira moedas diferentes.");
        return;
    }

    // Obtém a data atual formatada
    const dataAtual = obterDataAtualFormatada();

    // Obtém as cotações das moedas de origem estrangeira
    const cotacaoMoedaOrigem = await obterCotacaoMoeda(moedaOrigem, dataAtual);
    const cotacaoMoedaDestino = await obterCotacaoMoeda(moedaDestino, dataAtual);

    // Verifica se as cotações foram obtidas com sucesso
    if (!cotacaoMoedaOrigem || !cotacaoMoedaDestino) {
        alert("Não foi possível obter cotações para as moedas selecionadas.");
        return;
    }

    // Calcula o valor em reais e o valor a ser pago na moeda estrangeira
    const valorReais = valorDesejado / cotacaoMoedaOrigem.cotacaoCompra;
    const valorPagar = valorReais * cotacaoMoedaDestino.cotacaoVenda;

    // Exibe o resultado no elemento de saída
    document.querySelector("#saidaTextArea").value = `${valorDesejado} ${moedaOrigem} custam ${valorPagar.toFixed(3)} ${moedaDestino}.`;
}

// Função para obter a cotação de uma moeda em uma data específica
async function obterCotacaoMoeda(moeda, data) {
    const respostaCotacaoEndPoint = await fetch(endPointCotacao.replace(/@moeda/g, `'${moeda}'`).replace(/@dataInicial/g, `'${data}'`).replace(/@dataFinalCotacao/g, `'${data}'`));
    const cotacao = await respostaCotacaoEndPoint.json();

    // Verifica se a resposta está vazia e retorna null se não houver cotações
    if (cotacao.value.length === 0) {
        return null;
    }

    // Retorna a primeira cotação encontrada
    return cotacao.value[0];
}

// Função para obter a data atual formatada no formato 'dd-mm-yyyy'
function obterDataAtualFormatada() {
    const hoje = new Date();
    const dd = String(hoje.getDate()).padStart(2, '0');
    const mm = String(hoje.getMonth() + 1).padStart(2, '0');
    const yyyy = hoje.getFullYear();

    return `${dd}-${mm}-${yyyy}`;
}
