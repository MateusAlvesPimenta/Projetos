function start() { // Inicio da função start()

    $("#inicio").hide();
	
	$("#fundoGame").append("<div id='jogador' class='anima1'></div>");
	$("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
	$("#fundoGame").append("<div id='inimigo2' ></div>");
	$("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");
    //Principais variáveis do jogo
    var energiaAtual=3;
    var pontos=0;
    var salvos=0;
    var perdidos=0;
    var fimdejogo=false;
    var jogo = {}
    var podeAtirar=true;
    var velocidadeInimigo=5;
    var velocidadeAmigo=2;
    var posicaoY = parseInt(Math.random() * 334);
    var TECLA = {
        W: 87,
        S: 83,
        ENTER: 13,
        };
    var somDisparo=document.getElementById("somDisparo");
    var somExplosao=document.getElementById("somExplosao");
    var musica=document.getElementById("musica");
    var somGameover=document.getElementById("somGameover");
    var somPerdido=document.getElementById("somPerdido");
    var somResgate=document.getElementById("somResgate");

    //Música em loop
    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
    musica.play();

        jogo.pressionou = [];

        //Verifica se o usuário pressionou alguma tecla	
	$(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
        });
    
    
        $(document).keyup(function(e){
           jogo.pressionou[e.which] = false;
        });

    //Game Loop
    jogo.timer = setInterval(loop,30);
    
    function loop() {
        energia();
        placar();
        colisao();
        moveinimigo1()
        moveinimigo2()
        movefundo();
        movejogador();
        moveamigo();
    } // Fim da função loop()
    
    //Função que movimenta o fundo do jogo
	
	function movefundo() {
	
        esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position",esquerda-1);
        
        } // fim da função movefundo()

    function movejogador() {
	
        if (jogo.pressionou[TECLA.W]) {
            var topo = parseInt($("#jogador").css("top"));
            if (topo>=0) {
                $("#jogador").css("top",topo-10);
               // $("#jogador").css("top",topo+10); melhorei
            }
        }
        
        if (jogo.pressionou[TECLA.S]) {
            
            var topo = parseInt($("#jogador").css("top"));
            if (topo<=434) {	
                $("#jogador").css("top",topo+10);
                //$("#jogador").css("top",topo-10);  
            }
        }
        
        if (jogo.pressionou[TECLA.ENTER]) {
            disparo();
		//Chama função Disparo	
	    }

	} // fim da função movejogador()
    
    function moveinimigo1() {

        posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left",posicaoX-velocidadeInimigo);
        $("#inimigo1").css("top",posicaoY);
        if(pontos<0)pontos = 0;
            
            if (posicaoX<=0) {
                if(pontos>0)pontos = pontos-100;
                posicaoY = parseInt(Math.random() * 334);
                $("#inimigo1").css("left",694);
                $("#inimigo1").css("top",posicaoY);
            }
    } //Fim da função moveinimigo1()

    function moveinimigo2() {
        posicaoX = parseInt($("#inimigo2").css("left"));
	    $("#inimigo2").css("left",posicaoX-3);
				
		if (posicaoX<=0) {
            if(pontos>0)pontos = pontos-50;	
		    $("#inimigo2").css("left",775);
		}
    } // Fim da função moveinimigo2()

    function moveamigo() {
	
        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left",posicaoX+velocidadeAmigo);
                    
            if (posicaoX>906) {
            $("#amigo").css("left",0);
                        
            }
    
    } // fim da função moveamigo()
    
    function disparo() {
	somDisparo.play();
        if (podeAtirar==true) {
            
            podeAtirar=false;
            
            topo = parseInt($("#jogador").css("top"))
            posicaoX= parseInt($("#jogador").css("left"))
            tiroX = posicaoX + 190;
            topoTiro=topo+37;
            $("#fundoGame").append("<div id='disparo'></div");
            $("#disparo").css("top",topoTiro);
            $("#disparo").css("left",tiroX);
            
            var tempoDisparo=window.setInterval(executaDisparo, 30);
        
        } //Fecha podeAtirar
     
        function executaDisparo() {
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left",posicaoX+15); 
    
            if (posicaoX>900) {
                            
                window.clearInterval(tempoDisparo);
                tempoDisparo=null;
                $("#disparo").remove();
                podeAtirar=true;
                        
            }
        } // Fecha executaDisparo()
    } // Fecha disparo()

    function colisao() {
        var jogadorComInimigo1 = ($("#jogador").collision($("#inimigo1")));
        var jogadorComInimigo2 = ($("#jogador").collision($("#inimigo2")));
        var inimigo2MataAmigo = ($("#inimigo2").collision($("#amigo")));
        var salvaAmigo = ($("#jogador").collision($("#amigo")));
        var disparoMataInimigo1 = ($("#disparo").collision($("#inimigo1")));
        var disparoMataInimigo2 = ($("#disparo").collision($("#inimigo2")));
        
        
        // jogador com o inimigo1
        if (jogadorComInimigo1.length>0) {
            somExplosao.play();
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X,inimigo1Y);
        
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
            energiaAtual--;
        }

        // jogador com o inimigo2 
        if (jogadorComInimigo2.length>0) {
            somExplosao.play();
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X,inimigo2Y);
            
            $("#inimigo2").remove();
            
            reposicionaInimigo2();
            energiaAtual--;
        }
        
        //Inimigo2 com amigo
        if (inimigo2MataAmigo.length>0) {
            somPerdido.play();
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX,amigoY);
            $("#amigo").remove();
                    
            reposicionaAmigo();
            if(pontos>0)pontos = pontos-100;
            perdidos++;
        }


        // jogador com o amigo
        if (salvaAmigo.length>0) {
            somResgate.play();
            reposicionaAmigo();
            $("#amigo").remove();
            velocidadeAmigo+=0.3;
            pontos=pontos+100;
            salvos++;
        }

        // Disparo com o inimigo1
	    if (disparoMataInimigo1.length>0) {
            somExplosao.play();
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));

            explosao1(inimigo1X,inimigo1Y);
            $("#disparo").css("left",950);
                
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
            velocidadeInimigo+=0.3;
            pontos=pontos+100;
        }
        
        // Disparo com o inimigo2
        if (disparoMataInimigo2.length>0) {
            somExplosao.play();
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();
        
            explosao2(inimigo2X,inimigo2Y);
            $("#disparo").css("left",950);
            
            reposicionaInimigo2();
            pontos=pontos+50;
        }
		
    } //Fim da função colisao()
    
    function explosao1(inimigo1X,inimigo1Y) {
        $("#fundoGame").append("<div id='explosao1'></div");
        $("#explosao1").css("background-image", "url(imgs/explosao.png)");
        var div=$("#explosao1");
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({width:200, opacity:0}, "slow");
        
        var tempoExplosao=window.setInterval(removeExplosao, 1000);
        
        function removeExplosao() {
            
            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao=null;
            
        }
            
    } // Fim da função explosao1()

    //Reposiciona Inimigo2	
    function reposicionaInimigo2() {
	
	    var tempoColisao4=window.setInterval(reposiciona4, 5000);
		
		function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4=null;
			
			if (fimdejogo==false) {
			    $("#fundoGame").append("<div id=inimigo2></div");
			}
        }
    }

	function explosao2(inimigo2X,inimigo2Y) {
	
        $("#fundoGame").append("<div id='explosao2'></div");
        $("#explosao2").css("background-image", "url(imgs/explosao.png)");
        var div2=$("#explosao2");
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({width:200, opacity:0}, "slow");
        
        var tempoExplosao2=window.setInterval(removeExplosao2, 1000);
        
        function removeExplosao2() {
            div2.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2=null;    
        }  
    } // Fim da função explosao2()
    
    //Explosão3
    function explosao3(amigoX,amigoY) {
        $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
        $("#explosao3").css("top",amigoY);
        $("#explosao3").css("left",amigoX);
        var tempoExplosao3=window.setInterval(resetaExplosao3, 1000);
        function resetaExplosao3() {
        $("#explosao3").remove();
        window.clearInterval(tempoExplosao3);
        tempoExplosao3=null;
                
        }

    } // Fim da função explosao3
    
    //Reposiciona Amigo
	function reposicionaAmigo() {
	
        var tempoAmigo=window.setInterval(reposiciona6, 6000);
        
            function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo=null;
            
            if (fimdejogo==false) {
            
            $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
            
            }
        }
    } // Fim da função reposicionaAmigo()
    
    function placar() {
        
        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
        
    } //fim da função placar()
    
    //Barra de energia
    function energia() {

        $("#energia").css("background-image", "url(imgs/energia"+energiaAtual+".png)");
        if(energiaAtual===0){
            gameOver();
        }
    } // Fim da função energia()
    
    //Função GAME OVER
	function gameOver() {
        fimdejogo=true;
        musica.pause();
        somGameover.play();
        window.clearInterval(jogo.timer);
        jogo.timer=null;
        
        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        
        $("#fundoGame").append("<div id='fim'></div>");

        $("#fim").html("<h1> Game Over </h1><h3>Melhor Pontacão: "+pontuaçãoMaxima()+"</h3><p>Sua pontuação foi: " + pontos+"<p>Você Salvou: "+salvos+" amigos</p><p>E perdeu: "+perdidos+" amigos</p>");
        $("#fim").append("<h1>Insira seu nome</h1><input> <br>")
        $("#fim").append("<a id='salve'>Salvar</a> <br><br> <a onclick=voltar()>Voltar</a>");
        document.getElementById('salve').addEventListener('click', salvandoPontuação);
    } // Fim da função gameOver();
    function salvandoPontuação(){
        localStorage.setItem('posição'+localStorage.count,pontos);
        salvandoNome()
    }
} // Fim da função start

//Reinicia o Jogo
function reiniciaJogo() {
    somGameover.pause();
    $("#fim").remove();
    start();
} //Fim da função reiniciaJogo

//volta a tela inicial do jogo
function voltar(){
    somGameover.pause();
    $("#fim").remove();
    $("#rank").remove();
    $("#inicio").show();
}

//Mostra o placar
function mostrarRank(){

    $("#inicio").hide();

    $('#fundoGame').append("<div id='rank'></div>");
    $("#rank").append("<h1>Top 10</h1><a onclick=voltar()>Voltar</a>");
    
    if(localStorage.length>=9){
        var count=9;
    }else var count=localStorage.length-1;

    var pontuações=[];
    for(let i=0;i<=count;i++){

        var posições =localStorage.getItem("posição"+i);
        pontuações.push(posições);
    }
    for(let i=0; i<count;i++){
        var nome=localStorage.getItem('posição'+i+"1");
        var maior=Math.max(...pontuações);
        nome.st
        if(!nome){
            $("#rank").append("<p>"+(i+1)+"° Posição com: "+maior+" pontos<br></p>");
        }
        else{
            $("#rank").append("<p>"+(i+1)+"° Posição <a id='nome'>"+nome+"</a> com: "+maior+" pontos<br></p>");
        }
        var pontuações= pontuações.filter((posição)=>posição!=Math.max(...pontuações));
    }
}

function pontuaçãoMaxima(){
    var pontuações=[];
    for(let i=0;i<localStorage.length-1;i++){
         var posições =localStorage.getItem("posição"+i);
          pontuações.push(posições);
    }
    return Math.max(...pontuações);
}

function salvandoNome(){
    var nome = document.getElementById('nome')
    if(!nome){}

    else{
    localStorage.setItem('posição'+localStorage.count+"1",nome.value);
    localStorage.setItem('count',Number(localStorage.count)+1);
    }
    $("#fim").remove();
    $("#inicio").show();
}
