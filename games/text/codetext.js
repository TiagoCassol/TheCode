// Choose accent mode. If true, then accent must be correct. If false, accents won't matter. 
var accentMode = true

var answer = null;
var textoOriginal = "";
// Função chamada quando a página é carregada
async function onPageLoad() {
  try {
    answer = await getRandomTitle();
    console.log('Título obtido:', answer); 
    if (answer && answer.id_title) {
      const textoOriginal = await getTextForTitle(answer);
      console.log('Texto original:', textoOriginal); 
      const textoElement = document.getElementById('texto');

      if (textoElement) {
        computedtext = computeText(answer.title, textoOriginal);
        console.log('Texto oal:', answer.title); 
        // console.log('Texto computado:', computedtext);
        textoElement.innerHTML = computedtext;
      } else {
        console.error('Elemento HTML não encontrado: texto'); 
      }
    } else {
      console.error('Resposta inválida do título:', answer); 
    }
  } catch (error) {
    console.error('Erro ao carregar a página:', error); 
  }
}


var whitelist = ["often ", "as", "is", "a", "that", "is", "of", "the", "of", "along", "and", "As", "use", "on", "the", "for", "often", "All", "have", "a", "to", "the", "on", "is", "a", "often", "in", "that", "to", "the", "has", "and", "and", "has", "for", "with", "and", "the", "The", "does", "not", "any", "such", "as", "or", "the", "or", "other", "for", "were", "only", "in", "but", "are", "now", "of", "some", "and", "a", "of", "The", "most", "for", "this", "is", "Although", "and", "are", "in", "and", "the", "are", "and", "in"];

function openNav() {
  document.getElementById("myNav").style.width = '45%';
}

function closeNav() {
  document.getElementById("myNav").style.width = '0%';
}
window.onload = onPageLoad;

async function getRandomTitle() {
  try {
    const response = await fetch('http://localhost:3000/titlelist');
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const titleList = await response.json();

    const randomIndex = Math.floor(Math.random() * titleList.length);
    const randomTitle = titleList[randomIndex];

    return randomTitle;
  } catch (error) {
    console.error('Erro ao obter título:', error);
    throw error; // Repassa o erro para a função chamadora
  }
}

function getTextForTitle(title) {
  if (!title || !title.id_title) {
    console.error('Título inválido:', title);
    return Promise.resolve(''); // Retorna uma string vazia se o título for inválido
  }

  // console.log('Obtendo texto para o título:', title); // Verifique o título recebido

  return fetch(`http://localhost:3000/titlelist/${title.id_title}`)
    .then(response => {
      console.log('Resposta da API:', response); // Verifique o objeto de resposta
      if (response.ok) {
        return response.json();
      } else {
        console.error('Erro na resposta da API:', response.statusText);
        return ''; // Retorna uma string vazia se a resposta não for ok
      }
    })
    .then(data => {
      // console.log('Dados recebidos:', data); // Verifique os dados recebidos
      return data.text || ''; // Retorna o texto ou uma string vazia se não existir
    })
    .catch(error => {
      console.error('Erro ao obter texto:', error);
      return ''; // Retorna uma string vazia em caso de erro
    });
}



 //define o início de uma tabela com três colunas para exibir informações de pseudo e propostas.
 var begin = "<table class=\"w3-table\"><tr><th>Pseudo</th><th>Proposition</th><th>Occurences</th></tr>"
 //string vazia para ser usada posteriormente para armazenar dados.
 var propositions = ""
 var end = "</table>"
 // pode ser usada para sinalizar se algo foi encontrado ou não.
 var found = false;
 //A matriz é inicializada como vazia e é usada posteriormente para armazenar várias proposições.
 var allPropositions = []


 var computedtext = computeText(textoOriginal);
 document.getElementById("texto").innerHTML = computedtext;


 document.addEventListener('keydown', function (event) {
   if (event.keyCode === 13) {
     palpite();
   }
 });

 function nextText() {
   location.reload();
 }

 var guessedWords = []


 async function palpite() {
  var message = document.getElementById("entrada-texto").value;
  
  if (message === "") {
    alert('please type a word');
    return;
  } else if (whitelist.includes(message)) {
    alert('already in text');
    return;
  } else if (guessedWords.includes(message)) {
    alert('word already guessed');
    return;
  }

  guessedWords.push(message);
  console.log(guessedWords);

  var divNumero = document.getElementById("numero");
  var numeroAtual = parseInt(divNumero.innerHTML);
  var novoNumero = numeroAtual + 1;
  divNumero.innerHTML = novoNumero;

  // Adicionar valor à div de erros
  var divErros = document.querySelector(".erros");
  divErros.innerHTML += message + "<br>";

  var valorInput = document.getElementById("entrada-texto").value;

  let texto = computedtext;
  let palavra = message;

  function contarPalavras(texto, palavra) {
    let contador = 0;
    const palavraMinuscula = palavra.toLowerCase();
    const palavras = texto.toLowerCase().match(/\b\w+([-']\w+)*\b/g);

    if (!palavras) {
      return contador;
    }

    for (let i = 0; i < palavras.length; i++) {
      if (palavras[i].toLowerCase() === palavraMinuscula && palavras[i] !== '') {
        contador++;
      }
    }
    contador = contador / 2;
    return contador;
  }

  // Insere o valor do input na div attempt
  let resultado = contarPalavras(texto, palavra);
  document.getElementById("entrada-texto").value = "";
  var divResultado = document.getElementById("result");
  var divResults = document.getElementById("results");
  result = resultado + " -  " + valorInput;
  divResultado.innerHTML = result;
  divResults.innerHTML += result + "<br>";

  // Chama a função que verifica se a mensagem corresponde ao título
  computeMessage(message, answer.title);
}

function computeMessage(message, answerTitle) {
  var ok = true;
  var alphabet = "abcdefghijklmnopqrstuvwxyz1234567890";

  // Verifica se message é uma string
  if (typeof message !== 'string') {
    console.error('message não é uma string:', message);
    return;
  }

  for (var i = 0; i < message.length; i++) {
    if (!alphabet.includes(message[i].toLowerCase())) {
      ok = false;
    }
  }

  if (ok && message.length <= 26 && !found) {
    var allOccurences;
    if (accentMode) {
      allOccurences = document.getElementsByClassName(message.toLowerCase());
    } else {
      allOccurences = document.getElementsByClassName(message.toLowerCase().latinise());
    }

    for (var i = 0; i < allOccurences.length; i++) {
      allOccurences[i].classList.remove("notfound");
      allOccurences[i].classList.add("animate-color");
    }
    if (!document.getElementById("texto").innerHTML.toLowerCase().split("</h1>")[0].includes("notfound")) {
      found = true;
      var allOccurences = document.getElementsByClassName("thisisaword");
      for (var i = 0; i < allOccurences.length; i++) {
        allOccurences[i].classList.remove("notfound");
      }
    }
  }

  if (typeof answerTitle !== 'string') {
    console.error('answerTitle não é uma string:', answerTitle);
    return;
  }

  if (accentMode && message.toLowerCase() == answerTitle.toLowerCase()) {
    found = true;
    var allOccurences = document.getElementsByClassName("thisisaword");

    for (var i = 0; i < allOccurences.length; i++) {
      allOccurences[i].classList.remove("notfound");
    }
    var entradaTexto = document.getElementById("entrada-texto");
    var botao = document.getElementById("botao");
    document.getElementById("numero").style.display = "block";
    document.getElementById("resp").style.display = "block";
    document.getElementById("resposta").style.display = "block";
    document.getElementById("nextGame").style.display = "block";
    entradaTexto.style.display = "none";
    botao.style.display = "none";
  }
}

// Função para processar o texto original
function computeText(titulo, textoOriginal) {
  if (!textoOriginal) {
    console.error("textoOriginal está undefined ou vazio:", textoOriginal);
    return "";
  }
  var alphabet = "abcdefghijklmnopqrstuvwxyz1234567890éèêçùàâœîôûïöäüë";
  var computedtext = "";
  var lines = textoOriginal.split('\n');
  var outputline = "";

  // Adiciona o título como a primeira linha
  lines.unshift(titulo);

  for (var i = 0; i < lines.length; i++) {
    outputline = "";
    if (lines[i].length > 0) {
      var newword = "";
      for (var j = 0; j < lines[i].length; j++) {
        if (alphabet.includes(lines[i][j].toLowerCase())) {
          newword += lines[i][j];
        } else {
          if (newword.length > 0) {
            if (whitelist.includes(newword)) {
              outputline += newword;
            } else {
              if (accentMode) {
                outputline += "<span class=\"notfound thisisaword " + newword + "\">" + newword + "</span>";
              } else {
                outputline += "<span class=\"notfound thisisaword " + newword.latinise() + "\">" + newword + "</span>";
              }
            }
            newword = "";
          }
          outputline += lines[i][j];
        }
      }
      if (newword.length > 0) {
        if (accentMode) {
          outputline += "<span class=\"notfound thisisaword " + newword + "\">" + newword + "</span>";
        } else {
          outputline += "<span class=\"notfound thisisaword " + newword.latinise() + "\">" + newword + "</span>";
        }
        newword = "";
      }
    } else {
      outputline = "";
    }
    if (i == 0) {
      lines[i] = "<h2>" + outputline + "</h2> <br>";
    } else {
      lines[i] = "<p>" + outputline + "</p>";
    }
    computedtext += lines[i];
  }
  return computedtext;
}