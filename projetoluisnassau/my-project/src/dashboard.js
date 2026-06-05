function carregarMetasNoDashboard() {
    const metasSalvas = JSON.parse(localStorage.getItem('metas')) || []
    listaElement.innerHTML = "";
    if (metasSalvas === 0) {
        listaElement.innerHTML = "<li>Nenhuma meta adicionada!</li>";
        return;
    }
metasSalvas.forEach(meta => {
    const li = document.createElement('li');
    li.textContent = meta;
    listaElement.appendChild(li);
});
}
window.onload = carregarMetasNoDashboard;