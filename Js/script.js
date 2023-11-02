// Função para carregar a lista de moedas (tanto origem quanto destino)
function carregarMoedas(datalistId) {
    // Obtém o elemento de entrada (moedaOrigemInput ou moedaDestinoInput) e o elemento datalist correspondente
    let inputElement = document.getElementById(datalistId);
    let datalist = document.getElementById(datalistId);

    // Cria uma nova solicitação XMLHttpRequest
    let xhr = new XMLHttpRequest();

    // Abre uma solicitação GET para a API do Banco Central (Note que você pode enfrentar problemas com chamadas de API para outro domínio)
    xhr.open('GET', 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$format=json&$select=simbolo,nomeFormatado');

    // Adiciona um evento para lidar com a resposta da solicitação
    xhr.addEventListener('load', function () {
        // Verifica se a resposta da solicitação foi bem-sucedida (status 200)
        if (xhr.status === 200) {
            // Analisa os dados JSON da resposta
            let moedas = JSON.parse(xhr.responseText).value;

            // Limpa o datalist para evitar duplicatas
            datalist.innerHTML = '';

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