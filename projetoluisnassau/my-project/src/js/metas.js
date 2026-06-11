let dadosDoApp = {
    metas: []
};

const listaMetasEl = document.getElementById('lista-metas');
const novaMetaInput = document.getElementById('nova-meta-input');
const btnAdicionar = document.getElementById('btn-adicionar');


function salvarAutomaticamente() {
    localStorage.setItem('dados_organizador_estudos', JSON.stringify(dadosDoApp));
    console.log('Progresso salvo automaticamente!');
}


function carregarDados() {
    const dadosSalvos = localStorage.getItem('dados_organizador_estudos');
    if (dadosSalvos) {
        dadosDoApp = JSON.parse(dadosSalvos);
        renderizarMetas();
    }
}

function renderizarMetas() {
    listaMetasEl.innerHTML = ''; 
    dadosDoApp.metas.forEach((meta, index) => {
        const li = document.createElement('li');
        
       
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = meta.concluida;
        
       
        checkbox.addEventListener('change', () => {
            dadosDoApp.metas[index].concluida = checkbox.checked;
            salvarAutomaticamente(); 
            renderizarMetas(); 
        });

        const span = document.createElement('span');
        span.textContent = meta.texto;
        if (meta.concluida) {
            span.style.textDecoration = 'line-through';
            span.style.color = '#888';
        }

        li.appendChild(checkbox);
        li.appendChild(span);
        listaMetasEl.appendChild(li);
    });
}

function adicionarMeta() {
    const textoMeta = novaMetaInput.value.trim();
    if (textoMeta === '') return;

   
    dadosDoApp.metas.push({
        texto: textoMeta,
        concluida: false,
        dataCriacao: new Date().toISOString()
    });

    novaMetaInput.value = ''; 
    
    salvarAutomaticamente(); 
    renderizarMetas(); 
}

btnAdicionar.addEventListener('click', adicionarMeta);
novaMetaInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') adicionarMeta();
});


window.addEventListener('DOMContentLoaded', carregarDados);