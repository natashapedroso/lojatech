//validação de url da imagem
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

//preview da imagem
function previewImage(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const url = input.value.trim();
    
    if (url === '') {
        preview.innerHTML = `
            <div class="upload-placeholder">
                <i class="fas fa-image" style="font-size: 2rem;"></i>
                <p>Digite uma URL para visualizar</p>
            </div>
        `;
        return;
    }
    
    if (!isValidURL(url)) {
        preview.innerHTML = `
            <div class="upload-placeholder" style="color: #ff6b6b;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem;"></i>
                <p>URL inválida</p>
            </div>
        `;
        return;
    }
    
    //carregamento da imagem
    const img = new Image();
    img.onload = function() {
        preview.innerHTML = `<img src="${url}" alt="Preview" style="max-width: 100%; max-height: 100%; object-fit: cover;">`;
    };
    img.onerror = function() {
        preview.innerHTML = `
            <div class="upload-placeholder" style="color: #ff6b6b;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem;"></i>
                <p>Erro ao carregar imagem</p>
            </div>
        `;
    };
    img.src = url;
}

// Configurar mensagens de validação
function setupValidationMessagesProduto() {
    const campos = ['nomeProduto', 'preçoProduto', 'marcaProduto', 'categoriaProduto', 'descricaoProduto', 'fotoProduto'];
    
    campos.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            // Criar elemento para mensagem de erro
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.id = `${campoId}Error`;
            errorDiv.style.color = '#ff6b6b';
            errorDiv.style.fontSize = '0.85rem';
            errorDiv.style.marginTop = '5px';
            errorDiv.style.display = 'none';
            
            campo.parentNode.appendChild(errorDiv);
            
            // Adicionar eventos de validação
            campo.addEventListener('blur', function() {
                validarCampoProduto(campoId);
            });
            
            campo.addEventListener('input', function() {
                const errorDiv = document.getElementById(`${campoId}Error`);
                errorDiv.style.display = 'none';
                campo.style.borderColor = '#e1e8ed';
            });
        }
    });
}

// Validar cada campo do produto
function validarCampoProduto(campoId) {
    const campo = document.getElementById(campoId);
    const valor = campo.value.trim();
    const errorDiv = document.getElementById(`${campoId}Error`);
    
    let mensagem = '';
    let valido = true;
    
    switch(campoId) {
        case 'nomeProduto':
            if (valor === '') {
                mensagem = 'Nome do produto é obrigatório';
                valido = false;
            } else if (valor.length < 3) {
                mensagem = 'Nome precisa ter 3 letras ou mais';
                valido = false;
            } else if (valor.length > 50) {
                mensagem = 'Nome não pode ter mais de 50 caracteres';
                valido = false;
            }
            break;
            
        case 'descricaoProduto':
            if (valor === '') {
                mensagem = 'Descrição é obrigatória';
                valido = false;
            } else if (valor.length < 3) {
                mensagem = 'Descrição precisa ter 3 letras ou mais';
                valido = false;
            } else if (valor.length > 50) {
                mensagem = 'Descrição não pode ter mais de 50 caracteres';
                valido = false;
            }
            break;
            
        case 'marcaProduto':
            if (valor === '') {
                mensagem = 'Marca é obrigatória';
                valido = false;
            } else if (valor.length < 3) {
                mensagem = 'Marca precisa ter 3 letras ou mais';
                valido = false;
            } else if (valor.length > 50) {
                mensagem = 'Marca não pode ter mais de 50 caracteres';
                valido = false;
            }
            break;
            
        case 'categoriaProduto':
            if (valor === '') {
                mensagem = 'Categoria é obrigatória';
                valido = false;
            } else if (valor.length < 3) {
                mensagem = 'Categoria precisa ter 3 letras ou mais';
                valido = false;
            } else if (valor.length > 50) {
                mensagem = 'Categoria não pode ter mais de 50 caracteres';
                valido = false;
            }
            break;
            
        case 'preçoProduto':
            if (valor === '') {
                mensagem = 'Preço é obrigatório';
                valido = false;
            } else if (Number(valor) <= 0) {
                mensagem = 'Preço deve ser maior que zero';
                valido = false;
            } else if (Number(valor) >= 120) {
                mensagem = 'Preço deve ser menor que 120';
                valido = false;
            }
            break;
            
        case 'fotoProduto':
            if (valor !== '' && !isValidURL(valor)) {
                mensagem = 'URL inválida. Deixe em branco ou insira uma URL válida.';
                valido = false;
            }
            break;
    }
    
    if (!valido) {
        errorDiv.textContent = mensagem;
        errorDiv.style.display = 'block';
        campo.style.borderColor = '#ff6b6b';
        return false;
    } else {
        errorDiv.style.display = 'none';
        campo.style.borderColor = '#667eea';
        return true;
    }
}

// Validar formulário completo
function validarFormularioProduto() {
    const campos = ['nomeProduto', 'preçoProduto', 'marcaProduto', 'categoriaProduto', 'descricaoProduto', 'fotoProduto'];
    let formularioValido = true;
    
    campos.forEach(campoId => {
        if (!validarCampoProduto(campoId)) {
            formularioValido = false;
        }
    });
    
    return formularioValido;
}

// Carregar produto para edição
function carregarProdutoParaEdicao() {
    const urlParams = new URLSearchParams(window.location.search);
    const titulo = urlParams.get('editar');
    
    if (titulo) {
        const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        const produto = produtos.find(p => p.titulo === titulo);
        
        if (produto) {
            // Preencher os campos
            document.getElementById('nomeProduto').value = produto.titulo;
            document.getElementById('descricaoProduto').value = produto.descricao;
            document.getElementById('preçoProduto').value = produto.preco;
            document.getElementById('marcaProduto').value = produto.marca;
            document.getElementById('categoriaProduto').value = produto.categoria;
            document.getElementById('fotoProduto').value = produto.foto || '';
            
            // Atualizar preview
            if (produto.foto) {
                previewImage('fotoProduto', 'fotoProdutoPreview');
            }
            
            // Alterar título e botão
            document.querySelector('.page-title h1').innerHTML = '<i class="fas fa-edit"></i> Editar Produto';
            document.querySelector('.form-submit .btn').innerHTML = '<i class="fas fa-save"></i> Salvar Alterações';
            
            // Adicionar título original como campo oculto
            const hiddenTitulo = document.createElement('input');
            hiddenTitulo.type = 'hidden';
            hiddenTitulo.id = 'tituloOriginal';
            hiddenTitulo.value = titulo;
            document.querySelector('.form-container').appendChild(hiddenTitulo);
        }
    }
}

function validarProduto() {
    if (!validarFormularioProduto()) {
        return;
    }
    
    const titulo = document.getElementById('nomeProduto').value;
    const preco = document.getElementById('preçoProduto').value;
    const marca = document.getElementById('marcaProduto').value;
    const categoria = document.getElementById('categoriaProduto').value;
    const descricao = document.getElementById('descricaoProduto').value;
    const fotoInput = document.getElementById('fotoProduto');
    const fotoURL = fotoInput.value.trim();
    const tituloOriginal = document.getElementById('tituloOriginal');

    const novoProduto = {
        titulo: titulo,
        descricao: descricao,
        preco: preco,
        marca: marca,
        categoria: categoria,
        foto: fotoURL,
        criadoEm: Date.now()
    };

    // salvar no localStorage
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    
    if (tituloOriginal) {
        // Modo edição - remover produto antigo
        const index = produtos.findIndex(p => p.titulo === tituloOriginal.value);
        if (index !== -1) {
            produtos.splice(index, 1);
        }
    }
    
    // Adicionar novo/atualizado
    produtos.push(novoProduto);
    localStorage.setItem('produtos', JSON.stringify(produtos));

    // redirecionar para página de produtos
    alert(tituloOriginal ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!');
    window.location.href = 'products.html';
}

// função pra voltar
function voltarParaInicio() {
    window.location.href = "../index.html";
}

// funçao limpar preview
function limparPreview() {
    const fotoInput = document.getElementById('fotoProduto');
    const preview = document.getElementById('fotoProdutoPreview');
    
    if (fotoInput) fotoInput.value = '';
    if (preview) {
        preview.innerHTML = `
            <div class="upload-placeholder">
                <i class="fas fa-image"></i>
                <p>Digite uma URL para ver a imagem</p>
            </div>
        `;
    }
    
    // Limpar mensagem de erro
    const errorDiv = document.getElementById('fotoProdutoError');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
    if (fotoInput) {
        fotoInput.style.borderColor = '#e1e8ed';
    }
}

// iniciar - preview automático
document.addEventListener('DOMContentLoaded', function() {
    // Configurar validações
    setupValidationMessagesProduto();
    
    // Configurar preview
    const fotoInput = document.getElementById('fotoProduto');
    if (fotoInput) {
        fotoInput.addEventListener('input', function() {
            previewImage('fotoProduto', 'fotoProdutoPreview');
            validarCampoProduto('fotoProduto');
        });
    }
    
    // Verificar se é modo edição
    carregarProdutoParaEdicao();
    
    // SS para mensagens de erro
    const style = document.createElement('style');
    style.textContent = `
        .error-message {
            color: #ff6b6b;
            font-size: 0.85rem;
            margin-top: 5px;
            display: none;
        }
        input:invalid, textarea:invalid {
            border-color: #ff6b6b !important;
        }
        input:valid, textarea:valid {
            border-color: #2ecc71 !important;
        }
    `;
    document.head.appendChild(style);
});