      // Define as URLs dos endpoints para obter informações sobre moedas e cotações
      const endPointMoedas = "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$format=json";
      const endPointCotacao = "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@moeda=@moeda&@dataInicial=@dataInicial&@dataFinalCotacao=@dataFinalCotacao&$top=100&$format=json&$select=paridadeCompra,paridadeVenda,cotacaoCompra,cotacaoVenda,dataHoraCotacao,tipoBoletim";

      // Função para preencher as opções dos seletores de moedas
      function preencherOptions(callback) {
          const moedaOrigemSelect = document.querySelector("#IdMoedasOrigem");
          const moedaDestinoSelect = document.querySelector("#IdMoedasDestino");

          // Cria uma função de callback para preencher as opções das moedas
          function preencherMoedas(moedas) {
              moedas.value.forEach((moeda) => {
                  moedaOrigemSelect.innerHTML += `<option value="${moeda.simbolo}">${moeda.nomeFormatado}</option>`;
                  moedaDestinoSelect.innerHTML += `<option value="${moeda.simbolo}">${moeda.nomeFormatado}</option>`;
              });

              // Executa a função de callback
              callback();
          }

          // Faz a requisição AJAX para obter a lista de moedas usando XMLHttpRequest
          const xhr = new XMLHttpRequest();
          xhr.open("GET", endPointMoedas, true);
          xhr.onreadystatechange = function () {
              if (xhr.readyState === 4 && xhr.status === 200) {
                  const moedas = JSON.parse(xhr.responseText);
                  preencherMoedas(moedas);
              }
          };
          xhr.send();
      }

      // Função para calcular a cotação de moedas
      function calcularCotacao() {
          const moedaOrigem = document.querySelector("#IdMoedasOrigem").value;
          const moedaDestino = document.querySelector("#IdMoedasDestino").value;
          const valorDesejado = parseFloat(document.querySelector("#valorConverterInput").value);

          // Verifica se o valor inserido e se é um número válido
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

          // Chama a função para obter as cotações das moedas de origem e destino
          obterCotacaoMoeda(moedaOrigem, dataAtual, (cotacaoMoedaOrigem) => {
              obterCotacaoMoeda(moedaDestino, dataAtual, (cotacaoMoedaDestino) => {
                  if (!cotacaoMoedaOrigem || !cotacaoMoedaDestino) {
                      alert("Não foi possível obter cotações para as moedas selecionadas.");
                      return;
                  }

                  const valorReais = valorDesejado / cotacaoMoedaOrigem.cotacaoCompra;
                  const valorPagar = valorReais * cotacaoMoedaDestino.cotacaoVenda;

                  document.querySelector("#saidaTextArea").value = `${valorDesejado} ${moedaOrigem} custam ${valorPagar.toFixed(3)} ${moedaDestino}.`;
                  // Exibe também a saída no console log
                  console.log(`${valorDesejado} ${moedaOrigem} custam ${valorPagar.toFixed(3)} ${moedaDestino}.`);
              });
          });
      }

      // Função para obter a cotação de uma moeda em uma data específica
      function obterCotacaoMoeda(moeda, data, callback) {
          const endpoint = endPointCotacao.replace(/@moeda/g, `'${moeda}'`).replace(/@dataInicial/g, `'${data}'`).replace(/@dataFinalCotacao/g, `'${data}'`);

          // Faz a requisição AJAX para obter a cotação da moeda usando XMLHttpRequest
          const xhr = new XMLHttpRequest();
          xhr.open("GET", endpoint, true);
          xhr.onreadystatechange = function () {
              if (xhr.readyState === 4 && xhr.status === 200) {
                  const cotacao = JSON.parse(xhr.responseText);
                  if (cotacao.value.length === 0) {
                      callback(null);
                  } else {
                      callback(cotacao.value[0]);
                  }
              }
          };
          xhr.send();
      }

      // Função para obter a data atual formatada no formato 'dd-mm-yyyy'
      function obterDataAtualFormatada() {
          const hoje = new Date();
          const dd = String(hoje.getDate()).padStart(2, '0');
          const mm = String(hoje.getMonth() + 1).padStart(2, '0');
          const yyyy = hoje.getFullYear();

          return `${dd}-${mm}-${yyyy}`;
      }

      // Chama a função para preencher as opções dos seletores de moedas
      preencherOptions(() => {
      });
