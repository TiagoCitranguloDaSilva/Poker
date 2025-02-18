

const simboloCartas = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

var cartas = []
var naipes = ["Espadas", "Copas", "Ouros", "Paus"]
let ordemCombinacoes = [
  "Royal Flush",
  "Straight Flush",
  "Four of a Kind",
  "Full House",
  "Flush",
  "Straight",
  "Three of a Kind",
  "Two Pair",
  "One Pair",
  "High Card"
];


const qtdeJogadores = 4
var cartasJogadores = []
var elementosMaoJogadores = []
var dadosJogadores = []
var dadosExtrasJogadores = []
var combinacaoJogadores = []

var cartasMesa = []
var cartasMesaAmostra = 0
const mesaComunitaria = document.getElementById("cartasComunitarias")
const mesa = document.getElementById("mesa")
var qtdeApostas = 0
var valorApostaRodada = 0
var poteAposta = 0


for (let c = 0; c < qtdeJogadores; c++) {

  let jogador = document.createElement("div")
  jogador.classList.add("jogador")
  jogador.id = `jogador${c}`

  let maoJogador = document.createElement("div")
  maoJogador.id = `maoJogador${c}`
  maoJogador.classList.add("maoJogador")

  let containerCombinacao = document.createElement("div")
  containerCombinacao.classList.add("combinacao")

  jogador.appendChild(maoJogador)
  jogador.appendChild(containerCombinacao)

  mesa.appendChild(jogador)

}

novaRodada()

function novaRodada() {

  poteAposta = 0
  valorApostaRodada = 0

  for (let c = 0; c < qtdeJogadores; c++) {
    cartasJogadores.push([])

    elementosMaoJogadores.push(document.getElementById(`maoJogador${c}`))

    dadosJogadores.push([])
    dadosExtrasJogadores.push([])
    combinacaoJogadores.push([])
  }

  for (let c = 0; c < naipes.length; c++) {
    cartas.push(simboloCartas.slice())
  }

  darCartasJogadores()
  darCartasComunitarias()

  apostar().then((aposta) => {
    segundaRodada(aposta)
  })







}


function darCartasJogadores() {

  for (let c = 0; c < qtdeJogadores; c++) {
    for (let d = 0; d < 2; d++) {
      let cartaEscolhida = cartaAleatoria()
      cartasJogadores[c].push(cartaEscolhida)
      let elementoCarta = criarCartaVisualmente(cartaEscolhida[0], classes = [cartaEscolhida[1]])

      elementosMaoJogadores[c].appendChild(elementoCarta)
    }
  }

}

function cartaAleatoria() {
  let naipe = Math.floor(Math.random() * cartas.length)
  let indiceCarta = Math.floor(Math.random() * cartas[naipe].length)
  let carta = cartas[naipe][indiceCarta]

  cartas[naipe].splice(indiceCarta, 1)
  if (cartas[naipe].length == 0) {
    cartas.splice(naipe, 1)
  }

  return [carta, naipes[naipe]]
}

function criarCartaVisualmente(valor, classes = null) {
  let carta = document.createElement("div")
  carta.classList.add("carta")
  // carta.classList.add("escondido")


  let frente = document.createElement("div")
  frente.classList.add("frente")
  frente.innerText = valor

  let verso = document.createElement("div")
  verso.classList.add("verso")

  carta.appendChild(frente)
  carta.appendChild(verso)

  if (classes != null) {
    classes.forEach(classe => {
      carta.classList.add(classe)
    });
  }

  return carta

}

function darCartasComunitarias() {

  for (let c = 0; c < 5; c++) {
    let cartaEscolhida = cartaAleatoria()
    cartasMesa.push(cartaEscolhida)

    cartasMesaAmostra = 0

    let elementoCarta = criarCartaVisualmente(cartaEscolhida[0], classes = [cartaEscolhida[1]])

    mesaComunitaria.appendChild(elementoCarta)
  }

}

function mostrarCartaComunitaria() {
  if (cartasMesaAmostra < 5) {
    mesaComunitaria.children[cartasMesaAmostra].classList.add("mostrar")
    cartasMesaAmostra++
    verificacoesCombinacoes()
    mostrarCombinacaoMaisForte()
  }

}

function verificacoesCombinacoes() {


  for (let jogador = 0; jogador < qtdeJogadores; jogador++) {



    // COMBINAÇÔES

    let highCardJogador
    let qtdePares = 0
    let qtdeTrincas = 0
    let qtdeQuadras = 0
    let existeStraight = false
    let existeStraightFlush = false
    let existeRoyalFlush = false
    let existeFlush = false
    let existeDoisPares = false
    let existeFullHouse = false


    // DADOS EXTRAS

    let ordemHighCards
    let repeticoesCartas
    let cartasStraight = []
    let cartasStraightFlush = []
    let cartasRoyalFlush = []
    let cartasFlush = []




    let cartasJogador = []

    for (let c = 0; c < cartasMesaAmostra; c++) {
      cartasJogador.push(cartasMesa[c])
    }

    for (let c = 0; c < 2; c++) {
      cartasJogador.push(cartasJogadores[jogador][c])
    }

    let temp

    temp = highCard(cartasJogador)

    highCardJogador = temp[0]

    ordemHighCards = temp[1]


    temp = paresTrincasQuadras(cartasJogador)

    repeticoesCartas = temp[0]

    qtdePares = temp[1][0]
    qtdeTrincas = temp[1][1]
    qtdeQuadras = temp[1][2]

    if (qtdePares > 1) {
      existeDoisPares = true
    }

    if (qtdeTrincas > 0 && qtdePares > 0) {
      existeFullHouse = true
    }



    temp = straightEStraightFlushRoyal(ordemHighCards)
    if (temp[0]) {
      existeStraight = true
      cartasStraight = temp[1].slice()

      if (temp[2]) {
        existeStraightFlush = true
        cartasStraightFlush = temp[3].slice()

        if (temp[4]) {
          existeRoyalFlush = true
          cartasRoyalFlush = temp[5].slice()
        }
      }

    }

    temp = flush(ordemHighCards)

    if (temp[0]) {

      existeFlush = true
      cartasFlush = temp[1]

    }





    // SALVANDO OS DADOS


    dadosJogadores[jogador] = [
      ["existeRoyalFlush", existeRoyalFlush],
      ["existeStraightFlush", existeStraightFlush],
      ["qtdeQuadras", qtdeQuadras],
      ["existeFullHouse", existeFullHouse],
      ["existeFlush", existeFlush],
      ["existeStraight", existeStraight],
      ["qtdeTrincas", qtdeTrincas],
      ["existeDoisPares", existeDoisPares],
      ["qtdePares", qtdePares],
      ["highCard", highCardJogador]
    ]

    dadosExtrasJogadores[jogador] = [
      ["ordemHighCards", ordemHighCards],
      ["repeticoesCartas", repeticoesCartas],
      ["cartasStraight", cartasStraight],
      ["cartasStraightFlush", cartasStraightFlush],
      ["cartasRoyalFlush", cartasRoyalFlush],
      ["cartasFlush", cartasFlush]
    ]

  }


}

function highCard(cartasJogador) {

  let ordemDescrescente = []

  for (let c = simboloCartas.length - 1; c >= 0; c--) {

    for (let d = 0; d < cartasJogador.length; d++) {
      if (cartasJogador[d][0] == simboloCartas[c]) {

        ordemDescrescente.push(cartasJogador[d])
      }
    }

  }



  return [ordemDescrescente[0], ordemDescrescente]
}

function paresTrincasQuadras(cartasJogador) {

  let cartasOrdenadas = []

  for (let c = simboloCartas.length - 1; c >= 0; c--) {

    for (let d = 0; d < cartasJogador.length; d++) {

      if (simboloCartas[c] == cartasJogador[d][0]) {
        cartasOrdenadas.push(cartasJogador[d])
      }

    }

  }

  let repeticoes = []

  for (let c = 0; c < cartasOrdenadas.length; c++) {

    let contadorRepeticoesCarta = 0
    let cartasRepetidas = []

    for (let d = 0; d < cartasOrdenadas.length; d++) {

      if (cartasOrdenadas[c][0] == cartasOrdenadas[d][0]) {

        jaExiste = false

        for (let e = 0; e < repeticoes.length; e++) {

          if (repeticoes[e][0] == cartasOrdenadas[d][0]) {
            jaExiste = true
            break
          }

        }
        if (!jaExiste) {

          contadorRepeticoesCarta++
          cartasRepetidas.push(cartasOrdenadas[d])
        }
      }
    }
    if (contadorRepeticoesCarta != 0) {
      repeticoes.push([cartasOrdenadas[c][0], contadorRepeticoesCarta, cartasRepetidas])
    }

  }

  let qtdesCombinacoes = [0, 0, 0]

  repeticoes.forEach(repetido => {
    switch (repetido[1]) {
      case 2:
        qtdesCombinacoes[0]++
        break

      case 3:
        qtdesCombinacoes[1]++
        break

      case 4:
        qtdesCombinacoes[2]++
        break
    }
  });

  return [repeticoes, qtdesCombinacoes]



}

function straightEStraightFlushRoyal(cartasOrdenadas) {

  let cartasVerificacao = cartasOrdenadas.slice()

  let cartasArrumadas = []




  for (let c = 0; c < cartasOrdenadas.length; c++) {

    for (let d = 0; d < cartasVerificacao.length; d++) {


      if (cartasOrdenadas[c][0] == cartasVerificacao[d][0]) {
        let existe = false


        for (let e = 0; e < cartasArrumadas.length; e++) {
          if (cartasArrumadas[e][0] == cartasVerificacao[d][0]) {
            cartasArrumadas[e][1].push(cartasVerificacao[d][1])
            existe = true
          }
        }

        if (!existe) {
          cartasArrumadas.push([cartasVerificacao[d][0], [cartasVerificacao[d][1]]])


          cartasVerificacao.splice(d, 1)
        }

      }

    }


  }
  if (cartasArrumadas.length < 5) {
    return [false]
  }

  for (c = 0; c < cartasArrumadas.length; c++) {

    let indiceCarta
    let cartasStraight = [cartasArrumadas[c]]




    existeStraight = true


    for (let e = 0; e < simboloCartas.length; e++) {

      if (cartasArrumadas[c][0] == simboloCartas[e]) {

        indiceCarta = e

      }

    }

    for (let d = 1; d < 5; d++) {

      if (c + d >= cartasArrumadas.length || indiceCarta - d < 0) {
        existeStraight = false
        break
      }

      if (cartasArrumadas[c + d][0] != simboloCartas[indiceCarta - d]) {
        existeStraight = false

        break
      } else {
        cartasStraight.push([cartasArrumadas[c + d][0], cartasArrumadas[c + d][1]])
      }

    }

    if (existeStraight) {

      let naipe

      let straightFlush

      let mesmoNaipe



      for (let naipePrimeiraCarta = 0; naipePrimeiraCarta < cartasStraight[0][1].length; naipePrimeiraCarta++) {

        naipe = cartasStraight[0][1][naipePrimeiraCarta]

        straightFlush = [[cartasStraight[0][0], naipe]]

        for (let cartasDoStraight = 1; cartasDoStraight < cartasStraight.length; cartasDoStraight++) {

          mesmoNaipe = false

          for (let naipeCartasStraight = 0; naipeCartasStraight < cartasStraight[cartasDoStraight][1].length; naipeCartasStraight++) {

            if (cartasStraight[cartasDoStraight][1][naipeCartasStraight] == naipe) {
              straightFlush.push([cartasStraight[cartasDoStraight][0], naipe])
              mesmoNaipe = true
            }

          }
          if (!mesmoNaipe) {
            break
          }


        }

      }

      let retorno = [true, cartasStraight]

      if (straightFlush.length == 5) {

        if (straightFlush[0][0] == "A") {
          let royalFlush = straightFlush
          retorno.push(true, royalFlush)
        } else {
          retorno.push(false, [])
        }
        retorno.push(true, straightFlush)
      } else {
        retorno.push(false, [straightFlush])
      }


      return retorno
    }

  }
  return [false]

}

function flush(cartasJogador) {

  let cartasVerificacao = cartasJogador.slice()

  let cartasOrganizadas = []

  for (let c = 0; c < cartasJogador.length; c++) {

    for (let d = 0; d < cartasVerificacao.length; d++) {

      if (cartasJogador[c][0] == cartasVerificacao[d][0]) {

        let jaExiste = false

        for (let e = 0; e < cartasOrganizadas.length; e++) {
          if (cartasOrganizadas[e][0] == cartasVerificacao[d][0]) {
            jaExiste = true
            cartasOrganizadas[e][1].push(cartasVerificacao[d][1])
          }
        }
        if (!jaExiste) {
          cartasOrganizadas.push([cartasVerificacao[d][0], [cartasVerificacao[d][1]]])
          cartasVerificacao.splice(d, 1)
        }
      }

    }

  }


  if (cartasOrganizadas.length < 5) {
    return [false]
  }

  let naipe


  for (let naipeCartaPrincipal = 0; naipeCartaPrincipal < cartasOrganizadas[0][1].length; naipeCartaPrincipal++) {

    naipe = cartasOrganizadas[0][1][naipeCartaPrincipal]
    let flush = [[cartasOrganizadas[0][0], naipe]]

    for (let outrasCartas = 1; outrasCartas < cartasOrganizadas.length; outrasCartas++) {

      for (let naipeOutrasCartas = 0; naipeOutrasCartas < cartasOrganizadas[outrasCartas][1].length; naipeOutrasCartas++) {

        if (naipe == cartasOrganizadas[outrasCartas][1][naipeOutrasCartas]) {
          flush.push([cartasOrganizadas[outrasCartas][0], cartasOrganizadas[outrasCartas][1][naipeOutrasCartas]])
        }

      }

    }

    if (flush.length >= 5) {

      let retorno = flush.slice(0, 5)

      return [true, retorno]

    }

  }

  return [false]


}

function mostrarCombinacaoMaisForte() {


  for (let c = 0; c < elementosMaoJogadores.length; c++) {
    let elementoMao = elementosMaoJogadores[c].parentNode.querySelector(".combinacao")
    let achouCombinacao = false

    for (let d = 0; d < dadosJogadores[c].length - 1; d++) {

      if (dadosJogadores[c][d][1]) {
        achouCombinacao = true
        combinacaoJogadores[c] = ordemCombinacoes[d]
        if (elementosMaoJogadores[c].children[0].classList.contains("mostrar")) {
          elementoMao.innerText = ordemCombinacoes[d]
        }
        break
      }

    }
    if (!achouCombinacao) {
      if (elementosMaoJogadores[c].children[0].classList.contains("mostrar")) {
        elementoMao.innerText = "High Card"
      }
      combinacaoJogadores[c] = "High Card"
    }


  }

}

function finalizar() {

  let ordemGanhadores = []

  for (let c = 0; c < ordemCombinacoes.length; c++) {

    for (let d = 0; d < combinacaoJogadores.length; d++) {

      if (ordemCombinacoes[c] == combinacaoJogadores[d]) {

        let jaExiste = false
        for (let e = 0; e < ordemGanhadores.length; e++) {

          if (ordemGanhadores[e][0] == combinacaoJogadores[d]) {
            jaExiste = true
            ordemGanhadores[e][1].push(d)
          }
        }

        if (!jaExiste) {
          ordemGanhadores.push([ordemCombinacoes[c], [d]])
        }
      }

    }

  }

  elementosMaoJogadores.forEach(maoJogadores => {


    if (!maoJogadores.children[0].classList.contains('mostrar')) {
      setTimeout(() => { maoJogadores.children[0].classList.add('mostrar') }, 300)
      setTimeout(() => { maoJogadores.children[1].classList.add('mostrar') }, 400)
      setTimeout(() => {
        verificacoesCombinacoes()
        mostrarCombinacaoMaisForte()
      }, 500)

    }


  });

  setInterval(() => {
    document.querySelector('main').classList.add('finalizado')

    ordemGanhadores[0][1].forEach(idJogador => {
      document.querySelector(`#jogador${idJogador}`).classList.add("vencedor")
    });
  }, 2000)


}

async function apostar() {
  let aposta = []
  let contagem = 0
  while (contagem < qtdeJogadores) {
    let apostaAtual = await realizarAposta(contagem);
    if (apostaAtual) {
      aposta.push(apostaAtual);
      contagem++;
      await new Promise(resolve => setTimeout(resolve, 1200))
    }
  }
}

function realizarAposta(idJogador) {
  valorApostaRodada = 10
  return new Promise((resolve, reject) => {
    console.log(`Pote: ${poteAposta}`)
    if (idJogador == 0) {
      setTimeout(() => {
        telaDeApostaUsuario()

      let botaoApostaCall = document.querySelector("#botaoApostaCall")
      botaoApostaCall.addEventListener("click", () => {
        console.log("Call")
        poteAposta += valorApostaRodada
        document.querySelector("#telaAposta").classList.remove("mostrarTelaAposta")
        resolve("Eu apostei")
      }, { once: true })

      let botaoApostaFold = document.querySelector("#botaoApostaFold")
      botaoApostaFold.addEventListener("click", () => {
        console.log("Fold")
        document.querySelector("#telaAposta").classList.remove("mostrarTelaAposta")
        resolve("Eu apostei")
      }, { once: true })

      let botaoApostaRaise = document.querySelector("#botaoApostaRaise")
      botaoApostaRaise.addEventListener("click", () => {
        console.log("Raise")
        document.querySelector("#telaAposta").classList.remove("mostrarTelaAposta")
        resolve("Eu apostei")
      }, { once: true })
      
      }, 1000)
      
    } else {
      poteAposta += valorApostaRodada
      resolve("Apostado")
    }
  })

}

function telaDeApostaUsuario() {
  document.querySelector("#telaAposta").classList.add("mostrarTelaAposta")
}

function segundaRodada(aposta) {
  let cartasJogadorPrincipal = elementosMaoJogadores[0].children
  setTimeout(() => { cartasJogadorPrincipal[0].classList.add('mostrar') }, 700)
  setTimeout(() => { cartasJogadorPrincipal[1].classList.add('mostrar') }, 800)

  setTimeout(() => {
    verificacoesCombinacoes()
    mostrarCombinacaoMaisForte()
  }, 900)

  setTimeout(() => { mostrarCartaComunitaria() }, 1500)
  setTimeout(() => { mostrarCartaComunitaria() }, 1600)
  setTimeout(() => { mostrarCartaComunitaria() }, 1700)
  setTimeout(() => {
    apostar().then((aposta) => {
      terceiraRodada(aposta)
    })
  }, 2100)
}

function terceiraRodada(aposta){
  setTimeout(() => { mostrarCartaComunitaria() }, 1000)
  setTimeout(() => {
    apostar().then((aposta) => {
      quartaRodada(aposta)
    })
  }, 2100)
}

function quartaRodada(aposta){
  setTimeout(() => { mostrarCartaComunitaria() }, 1000)
  setTimeout(() => {
    apostar().then((aposta) => {
      finalizar()
    })
  }, 2100)
}