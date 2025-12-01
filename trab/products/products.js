function criar_produto(produto, isFromAPI = false) {
    let div_card = document.createElement('div')
    div_card.setAttribute('class', 'card')
    div_card.setAttribute('data-titulo', produto.titulo);
    
    let div_card_img = document.createElement('div')
    div_card_img.setAttribute('class', 'card-img')
    
    if (produto.foto && produto.foto !== '') {
        div_card_img.style.backgroundImage = `url('${produto.foto}')`
        div_card_img.style.backgroundSize = 'cover'
        div_card_img.style.backgroundPosition = 'center'
    } else {
        div_card_img.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white;">
                <i class="fas fa-image" style="font-size: 3rem;"></i>
            </div>
        `;
    }
    
    div_card.appendChild(div_card_img)
    let div_card_content = document.createElement('div')
    div_card_content.setAttribute('class', 'card-content')
    div_card.appendChild(div_card_content)
    let h3_title = document.createElement('h3')
    h3_title.setAttribute('class', 'card-title')
    h3_title.textContent = produto.titulo || produto.nome
    div_card_content.appendChild(h3_title)
    let div_price = document.createElement('div')
    div_price.setAttribute('class', 'card-price')
    div_price.textContent = `R$ ${produto.preco}`
    div_card_content.appendChild(div_price)
    let div_brand = document.createElement('div')
    div_brand.setAttribute('class', 'card-brand')
    div_brand.textContent = `Marca: ${produto.marca}`
    div_card_content.appendChild(div_brand)
    let div_category = document.createElement('div')
    div_category.setAttribute('class', 'card-category')
    div_category.textContent = `Categoria: ${produto.categoria}`
    div_card_content.appendChild(div_category)
    let p_description = document.createElement('p')
    p_description.setAttribute('class', 'card-description')
    p_description.textContent = produto.descricao
    div_card_content.appendChild(p_description)
    let div_actions = document.createElement('div')
    div_actions.setAttribute('class', 'card-actions')
    div_card_content.appendChild(div_actions)
    
    // Botão de Editar
    let btn_edit = document.createElement('button')
    btn_edit.setAttribute('class', 'btn btn-success')
    btn_edit.innerHTML = '<i class="fas fa-edit"></i> Editar'
    btn_edit.setAttribute('data-titulo', produto.titulo);
    
    // Botão de Remover
    let btn_remove = document.createElement('button')
    btn_remove.setAttribute('class', 'btn btn-danger')
    btn_remove.innerHTML = '<i class="fas fa-trash"></i> Remover'
    
    // adicionar identificador ao botão para saber qual produto remover
    btn_remove.setAttribute('data-titulo', produto.titulo);
    if (isFromAPI) {
        btn_remove.setAttribute('data-api', 'true');
        btn_edit.setAttribute('data-api', 'true');
    }
    
    div_actions.appendChild(btn_edit)
    div_actions.appendChild(btn_remove)
    const cardContainer = document.querySelector('#lista-produtos .card-container') || document.querySelector('.card-container')
    cardContainer.appendChild(div_card)
}

// buscar prod da API
async function carregarProdutosEletronicosAPI() {
    try {
        const responseSmartphones = await fetch('https://dummyjson.com/products/category/smartphones');
        const dataSmartphones = await responseSmartphones.json();
        
        const responseLaptops = await fetch('https://dummyjson.com/products/category/laptops');
        const dataLaptops = await responseLaptops.json();
        
        // juntar todes os prod 
        const todosEletronicos = [...dataSmartphones.products, ...dataLaptops.products];
        
        // converter formato
        return todosEletronicos.map(produto => {
            const precoReal = (produto.price * 2.5).toFixed(2);

            // Criar data aleatória no passado para produtos da API
            const diasAtras = Math.floor(Math.random() * 30);
            const dataPassada = Date.now() - (diasAtras * 24 * 60 * 60 * 1000);
            
            // descrição
            let descricaoPT = "";
            if (produto.category === "smartphones") {
                descricaoPT = `Smartphone ${produto.brand} com ótima performance. Tela de alta qualidade, câmera excelente e bateria de longa duração. Perfeito para trabalho e entretenimento.`;
            } else {
                descricaoPT = `Laptop ${produto.brand} ideal para produtividade. Processador rápido, armazenamento amplo e design moderno. Excelente para estudos e trabalho remoto.`;
            }
            
            return {
                titulo: produto.title,
                descricao: descricaoPT,
                preco: precoReal,
                marca: produto.brand,
                categoria: produto.category === "smartphones" ? "Smartphones" : "Laptops",
                foto: produto.thumbnail,
                criadoEm: dataPassada,
                origem: 'api'
            };
        });
    } catch (error) {
        console.error('Erro ao carregar produtos eletrônicos:', error);
        return [];
    }
}

// carregar produtos do localStorage
function carregarProdutosLocal() {
    return JSON.parse(localStorage.getItem('produtos')) || [];
}

// função principal 
async function carregarTodosProdutos() {
    const container = document.querySelector('.card-container');
    if (!container) return;

    // limpar prod de exemplo
    container.innerHTML = '';

    // carregar da API
    const produtosEletronicos = await carregarProdutosEletronicosAPI();
    
    // carregar do localStorage 
    const produtosLocal = carregarProdutosLocal();

    // JUNTAR TODOS OS PRODUTOS
    const todosProdutos = [...produtosLocal, ...produtosEletronicos];

    // ORDENAR: mais recente primeiro (baseado no criadoEm)
    todosProdutos.sort((a, b) => {
        // Se ambos têm criadoEm, ordena por data (mais recente primeiro)
        if (a.criadoEm && b.criadoEm) {
            return b.criadoEm - a.criadoEm; // Mais recente primeiro
        }
        // Se só A tem data, A vem primeiro
        if (a.criadoEm && !b.criadoEm) return -1;
        // Se só B tem data, B vem primeiro
        if (!a.criadoEm && b.criadoEm) return 1;
        // Se nenhum tem data, mantém ordem original
        return 0;
    });
    
    // criar cards pra todos os produtos (ordenados)
    todosProdutos.forEach(produto => {
        const isFromAPI = produto.origem === 'api';
        criar_produto(produto, isFromAPI);
    });
}

// função para remover produto do localstorage
function removerProdutoDoLocalStorage(titulo) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produtosAtualizados = produtos.filter(produto => produto.titulo !== titulo);
    localStorage.setItem('produtos', JSON.stringify(produtosAtualizados));
}

// função para editar produto
function editarProduto(titulo) {
    // Redirecionar para formulário de edição
    window.location.href = `formp.html?editar=${encodeURIComponent(titulo)}`;
}

// config dos botôes pra remoção e edição
function configurarBotoes() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-danger')) {
            const button = e.target.closest('.btn-danger');
            const isFromAPI = button.getAttribute('data-api') === 'true';
            
            if (isFromAPI) {
                alert('Produtos da API não podem ser removidos. Adicione produtos localmente para remover.');
                return;
            }
            
            const card = button.closest('.card');
            const titulo = button.getAttribute('data-titulo');
            
            if (confirm(`Remover "${titulo}"?`)) {
                // Remover do DOM
                card.remove();
                
                // remover do localstorage também
                removerProdutoDoLocalStorage(titulo);
            }
        }
        
        if (e.target.closest('.btn-success')) {
            const button = e.target.closest('.btn-success');
            const isFromAPI = button.getAttribute('data-api') === 'true';
            
            if (isFromAPI) {
                alert('Produtos da API não podem ser editados. Adicione produtos localmente para editar.');
                return;
            }
            
            const titulo = button.getAttribute('data-titulo');
            editarProduto(titulo);
        }
    });
}

// iniciar
document.addEventListener('DOMContentLoaded', function() {
    carregarTodosProdutos();
    configurarBotoes();
});