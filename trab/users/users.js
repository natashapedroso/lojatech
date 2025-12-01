// função para criar usuário
function criar_usuario(dadosUsuario, isFromAPI = false) {
    let div_card = window.document.createElement('div')
    div_card.setAttribute('class', 'card')
    div_card.setAttribute('data-email', dadosUsuario.email);
    
    let div_card_img = window.document.createElement('div')
    div_card_img.setAttribute('class', 'card-img')
    
    // usa URL da imagem se existir
    if (dadosUsuario.foto && dadosUsuario.foto !== '') {
        div_card_img.style.backgroundImage = `url('${dadosUsuario.foto}')`;
        div_card_img.style.backgroundSize = 'cover';
        div_card_img.style.backgroundPosition = 'center';
    } else {
        div_card_img.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white;">
                <i class="fas fa-user" style="font-size: 3rem;"></i>
            </div>
        `;
    }
    
    div_card.appendChild(div_card_img)
    let div_card_content = window.document.createElement('div')
    div_card_content.setAttribute('class', 'card-content')
    div_card.appendChild(div_card_content)
    
    let div_card_user_fullname = window.document.createElement('div')
    div_card_user_fullname.setAttribute('class', 'user-fullname')
    div_card_user_fullname.textContent = dadosUsuario.nome + ' ' + dadosUsuario.sobrenome
    div_card_content.appendChild(div_card_user_fullname)
    
    let div_card_user_email = window.document.createElement('div')
    div_card_user_email.setAttribute('class', 'user-email')
    div_card_user_email.textContent = dadosUsuario.email
    div_card_content.appendChild(div_card_user_email)
    
    let div_card_user_info = window.document.createElement('div')
    div_card_user_info.setAttribute('class', 'user-info')
    div_card_content.appendChild(div_card_user_info)
    
    let span_user_icon = window.document.createElement('span')
    span_user_icon.setAttribute('class', 'user-icon')
    span_user_icon.textContent = '💡'
    div_card_user_info.appendChild(span_user_icon)
    
    let span_user_age = window.document.createElement('span')
    span_user_age.setAttribute('class', 'user-age')
    span_user_age.textContent = dadosUsuario.idade + ' anos'
    div_card_user_info.appendChild(span_user_age)
    
    let div_card_actions = window.document.createElement('div')
    div_card_actions.setAttribute('class', 'card-actions')
    div_card_content.appendChild(div_card_actions)
    
    // Botão de Editar
    let button_edit = window.document.createElement('button')
    button_edit.setAttribute('class', 'btn btn-success')
    button_edit.innerHTML = '<i class="fas fa-edit"></i> Editar'
    button_edit.setAttribute('data-email', dadosUsuario.email)
    
    // Botão de Remover
    let button_danger = window.document.createElement('button')
    button_danger.setAttribute('class', 'btn btn-danger')
    button_danger.innerHTML = '<i class="fas fa-trash"></i> Remover'
    
    // adicionar identificador único para remoção
    button_danger.setAttribute('data-email', dadosUsuario.email)
    if (isFromAPI) {
        button_danger.setAttribute('data-api', 'true');
        button_edit.setAttribute('data-api', 'true');
    }
    
    div_card_actions.appendChild(button_edit)
    div_card_actions.appendChild(button_danger)
    
    const cardContainer = window.document.querySelector('#lista-usuarios .card-container')
    cardContainer.appendChild(div_card)
}

// buscar usuários da API
async function carregarUsuariosAPI() {
    try {
        const response = await fetch('https://dummyjson.com/users?limit=6');
        const data = await response.json();
        
        // converter formato da API para nosso formato
        return data.users.map(usuario => {
            const diasAtras = Math.floor(Math.random() * 30);
            const dataPassada = Date.now() - (diasAtras * 24 * 60 * 60 * 1000);
            return {
                nome: usuario.firstName,
                sobrenome: usuario.lastName,
                email: usuario.email,
                idade: usuario.age,
                foto: usuario.image,
                criadoEm: dataPassada,
                origem: 'api'
            };
        });
    } catch (error) {
        console.error('Erro ao carregar usuários da API:', error);
        return [];
    }
}

// carregar usuários do localStorage
function carregarUsuariosLocal() {
    return JSON.parse(localStorage.getItem('usuarios')) || [];
}

// função principal para carregar todos os usuários
async function carregarTodosUsuarios() {
    const container = document.querySelector('.card-container');
    if (!container) return;

    // limpar container
    container.innerHTML = '';

    // carregar da API
    const usuariosAPI = await carregarUsuariosAPI();
    
    // carregar do localStorage
    const usuariosLocal = carregarUsuariosLocal();

     // JUNTAR TODOS OS USUÁRIOS
    const todosUsuarios = [...usuariosLocal, ...usuariosAPI];
    
    // ORDENAR: mais recente primeiro (baseado no criadoEm)
    todosUsuarios.sort((a, b) => {
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
    
// criar cards para todos os usuários (ordenados)
    todosUsuarios.forEach(usuario => {
        const isFromAPI = usuario.origem === 'api';
        criar_usuario(usuario, isFromAPI);
    });
}

// função para remover usuário do localStorage
function removerUsuarioDoLocalStorage(email) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuariosAtualizados = usuarios.filter(usuario => usuario.email !== email);
    localStorage.setItem('usuarios', JSON.stringify(usuariosAtualizados));
}

// função para editar usuário
function editarUsuario(email) {
    // Redirecionar para formulário de edição
    window.location.href = `formu.html?editar=${encodeURIComponent(email)}`;
}

// configurar botões de remoção e edição
function configurarBotoes() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-danger')) {
            const button = e.target.closest('.btn-danger');
            const isFromAPI = button.getAttribute('data-api') === 'true';
            
            if (isFromAPI) {
                alert('Usuários da API não podem ser removidos. Adicione usuários localmente para remover.');
                return;
            }
            
            const card = button.closest('.card');
            const email = button.getAttribute('data-email');
            const nomeCompleto = card.querySelector('.user-fullname').textContent;
            
            if (confirm(`Tem certeza que deseja remover "${nomeCompleto}"?`)) {
                // remover do DOM
                card.remove();
                
                // remover do localStorage também
                removerUsuarioDoLocalStorage(email);
            }
        }
        
        if (e.target.closest('.btn-success')) {
            const button = e.target.closest('.btn-success');
            const isFromAPI = button.getAttribute('data-api') === 'true';
            
            if (isFromAPI) {
                alert('Usuários da API não podem ser editados. Adicione usuários localmente para editar.');
                return;
            }
            
            const email = button.getAttribute('data-email');
            editarUsuario(email);
        }
    });
}

// inicializar
document.addEventListener('DOMContentLoaded', function() {
    carregarTodosUsuarios();
    configurarBotoes();
});