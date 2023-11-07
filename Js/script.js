carregarMoedas();

function carregarMoedas() {
    const url = 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$format=json&$select=simbolo,nomeFormatado';
    const listaMoedas = document.getElementById("IdMoedas");

    // Usando o método fetch para obter os dados da API
    fetch(url)
        .then(response => {
            if (!response.ok) {
                // Em caso de erro, lança um erro e interrompe o processo
                throw new Error('Erro ao carregar moedas. Código de erro: ' + response.status);
            }
            // Se a resposta for bem-sucedida, analisa o JSON
            return response.json();
        })
        .then(moedas => {
            console.log(moedas);

            // Preenche o select na tela com as moedas obtidas
            for (const moeda of moedas.value) {
                console.log(moeda.simbolo);

                // Cria um elemento <option> para cada moeda
                const optionMoeda = new Option(moeda.nomeFormatado, moeda.simbolo);
                listaMoedas.appendChild(optionMoeda);
            }
        })
        .catch(error => {
            // Trata erros exibindo uma mensagem de alerta
            alert(error.message);
        });
}
