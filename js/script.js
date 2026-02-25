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
            let item = document.createElement("li");

            item.innerHTML = `
                ${mov.data} | 
                ${mov.descricao} | 
                ${mov.categoria} | 
                R$ ${mov.valor.toFixed(2)}
            `;

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