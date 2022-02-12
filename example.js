const puppeteer = require('puppeteer');
var validate = require("validate.js");

const validParamsUrl = {
    website: {
        url: true,
        message: false,
        allowLocal: false
    }
};



const palavrasQueClassificamComoNegocio = [
    "Orçamento",
    "Contato",
    "Fale Conosco",
    "Entre em contato",
];

let negociosPossiveis = [];

async function  getNegociosPossiveis (links) {

    for(let link of links) {
        try {
            //Verifica se é uma url valida
            if(typeof validate({website: link}, {website: {url: true}}) == "undefined") {
                let browser = await puppeteer.launch();
                let page = await browser.newPage();
                //Abrindo o link
                await page.goto(link);
                //Pegando o html do link
                let conteudoLink = await page.content();
                //Pega o <header> do conteudo da pagina
                // const header = await conteudoLink.$eval('header', header => header.innerHTML);
                console.log(conteudoLink);
                let header = conteudoLink.getElementsByTagName('header')[0].innerHTML;
                //Se houver no header as palavras que classificam a pagina como um negócio, adicione ele em um array
                // if (palavrasQueClassificamComoNegocio.some(palavra => header.includes(palavra))) {
                //     // negociosPossiveis.push(link);
                //     console.log(link);
                // }
            }
        } catch (error) {
            console.log(error);
        }
    }
}

(async () => {
    //Iniciando o browser
    const browser = await puppeteer.launch();
    //Criando uma nova pagina
    const page = await browser.newPage();
    //Indo para uma busca no google
    await page.goto('https://www.google.com/search?q=agente+de+portaria');
    //Pegando o html da busca no google
    const conteudoBusca = await page.content();
    //Pegando todos os links da busca
    const links = await page.$$eval('a', as => as.map(a => a.href));
    //Pegando todos os links que não contenham "google.com"
    const linksSemGoogle = links.filter(link => !link.includes('google.com'));
    //Pegando todos os links que não contenham "youtube.com"
    const linksSemYoutube = linksSemGoogle.filter(link => !link.includes('youtube.com'));
    //Pegue apenas o 5 primeiros links
    const linksParaPesquisa = linksSemYoutube.slice(0, 5);
    //Percorrendo todos os links que não contenham "youtube.com" ou "google.com"
    console.log(linksParaPesquisa);
    // await getNegociosPossiveis(linksParaPesquisa);

    //Fechando o browser        
    await browser.close();

    //Mostrando os negócios possíveis
    console.log(negociosPossiveis);
})();

