/* ==================== */
/* FIREBASE */
/* ==================== */

const firebaseConfig = {
    apiKey: "AIzaSyAV4TDmffdCByJ0K11GizL23fUL5Gknmgs",
    authDomain: "bdsorteio.firebaseapp.com",
    projectId: "bdsorteio",
    storageBucket: "bdsorteio.firebasestorage.app",
    messagingSenderId: "84566722053",
    appId: "1:84566722053:web:59cdc4f0bffa908d7c7e6c"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();





/*==≈====≈=====firebase=====*/


let admin = false;

const tickets =
document.getElementById("tickets");

let banco = {};

let numerosManuais = [];
let filtroAtual = "todos";

/* =========aumentar TOTAL_BILHETES=========== */
const TOTAL_BILHETES = 200;

function criarBilhetes() {

    let dados = {};

    for (let i = 1; i <= TOTAL_BILHETES; i++) {

        let numeros = [];

        for (let linha = 0; linha < 4; linha++) {

            let usados = [];

            while (usados.length < 4) {

                let n =
                Math.floor(Math.random() *100);

                if (!usados.includes(n)) {

                    usados.push(n);

                    numeros.push(n);
                }
            }
        }

        dados[i] = {

            numeros: numeros,
            status: "livre",
            comprador: ""

        };
    }

    salvar(dados);

    return dados;
}

/* ==================== */

function salvar(
    dados = banco
) {

    db.collection("trevo")
    .doc("bilhetes")
    .set(dados);

}

/* =======funcao carregar sistema========= */

function carregarSistema() {

    tickets.innerHTML = "";

    mostrarData();

    const data =
    localStorage.getItem("dataSorteio") || "Não definida";

    for (let id in banco) {

        const b = banco[id];

        if (filtroAtual === "livre" && b.status !== "livre") continue;

        if (filtroAtual === "reservado" && b.status !== "reservado") continue;

        if (filtroAtual === "vendido" && b.status !== "vendido") continue;

        const div = document.createElement("div");

        div.className = "ticket";

        let statusClasse = "livre";
        let statusTexto = "🟢 DISPONÍVEL";

        if (b.status === "reservado") {
            statusClasse = "reservado";
            statusTexto = "🟡 RESERVADO";
        }

        if (b.status === "vendido") {
            statusClasse = "vendido";
            statusTexto = "🏆 VENDIDO";
        }

        let botoes = "";

        if (admin) {

            botoes = `

            <div class="dataBilhete">
            📅 ${data}
            </div>

            <button
            class="btn-share"
            onclick="compartilharBilhete(${id})">
            📤 Compartilhar
            </button>

            <button
            class="btn-confirmar"
            onclick="confirmarVenda(${id})">
            ✅ Confirmar Venda
            </button>

            <button
            class="btn-liberar"
            onclick="liberarBilhete(${id})">
            🔵 Liberar
            </button>

            `;

        } else {

            botoes = `

            <button
            class="btn-reservar"
            onclick="reservar(${id})">
            🎟 Reservar Bilhete
            </button>

            `;

        }

        div.innerHTML = `

        <div class="shine"></div>

        <div class="ticket-topo">

        <div class="status ${statusClasse}">
        ${statusTexto}
        </div>

        </div>

        <div class="numero">

        #${String(id).padStart(3, "0")}

        </div>

        <div class="nome">

        ${b.comprador || "Disponível"}

        </div>

        <div class="numeros">

        ${b.numeros.map(numero => `

            <div class="bola">
            ${String(numero).padStart(2, "0")}
            </div>
            `).join("")}

        </div>

        ${botoes}

        `;

        tickets.appendChild(div);

    }
    atualizarContadores();
}

/* ==================== */

function abrirAdmin() {

    let senha =
    prompt("Senha admin");

    if (senha === "1234@") {

        admin = true;

        document
        .getElementById(
            "menuAdmin"
        )
        .style.display = "flex";



        carregarSistema();


    } else {

        alert(
            "Senha incorreta"
        );

    }

}







/* ==================== */

function confirmarVenda(id) {

    if (
        banco[id].comprador === ""
    ) {

        alert(
            "Reserve o bilhete primeiro"
        );

        return;
    }

    banco[id].status =
    "vendido";

    salvar();

    carregarSistema();

}

/* ==================== */

function liberarBilhete(id) {

    banco[id] = {

        numeros: banco[id].numeros,

        status: "livre",

        comprador: ""

    };

    salvar();

    carregarSistema();

}

/* ==================== */

function mostrarData() {

    const data =
    localStorage.getItem(
        "dataSorteio"
    ) || "Não definida";

    document
    .getElementById(
        "dataSorteio"
    )
    .innerText = data;
}

/* ==================== */

async function compartilharBilhete(id) {

    try {

        const cards =
        document.querySelectorAll(
            ".ticket"
        );

        const elemento =
        cards[id-1];

        const canvas =
        await html2canvas(
            elemento,
            {
                scale: 2
            }
        );

        canvas.toBlob(async(blob)=> {

            const file =
            new File(
                [blob],
                `bilhete-${id}.png`,
                {
                    type: 'image/png'
                }
            );

            if (
                navigator.canShare &&
                navigator.canShare({
                    files: [file]
                })
            ) {

                await navigator.share({
                    text: '🎰 Meu bilhete VIP',
                    files: [file]
                });

            } else {

                const link =
                document.createElement('a');

                link.href =
                URL.createObjectURL(blob);

                link.download =
                `bilhete-${id}.png`;

                link.click();
            }

        });

    }catch(e) {
        alert('Erro ao compartilhar');
    }
}

/* ======sorteio manual============== */


function configurarSorteioManual() {

    let entrada = prompt(
        `digite os 4 numeros manuais
        exemplo: 04, 27, 65, 99

        e clique OK`


    );

    if (!entrada) return;

    /* volta automático */
    if (
        entrada.trim() === "--"
    ) {

        numerosManuais = [];

        alert(
            "Sorteio automático ativado"
        );

        return;
    }

    let numeros = entrada
    .split(",")
    .map(n => parseInt(n.trim()))
    .filter(n => !isNaN(n) && n >= 0 && n <= 99);

    /* validar */
    if (numeros.length !== 4) {

        alert(
            "Digite exatamente 4 números"
        );

        return;
    }

    /* impedir repetidos */
    let unico =
    [...new Set(numeros)];

    if (unico.length !== 4) {

        alert(
            "Não repita números"
        );

        return;
    }

    numerosManuais = numeros;

    document.getElementById("numerosManuaisTela").innerHTML =
    "🎯 Numeros Sorteados: " + numeros.join(" - ");

    alert(
        "Sorteio manual configurado:\n" +
        numeros.join(" - ")
    );


    let filtroAtual = "todos";

}



async function sortearN1() {

    let contador =
    document.getElementById(
        "contador"
    );

    let numero =
    document.getElementById(
        "numeroAnimado"
    );

    let bolas =
    document.getElementById(
        "bolas"
    );

    let botao =
    document.getElementById(
        "btnSortear"
    );

    bolas.innerHTML = "";

    botao.disabled = true;

    let numeros = [];

    for (let rodada = 0; rodada < 4; rodada++) {

        for (let i = 4; i >= 0; i--) {

            contador.innerText = i;

            await new Promise(
                r=>setTimeout(r, 1000)
            );
        }

        await new Promise(resolve=> {

            let vezes = 0;

            let animacao =
            setInterval(()=> {

                numero.innerText =
                Math.floor(
                    Math.random()*100
                );

                vezes++;

                if (vezes > 20) {

                    clearInterval(animacao);

                    let final;

                    /* sorteio manual */
                    if (
                        numerosManuais.length === 4
                    ) {

                        final =
                        numerosManuais[rodada];

                    } else {

                        let tentativas = 0; do {
                            final = Math.floor(Math.random()*100);

                            tentativas++;

                        }
                        while (numeros.includes(final) && tentativas < 100);
                    }


                    numeros.push(final);

                    numero.innerText = final;

                    bolas.innerHTML += `
                    <div class="bola">
                    ${final}
                    </div>
                    `;

                    resolve();
                }

            },
                100);
        });
    }

    verificar(numeros);

    botao.disabled = false;
}


/* ==================== */

function falar(texto) {

    const voz = new SpeechSynthesisUtterance(texto);

    voz.lang = "pt-BR";

    voz.rate = 1;

    voz.pitch = 1.2;

    /* VOLUME MÁXIMO */
    voz.volume = 1;

    const vozes = speechSynthesis.getVoices();

    const feminina = vozes.find(v =>

        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("maria") ||
        v.name.toLowerCase().includes("luciana") ||
        v.name.toLowerCase().includes("google português")

    );

    if (feminina) {
        voz.voice = feminina;
    }

    /* cancela falas antigas */
    speechSynthesis.cancel();

    speechSynthesis.speak(voz);
}

/* ===========aplausos========= */

function aplausos() {

    const audio =
    new Audio("aplausos.mp3");

    audio.volume = 0.3;

    audio.play();

}


/*========moeda========*/



function moeda() {

    const audio =
    new Audio("PicPay.mp3");

    audio.volume = 0.4;

    audio.play();

}

/* ==================== */

function confetes() {

    for (let i = 0; i < 150; i++) {

        const confete =
        document.createElement("div");

        confete.className = "confete";

        confete.style.left =
        Math.random()*100 + "vw";

        confete.style.animationDuration =
        (Math.random()*3+2)+"s";

        confete.style.background =
        `hsl(${Math.random()*360},100%,50%)`;

        document.body.appendChild(confete);

        setTimeout(()=> {
            confete.remove();
        }, 5000);
    }
}

/* ==================== */

function verificar(resultado) {

    let ganhou = false;
    let bilheteSorteado = null;
    let idBilhete = null;

    /* procura qualquer bilhete com os números sorteados */
    for (let id in banco) {

        const b = banco[id];

        for (let x = 0; x < 4; x++) {

            const linha =
            b.numeros
            .slice(x*4, (x+1)*4)
            .join("-");

            if (
                linha === resultado.join("-")
            ) {

                bilheteSorteado = b;
                idBilhete = id;

                /* mostra sempre no painel campeão */
                mostrarVencedor(b, id);

                /* se estiver vendido = ganhou */
                if (b.status === "vendido") {

                    confetes();

                    aplausos();

                    moeda();

                    falar(
                        `Parabéns ${b.comprador}, você ganhou o Sorteio no QUARTA DA SORTE!`
                    );

                    document
                    .getElementById(
                        "vencedor"
                    )
                    .innerHTML =
                    "🎰 TEMOS UM GANHADOR VIP";

                    ganhou = true;

                } else {

                    /* se estiver disponível ou reservado */
                    document
                    .getElementById(
                        "vencedor"
                    )
                    .innerHTML =
                    "🏆 PRÊMIO ACUMULADO";

                    falar(
                        `O prêmio foi para o bilhete ${id}, e foi acumulado para o próximo sorteio, Boa Sorte!`
                    );

                }

                break;
            }
        }

        if (bilheteSorteado) break;
    }

    /* caso nenhum bilhete tenha os números */
    if (!bilheteSorteado) {

        document
        .getElementById(
            "vencedor"
        )
        .innerHTML =
        "🏆 PRÊMIO ACUMULADO";

        falar(
            "O prêmio foi acumulado. Boa sorte no próximo sorteio, Boa sorte!"
        );

    }
}
/* ==================== */

function mostrarVencedor(b, id) {

    const area =
    document.getElementById(
        "bilheteSorteado"
    );

    area.innerHTML = "";

    for (let x = 0; x < 4; x++) {

        area.innerHTML += `
        <div class="linha-bolas">

        ${b.numeros
        .slice(x*4, (x+1)*4)
        .map(n=>`
            <div class="numero-bola">
            ${n}
            </div>
            `).join("")}

        </div>
        `;
    }

    let textoStatus = "🟢 DISPONÍVEL";

    if (b.status === "reservado") {
        textoStatus = "🟡 RESERVADO";
    }

    if (b.status === "vendido") {
        textoStatus = "🏆 VENDIDO";
    }

    document
    .getElementById(
        "nomeGanhador"
    )
    .innerHTML = `
    🎟️ Bilhete ${id}
    <br>
    ${textoStatus}
    ${b.comprador ? `<br>👤 ${b.comprador}`: ""}
    `;
}
/* ==================== */

function fazerBackup() {

    const dados = {

        bilhetes: banco,

        data:
        localStorage.getItem(
            "dataSorteio"
        ) || ""

    };

    const blob =
    new Blob(

        [
            JSON.stringify(
                dados,
                null,
                2
            )
        ],

        {
            type: "application/json"
        }

    );

    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "backup-trevo-vip.json";

    link.click();

}
/* ==================== */

function restaurarBackup() {

    const input =
    document.createElement("input");

    input.type = "file";

    input.accept = ".json";

    input.onchange = e => {

        const file =
        e.target.files[0];

        const reader =
        new FileReader();

        reader.onload = async evento => {

            try {

                const dados =
                JSON.parse(
                    evento.target.result
                );

                /* restaura banco */
                banco = dados.bilhetes;

                /* salva no firebase */
                await db.collection("trevo")
                .doc("bilhetes")
                .set(banco);

                /* restaura data */
                localStorage.setItem(
                    "dataSorteio",
                    dados.data || ""
                );

                mostrarData();

                carregarSistema();

                alert(
                    "Backup restaurado com sucesso!"
                );

            }catch(e) {

                alert(
                    "Arquivo inválido"
                );

                console.log(e);

            }

        };

        reader.readAsText(file);

    };

    input.click();

}
/* ==================== */

function liberarTodos() {

    if (
        confirm(
            "Liberar todos os bilhetes?"
        )
    ) {

        for (let id in banco) {

            banco[id].status =
            "livre";

            banco[id].comprador =
            "";

        }

        salvar();

        carregarSistema();

        alert(
            "Todos os bilhetes foram liberados"
        );

    }

}

/* ==================== */

function alterarData() {

    let novaData =
    prompt(
        "Digite a nova data"
    );

    if (!novaData) return;

    localStorage.setItem(
        "dataSorteio",
        novaData
    );

    mostrarData();

    carregarSistema();

    alert(
        "Data alterada"
    );

}



db.collection("trevo")
.doc("bilhetes")
.onSnapshot(async (doc)=> {

    if (doc.exists) {

        banco = doc.data();

        let alterou = false;

        for (let i = 1; i <= TOTAL_BILHETES; i++) {

            if (!banco[i]) {

                let numeros = [];

                for (let linha = 0; linha < 4; linha++) {

                    let usados = [];

                    while (usados.length < 4) {

                        let n = Math.floor(Math.random()*100);

                        if (!usados.includes(n)) {
                            usados.push(n);
                            numeros.push(n);
                        }

                    }

                }

                banco[i] = {
                    numeros: numeros,
                    status: "livre",
                    comprador: ""
                };

                alterou = true;

            }

        }

        if (alterou) {
            await salvar();
        }

    } else {

        banco = criarBilhetes();

        await salvar();

    }

    carregarSistema();
    mostrarData();
});


function reservar(id) {

    if (banco[id].status === "vendido") {
        alert("Este bilhete já foi vendido.");
        return;
    }

    const nome = prompt("Digite seu nome:");

    if (!nome) return;

    banco[id].status = "reservado";
    banco[id].comprador = nome;

    salvar();

    // Não precisa chamar carregarSistema(),
    // o onSnapshot do Firebase atualizará automaticamente.
}

function atualizarContadores() {

    let disponiveis = 0;
    let reservados = 0;
    let vendidos = 0;

    for (let id in banco) {

        if (banco[id].status === "livre") {
            disponiveis++;
        }

        if (banco[id].status === "reservado") {
            reservados++;
        }

        if (banco[id].status === "vendido") {
            vendidos++;
        }

    }

    document.getElementById("totalBilhetes").innerText = TOTAL_BILHETES;
    document.getElementById("disp").innerText = disponiveis;
    document.getElementById("res").innerText = reservados;
    document.getElementById("vend").innerText = vendidos;

}

document.getElementById("btnTodos").onclick = () => {
    filtroAtual = "todos";
    carregarSistema();
};

document.getElementById("btnDisponiveis").onclick = () => {
    filtroAtual = "livre";
    carregarSistema();
};

document.getElementById("btnReservados").onclick = () => {
    filtroAtual = "reservado";
    carregarSistema();
};

document.getElementById("btnVendidos").onclick = () => {
    filtroAtual = "vendido";
    carregarSistema();
};

document.getElementById("buscar").addEventListener("input", function() {

    const texto = this.value.toLowerCase();

    document.querySelectorAll(".ticket").forEach(card => {

        if (card.innerText.toLowerCase().includes(texto)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }

    });

});

async function gerarNovosBilhetes() {

    if (!confirm("Todos os bilhetes atuais serão apagados e novos números serão gerados.\n\nDeseja continuar?")) {
        return;
    }

    banco = criarBilhetes();

    await salvar(banco);

    carregarSistema();

    alert("✅ Novos bilhetes gerados com números de 00 a 99.");
}


/* ==========limpar dados========== */

/*localStorage.removeItem("bilhetes");*/