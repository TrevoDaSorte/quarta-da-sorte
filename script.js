document.addEventListener("DOMContentLoaded", () => {

    // Quantidade de bilhetes
    const TOTAL_BILHETES = 250;

    const lista = document.getElementById("listaBilhetes");
    const botaoComprar = document.getElementById("btnComprar");


    // Criar bilhetes na tela
    function carregarBilhetes() {

        lista.innerHTML = "";


        for (let i = 1; i <= TOTAL_BILHETES; i++) {

            const bilhete = document.createElement("div");

            bilhete.className = "bilhete";

            bilhete.textContent = 
                "🎟️ " + i.toString().padStart(3,"0");


            bilhete.addEventListener("click", () => {

                selecionarBilhete(i);

            });


            lista.appendChild(bilhete);

        }

    }



    function selecionarBilhete(numero) {

        alert(
            "Você escolheu o bilhete nº " +
            numero.toString().padStart(3,"0")
        );

    }



    botaoComprar.addEventListener("click", () => {

        alert(
            "Escolha um bilhete disponível abaixo 🍀"
        );

        lista.scrollIntoView({
            behavior:"smooth"
        });

    });



    carregarBilhetes();


});