carregarMoedas();
function carregarMoedas() {
    // Cria uma nova solicitação XMLHttpRequest
    let xhr = new XMLHttpRequest();

    xhr.open('GET', 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$format=json&$select=simbolo,nomeFormatado');

    // Adiciona um evento para lidar com a resposta da solicitação
    xhr.addEventListener('load', function () {
            let resposta = xhr.responseText
            let moedas = JSON.parse(resposta)
            console.log(moedas);

            //carrega moedas no select da tela
            let listaMoedas = document.getElementById("IdMoedas");
            for (let i = 0; i < moedas.value.length; i++){
                console.log(moedas.value[i].simbolo)

                let optionMoeda = document.createElement("option")
                optionMoeda.value = moedas.value[i].simbolo;
                optionMoeda.innerText = moedas.value[i].nomeFormatado;

                listaMoedas.appendChild(optionMoeda);

            }
        }
    );
    // Envia a solicitação para obter a lista de moedas
    xhr.send();
}
