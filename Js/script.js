// Função para carregar a lista de moedas da origem
function carregarMoedas() {
    // Obtém o elemento de entrada "Moeda de Origem" e o elemento datalist correspondente
    let moedaOrigemInput = document.getElementById('moedaOrigemInput');
    let datalist = document.getElementById('idMoedaOrigem');

    // Cria uma nova solicitação XMLHttpRequest
    let xhr = new XMLHttpRequest();

    // Abre uma solicitação GET para a API do Banco Central
    xhr.open('GET', 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$format=json&$select=simbolo,nomeFormatado');

    // Adiciona um evento para lidar com a resposta da solicitação
    xhr.addEventListener('load', function () {
        // Verifica se a resposta da solicitação foi bem-sucedida (status 200)
        if (xhr.status === 200) {
            // Analisa os dados JSON da resposta
            let moedas = JSON.parse(xhr.responseText).value;

            // Itera sobre a lista de moedas e adiciona opções ao elemento datalist
            moedas.forEach(moeda => {
                let option = document.createElement('option');
                option.value = moeda.simbolo + ' (' + moeda.nomeFormatado + ')';
                datalist.appendChild(option);
            });
        }
    });
    // Envia a solicitação para obter a lista de moedas
    xhr.send();
}