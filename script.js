let destinos = [];
let indiceAtual = 0;

const imgElemento = document.getElementById('imagem-fundo');
const audioPlayer = document.getElementById('player-audio');
const npTitulo = document.getElementById('np-titulo');
const npCidade = document.getElementById('np-cidade'); // 1. Nova constante adicionada
const npFusao = document.getElementById('np-fusao');
const npInstrumentos = document.getElementById('np-instrumentos');
const btnIniciar = document.getElementById('btn-iniciar');

// Função autoexecutável para carregar os dados assim que o script é lido
(async function carregarMultiverso() {
    try {
        // 1. Lê o arquivo principal que diz quais pastas existem
        const responsePastas = await fetch('assets/destinos.json');
        const pastas = await responsePastas.json();

        // 2. Faz um loop por cada pasta e busca o info.json dela
        for (const pasta of pastas) {
            const responseInfo = await fetch(`assets/${pasta}/info.json`);
            const info = await responseInfo.json();
            
            // 3. Monta o objeto final e adiciona no array destinos
            destinos.push({
                img: `assets/${pasta}/${info.imagem}`,
                audio: `assets/${pasta}/${info.audio}`,
                titulo: info.titulo,
                cidade: info.cidade, // 2. Nova linha para pegar a cidade do JSON
                fusao: info.fusao,
                instrumentos: info.instrumentos
            });
        }

        // 4. Tudo carregado com sucesso! Libera o botão Iniciar.
        btnIniciar.innerText = "Iniciar Viagem";
        btnIniciar.disabled = false;

    } catch (erro) {
        console.error("Erro ao carregar os assets:", erro);
        btnIniciar.innerText = "Erro ao carregar arquivos locais";
    }
})();

function iniciarApp() {
    document.getElementById('tela-inicial').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    atualizarTela();
}

function mudarDestino(direcao) {
    indiceAtual = (indiceAtual + direcao + destinos.length) % destinos.length;
    atualizarTela();
}

function atualizarTela() {
    const destino = destinos[indiceAtual];
    
    imgElemento.style.opacity = 0;
    document.getElementById('now-playing').style.opacity = 0;

    setTimeout(() => {
        imgElemento.src = destino.img;
        audioPlayer.src = destino.audio;
        audioPlayer.play();

        npTitulo.innerText = destino.titulo;
        npCidade.innerText = destino.cidade; // 3. Nova linha para injetar o texto na tela
        npFusao.innerText = destino.fusao;
        npInstrumentos.innerText = destino.instrumentos;

        imgElemento.style.opacity = 1;
        document.getElementById('now-playing').style.opacity = 1;
    }, 300);
}

document.addEventListener('keydown', function(event) {
    if (document.getElementById('app').style.display === 'block') {
        if (event.key === 'ArrowLeft') {
            mudarDestino(-1);
        } else if (event.key === 'ArrowRight') {
            mudarDestino(1);
        }
    }
});