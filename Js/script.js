        // Função para carregar a lista de moedas (tanto origem quanto destino)
        function carregarMoedas(datalistId) {
            let inputElement = document.getElementById(datalistId);
            let datalist = document.getElementById(datalistId);

            // Cria uma nova solicitação XMLHttpRequest
            let xhr = new XMLHttpRequest();

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

        // Função para calcular a cotação
        function calcularCotacao() {
            let moedaOrigemInput = document.getElementById("moedaOrigemInput");
            let moedaDestinoInput = document.getElementById("moedaDestinoInput");
            let valorConverterInput = document.getElementById("valorConverterInput");
            let compraRadio = document.getElementById("compraRadio");
            let vendaRadio = document.getElementById("vendaRadio");
            let saidaTextArea = document.getElementById("saidaTextArea");

            // Obtenha os valores selecionados
            let moedaOrigem = moedaOrigemInput.value;
            let moedaDestino = moedaDestinoInput.value;
            let valor = valorConverterInput.value;
            let tipoCotacao = compraRadio.checked ? "compra" : "venda";

            // Faça uma solicitação XMLHttpRequest para obter a cotação
            let xhr = new XMLHttpRequest();

            xhr.open('GET', 'https://cors-anywhere.herokuapp.com/https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia' +
                `(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='${moedaOrigem}'&@dataCotacao='${dataFormatada}'&` +
                `$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,tipoBoletim`);

            xhr.addEventListener('load', function () {
                if (xhr.status === 200) {
                    let cotacaoData = JSON.parse(xhr.responseText).value;

                    // Encontre o valor de compra ou venda com base no tipoCotacao
                    let cotacao = tipoCotacao === "compra" ? cotacaoData.cotacaoCompra : cotacaoData.cotacaoVenda;

                    // Realize o cálculo da conversão
                    let resultado = valor * cotacao;

                    // Exiba o resultado na textarea
                    saidaTextArea.value = `Valor convertido: ${resultado} ${moedaDestino}`;
                } else {
                    saidaTextArea.value = "Erro ao obter a cotação.";
                }
            });

            xhr.send();
        }

        var dataAtual = new Date();
        var dia = dataAtual.getDate();
        var mes = dataAtual.getMonth() + 1;
        var ano = dataAtual.getFullYear();
        var dataFormatada = dia + '-' + mes + '-' + ano;

        // Adicione o evento de clique ao botão "Converter"
        document.getElementById("convertButton").addEventListener("click", calcularCotacao);