// =====================================================
// 🧠 ARRAY PRINCIPAL DO SISTEMA
// =====================================================
// Este é o "coração" do sistema.
// Todas as movimentações ficam armazenadas aqui.
//
// Se existir algo salvo no navegador (localStorage),
// ele carrega.
// Caso contrário, começa com array vazio.

let movimentacoes = JSON.parse(localStorage.getItem("movimentacoes")) || [];


// =====================================================
// 📊 VARIÁVEL GLOBAL DO GRÁFICO
// =====================================================
// Guardamos aqui a instância do gráfico.
// Isso permite destruir e recriar sem duplicar.

let grafico;


// =====================================================
// 🔐 1️⃣ FUNÇÃO DE LOGIN
// =====================================================

function login() {

    let usuario = document.getElementById("usuario").value;
    let senha = document.getElementById("senha").value;
    let mensagem = document.getElementById("mensagem");

    if (usuario === "admin" && senha === "1234") {

        mensagem.style.color = "green";
        mensagem.innerHTML = "Login bem-sucedido!";

        // Marca usuário como logado
        localStorage.setItem("logado", "true");

        // Redireciona para página principal
        setTimeout(() => {
            window.location.href = "html/page.html";
        }, 1000);

    } else {
        mensagem.style.color = "red";
        mensagem.innerHTML = "Usuário ou senha incorretos!";
    }
}


// =====================================================
// 🔒 2️⃣ PROTEÇÃO DA PAGE.HTML
// =====================================================

if (window.location.pathname.includes("page.html")) { // Segurança: só permite acesso se estiver logado

    // Se não estiver logado, volta para index
    if (localStorage.getItem("logado") !== "true") {
        window.location.href = "../index.html";
    }


    // =====================================================
    // ➕ 3️⃣ FUNÇÃO ADICIONAR MOVIMENTAÇÃO
    // =====================================================

    window.adicionarMovimentacao = function () {

        // 🔹 Captura dados do formulário
        let descricao = document.getElementById("descricao").value;
        let valor = parseFloat(document.getElementById("valor").value);
        let tipo = document.getElementById("tipo").value;
        let categoria = document.getElementById("categoria").value;
        let data = document.getElementById("data").value;

        // 🔹 Validação básica
        if (!descricao || isNaN(valor) || valor <= 0 || !data) {
            alert("Preencha todos os campos corretamente.");
            return;
        }

        // 🔹 Criação do objeto movimentação
        let novaMovimentacao = {
            id: Date.now(),  // Gera ID único baseado no tempo
            descricao,
            valor,
            tipo,
            categoria,
            data
        };

        // 🔹 Adiciona no array principal
        movimentacoes.push(novaMovimentacao);

        // 🔹 Salva no navegador
        localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes));

        // 🔹 Atualiza toda a interface
        atualizarInterface();

        // 🔹 Limpa campos
        document.getElementById("descricao").value = "";
        document.getElementById("valor").value = "";
    };


    // =====================================================
    // 🧹 4️⃣ FUNÇÃO LIMPAR CAIXA
    // =====================================================

    window.limparCaixa = function () {

        if (confirm("Tem certeza que deseja limpar todas as movimentações?")) {

            movimentacoes = [];

            localStorage.removeItem("movimentacoes");

            atualizarInterface();
        }
    };

    // ... código anterior da função limparCaixa ...

// =====================================================
// 🗑️ 4.1️⃣ FUNÇÃO EXCLUIR MOVIMENTAÇÃO INDIVIDUAL
// =====================================================
window.excluirMovimentacao = function (id) {
    // 1. Abre a caixa de confirmação e guarda a resposta
    const desejaExcluir = confirm("Você tem certeza que deseja excluir esta movimentação?");

    // 2. Só prossegue se a resposta for verdadeira (clique no OK)
    if (desejaExcluir) {
        // Remove o item do array
        movimentacoes = movimentacoes.filter(mov => mov.id !== id); /* Filtro para remover o item com o ID correspondente */

        // Atualiza o banco de dados local
        localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes)); /* Salva o array atualizado no localStorage */

        // Renderiza a lista novamente
        atualizarInterface();
    }
};

// ... (outras funções)

// Lógica da Busca
const inputBusca = document.getElementById("inputBusca");

inputBusca.addEventListener("input", () => {
    const termoBusca = inputBusca.value.toLowerCase();

    // Filtra as movimentações que contêm o termo na descrição OU na categoria
    const movimentacoesFiltradas = movimentacoes.filter(mov => 
        mov.descricao.toLowerCase().includes(termoBusca) || 
        mov.categoria.toLowerCase().includes(termoBusca)
    );

    // Agora precisamos mandar essa lista filtrada para a tela
    atualizarInterface(movimentacoesFiltradas); 
});


// ... segue para a função atualizarInterface ...

    // =====================================================
    // 🔄 5️⃣ FUNÇÃO ATUALIZAR INTERFACE
    // =====================================================
    // Responsável por:
    // - Recalcular totais
    // - Atualizar listas
    // - Atualizar resumo
    // - Atualizar gráfico

    function atualizarInterface() {

        let totalEntradas = 0;
        let totalSaidas = 0;

        let listaEntradas = document.getElementById("listaEntradas");
        let listaSaidas = document.getElementById("listaSaidas");
        let listaCategorias = document.getElementById("listaCategorias");
        let listaDatas = document.getElementById("listaDatas");

        // Limpa listas antes de recriar
        listaEntradas.innerHTML = "";
        listaSaidas.innerHTML = "";
        listaCategorias.innerHTML = "";
        listaDatas.innerHTML = "";

        // Percorre todas as movimentações
        movimentacoes.forEach(mov => {

            // 🔹 Soma valores
            if (mov.tipo === "entrada") {
                totalEntradas += mov.valor;
            } else {
                totalSaidas += mov.valor;
            }


            // 🔹 Cria item visual
            let item = document.createElement("li"); /*🔹 Cria item visual*/

            // Adicionamos estas linhas para o CSS funcionar:
            if (mov.tipo === "entrada") {
                item.classList.add("classe-entrada"); // 🟢
            } else {
                item.classList.add("classe-saida");   // 🔴
            }

          item.innerHTML = `
    <span class="info-data">${mov.data}</span>
    <span class="info-descricao">${mov.descricao}</span>
    <span class="info-categoria">${mov.categoria}</span>
    <span class="info-valor">R$ ${mov.valor.toFixed(2)}</span>
    <button class="btn-excluir" onclick="excluirMovimentacao(${mov.id})">🗑️</button>
`;



//  o span vai dar uma quebra no texto criando espaçamento entre os campos, e as classes info-data, info-descricao, etc, permitem estilizar cada parte individualmente no CSS. Assim, o layout fica mais organizado e visualmente agradável.



    //         item.innerHTML = `
    // ${mov.data} | 
    // ${mov.descricao} | 
    // ${mov.categoria} |
    // R$ ${mov.valor.toFixed(2)} 

            /*🔹 Cria item visual
            let item = document.createElement("li");

            item.innerHTML = `
                ${mov.data} | 
                ${mov.descricao} | 
                ${mov.categoria} | 
                R$ ${mov.valor.toFixed(2)}
            `;*/



            // 🔹 Adiciona na lista correta
            if (mov.tipo === "entrada") {
                listaEntradas.appendChild(item);
            } else {
                listaSaidas.appendChild(item);
            }

            // 🔹 Atualiza categoria e data
            let itemCategoria = document.createElement("li");
            itemCategoria.innerText = mov.categoria;
            listaCategorias.appendChild(itemCategoria);

            let itemData = document.createElement("li");
            itemData.innerText = mov.data;
            listaDatas.appendChild(itemData);

        });

        // 🔹 Atualiza resumo financeiro
        document.getElementById("totalEntradas").innerText = totalEntradas.toFixed(2);
        document.getElementById("totalSaidas").innerText = totalSaidas.toFixed(2);
        document.getElementById("saldo").innerText =
            (totalEntradas - totalSaidas).toFixed(2);

        document.getElementById("totalMovimentacoes").innerText =
            movimentacoes.length;

        // 🔹 Atualiza gráfico automaticamente
        atualizarGrafico(totalEntradas, totalSaidas);
    }


    // =====================================================
    // 📊 6️⃣ FUNÇÃO ATUALIZAR GRÁFICO
    // =====================================================

    function atualizarGrafico(totalEntradas, totalSaidas) {

        const ctx = document.getElementById("graficoFinanceiro");

        if (!ctx) return; // Segurança: evita erro se canvas não existir

        // Destroi gráfico anterior se existir
        if (grafico) {
            grafico.destroy();
        }

        grafico = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Entradas', 'Saídas'],
                datasets: [{
                    label: 'Resumo Financeiro',
                    data: [totalEntradas, totalSaidas],
                    backgroundColor: [
                        'rgba(46, 125, 50, 0.7)',
                        'rgba(198, 40, 40, 0.7)'
                    ],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }


    // =====================================================
    // 🚀 7️⃣ INICIALIZAÇÃO AO CARREGAR PÁGINA
    // =====================================================

    atualizarInterface();
}