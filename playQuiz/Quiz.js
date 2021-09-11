'use strict'

const linkwebpage = 'about:blank'
 //Valor ingresado el usuario cuando responde el quiz
const locationurl = window.location.href

if (!locationurl.includes('=')) {
    window.location = linkwebpage
}

const database = firebase.firestore();
const id_doc = locationurl.split('=')[1]
console.log(id_doc)

let uid_person = undefined;

let nameUser, content, quest, idQuest; //nameUser: nombre del usuario que responde, content: variable que guarda el contenido del json, quest: contenedor de cada pregunta y respuestas, idQuest: sirve como comparador entre respuesta correcta o incorrecta
let similary = false;
let loadBar = 0;
let progress = 0;
let contador = 0;
let meet = 0;
let key = false;
const meetText = document.getElementById('meet');
const percentText = document.getElementById('percent');
const results = {
    zero: 'Parece que casi no conoces a fulanito :(', // de 0% a 20%
    twenty: 'Vaya!, deberías hablar más con fulanito', // de 20% a 40%
    fourty: 'Conoces lo suficiente a fulanito, pero podrías acercarte más :)', // 40% a 60%
    sixty: 'Eres muy cercano a fulanito, acertaste la mayoría!', //60% a 80%
    eighty: 'Parece que fulanito tiene gente que la conoce muy bien! acertaste en la gran cantidad', // de 80% a 99%
    houndred: 'Perfecto! lograste acertar en todas las preguntas, conoces muy bien a fulanito!' // 100% 
}
const load = document.querySelector('.load3');
const buttonNext = document.getElementById('next');

document.getElementById('send-email').addEventListener('click', () => {
    window.location.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=mitrivia77@gmail.com';
});

document.getElementById('create').addEventListener('click', () => {
    window.location.href = '../index.html'
});

firebase.auth().signInAnonymously()
  .then((user) => {
      console.log(user)
    // Signed in..
    uid_person = user.user.uid;
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(error)
    window.location.reload()
    // ...
  });

const selectAns = (a) => {
    buttonNext.addEventListener('click', () => {
    for(const cl of quest){
            if(cl.classList.contains('selected')){                    
                if(cl.id != idQuest) {        
                    console.log('No soy la correcta')
                    load.style.width = `${loadBar}%`;
                    load.style.background = '#F33';
                }else{
                    console.log('Soy la correcta');
                    (meet == 0) ? meet = progress : meet = meet + progress;
                    console.log(meet)
                    load.style.width = `${loadBar}%`;
                    load.style.background = 'rgb(93, 209, 245)';
                };  
            };
        }; 
        createQuest(content);
    });
};

const createQuest = arr => { 
    document.querySelector('.load-circle').style.display = 'none'
    let data = Object.values(arr)
    buttonNext.style.visibility = 'hidden';
    if(key == false) {
        progress = 100 / data.length;
        key = true;
    };

    if(loadBar < 100){

        if(loadBar > 50){
            document.querySelector('.titleQuest').style.color = '#fff';
        }

        let data2 = Object.values(data[contador]);
        loadBar = progress + loadBar;
        document.querySelector('.question-answer').innerHTML = '';     
        const fragment = document.createDocumentFragment();
        document.querySelector('.titleQuest').textContent = data[contador].pregunta;

        for(const c of data2){
            const div = document.createElement('DIV');
            const span = document.createElement('SPAN');
            div.classList.add('quest');
            span.classList.add('spanColor');

            

            if(c == data[contador].niceValue) {
                div.id = data[contador].niceValue;
                idQuest = data[contador].niceValue;

                if(similary == false){
                    span.textContent = c;
                    div.appendChild(span);
                    fragment.appendChild(div);
                    similary = true;
                    console.log(c)
                };
            }else if(c != data[contador].pregunta){           
                span.textContent = c;
                console.log(c)
                div.appendChild(span);      
                fragment.appendChild(div);
            };
        };
        document.querySelector('.question-answer').appendChild(fragment);
        quest = document.querySelectorAll('.quest');

        for(let i = 0; i <  quest.length; i ++){
            quest[i].addEventListener('click', () => {
                buttonNext.style.visibility = 'visible';
                for(let cl of  quest){
                    if(cl.classList.contains('selected')){
                        cl.classList.remove('selected');
                        cl.children[0].classList.replace('selectedText','spanColor');
                    };
                };
                quest[i].classList.add('selected');
                quest[i].children[0].classList.replace('spanColor','selectedText');
            });
        };

        contador++;
    }else{
        document.querySelector('.container-content').style.animation = 'desaparecer .5s forwards';
        if(meet <= 20) meetText.textContent = results.zero;
        if(meet > 20 && meet <= 40) meetText.textContent = results.twenty;
        if(meet > 40 && meet <= 60) meetText.textContent = results.fourty;
        if(meet > 60 && meet <= 80) meetText.textContent = results.sixty;
        if(meet > 80 && meet <= 99) meetText.textContent = results.eighty;
        if(meet >= 100) meetText.textContent = results.houndred;
        percentText.textContent = `Conoces a fulanito en un ${meet}%`;
        document.querySelector('.modal').style.animation = 'aparecerModal 1.2s forwards';
    };
    similary = false;
    selectAns()
};

document.getElementById('send').addEventListener('click', e => {
    e.preventDefault();
    if(document.getElementById('name').value.length < 1) return document.querySelector('.err').textContent = 'Debes ingresar un nombre antes de continuar';
    else nameUser = document.getElementById('name').value;
    document.querySelector('.container').style.animation = 'aparecer .5s forwards';
    e.path[2].style.opacity = '0';
});

async function getGame(callback) {
    try{
        const gameRef = database.collection('quizpersonalizados').doc(id_doc);
        const doc = await gameRef.get();
        const data = doc.data()
        const Game = Object.values(data.Game)
        content = Game;
    
        console.info(Game)
    
        return callback(content)
    } catch (err){
        callback(content);
    };
}
setTimeout(async()=>{
    await getGame(createQuest)
});

