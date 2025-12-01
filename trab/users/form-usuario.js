// validação de URL da imagem
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// preview da imagem
function previewImage(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const url = input.value.trim();
    
    if (url === '') {
        preview.innerHTML = `
            <div class="upload-placeholder">
                <i class="fas fa-user" style="font-size: 2rem;"></i>
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
    
    // carregamento da imagem
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

// Função para mostrar/ocultar mensagens de validação
function setupValidationMessages() {
    const campos = ['nome', 'sobrenome', 'email', 'txtidade', 'fotoUsuario'];
    
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
                validarCampo(campoId);
            });
            
            campo.addEventListener('input', function() {
                const errorDiv = document.getElementById(`${campoId}Error`);
                errorDiv.style.display = 'none';
                campo.style.borderColor = '#e1e8ed';
            });
        }
    });
}

// Função para validar cada campo
function validarCampo(campoId) {
    const campo = document.getElementById(campoId);
    const valor = campo.value.trim();
    const errorDiv = document.getElementById(`${campoId}Error`);
    
    let mensagem = '';
    let valido = true;
    
    switch(campoId) {
        case 'nome':
            if (valor === '') {
                mensagem = 'Nome é obrigatório';
                valido = false;
            } else if (valor.length < 3) {
                mensagem = 'Nome precisa ter 3 letras ou mais';
                valido = false;
            } else if (valor.length > 51) {
                mensagem = 'Nome não pode ter mais de 51 caracteres';
                valido = false;
            }
            break;
            
        case 'sobrenome':
            if (valor === '') {
                mensagem = 'Sobrenome é obrigatório';
                valido = false;
            } else if (valor.length < 3) {
                mensagem = 'Sobrenome precisa ter 3 letras ou mais';
                valido = false;
            } else if (valor.length > 51) {
                mensagem = 'Sobrenome não pode ter mais de 51 caracteres';
                valido = false;
            }
            break;
            
        case 'email':
            const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (valor === '') {
                mensagem = 'Email é obrigatório';
                valido = false;
            } else if (!regexEmail.test(valor)) {
                mensagem = 'Email inválido';
                valido = false;
            }
            break;
            
        case 'txtidade':
            if (valor === '') {
                mensagem = 'Idade é obrigatória';
                valido = false;
            } else if (Number(valor) < 1 || Number(valor) > 120) {
                mensagem = 'Idade deve ser entre 1 e 120 anos';
                valido = false;
            }
            break;
            
        case 'fotoUsuario':
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

// Função para validar todo o formulário
function validarFormulario() {
    const campos = ['nome', 'sobrenome', 'email', 'txtidade', 'fotoUsuario'];
    let formularioValido = true;
    
    campos.forEach(campoId => {
        if (!validarCampo(campoId)) {
            formularioValido = false;
        }
    });
    
    return formularioValido;
}

// Função para carregar usuário para edição
function carregarUsuarioParaEdicao() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('editar');
    
    if (email) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuario = usuarios.find(u => u.email === email);
        
        if (usuario) {
            // Preencher os campos
            document.getElementById('nome').value = usuario.nome;
            document.getElementById('sobrenome').value = usuario.sobrenome;
            document.getElementById('email').value = usuario.email;
            document.getElementById('txtidade').value = usuario.idade;
            document.getElementById('fotoUsuario').value = usuario.foto || '';
            
            // Atualizar preview
            if (usuario.foto) {
                previewImage('fotoUsuario', 'fotoUsuarioPreview');
            }
            
            // Alterar título e botão
            document.querySelector('.page-title h1').innerHTML = '<i class="fas fa-user-edit"></i> Editar Usuário';
            document.querySelector('.form-submit .btn').innerHTML = '<i class="fas fa-save"></i> Salvar Alterações';
            
            // Adicionar email original como campo oculto
            const hiddenEmail = document.createElement('input');
            hiddenEmail.type = 'hidden';
            hiddenEmail.id = 'emailOriginal';
            hiddenEmail.value = email;
            document.querySelector('.form-container').appendChild(hiddenEmail);
        }
    }
}

function checar() {
    if (!validarFormulario()) {
        return;
    }
    
    const nome = document.getElementById('nome');
    const sobrenome = document.getElementById('sobrenome');
    const email = document.getElementById('email');
    const txtidade = document.getElementById('txtidade');
    const fotoInput = document.getElementById('fotoUsuario');
    const emailOriginal = document.getElementById('emailOriginal');
    
    const fotoURL = fotoInput ? fotoInput.value.trim() : '';
    
    const novoUsuario = {
        nome: nome.value,
        email: email.value,
        idade: txtidade.value,
        sobrenome: sobrenome.value,
        foto: fotoURL,
        criadoEm: Date.now()
    };
    
    const lista = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    if (emailOriginal) {
        // Modo edição - remover usuário antigo
        const index = lista.findIndex(u => u.email === emailOriginal.value);
        if (index !== -1) {
            lista.splice(index, 1);
        }
    }
    
    // Adicionar novo/atualizado
    lista.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(lista));
    
    // Voltar para página de usuários
    alert(emailOriginal ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!');
    window.location.href = 'users.html';
}

// Função para voltar para início
function voltarParaInicio() {
    window.location.href = "../index.html";
}

// Limpar preview
function limparPreview() {
    const fotoInput = document.getElementById('fotoUsuario');
    const preview = document.getElementById('fotoUsuarioPreview');
    
    if (fotoInput) fotoInput.value = '';
    if (preview) {
        preview.innerHTML = `
            <div class="upload-placeholder">
                <i class="fas fa-user"></i>
                <p>Digite uma URL para ver a imagem</p>
            </div>
        `;
    }
    
    // Limpar mensagem de erro
    const errorDiv = document.getElementById('fotoUsuarioError');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
    if (fotoInput) {
        fotoInput.style.borderColor = '#e1e8ed';
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    // Configurar validações
    setupValidationMessages();
    
    // Configurar preview de imagem
    const fotoInput = document.getElementById('fotoUsuario');
    if (fotoInput) {
        fotoInput.addEventListener('input', function() {
            previewImage('fotoUsuario', 'fotoUsuarioPreview');
            validarCampo('fotoUsuario');
        });
    }
    
    // Verificar se é modo edição
    carregarUsuarioParaEdicao();
    
    // Adicionar CSS para mensagens de erro
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