'use strict'

let content;
let quest;
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
const load = document.querySelector('.load2');
const buttonNext = document.getElementById('next');

const selectAns = (a) => {

    buttonNext.addEventListener('click', () => {
        for(const cl of  quest){
            if(cl.classList.contains('selected')){                    
                if(cl.id != 1) {        
                    load.style.width = `${loadBar}%`;
                    load.style.background = '#F33';
                }else{
                    meet += progress;                      
                    load.style.width = `${loadBar}%`;
                    load.style.background = '#2af';
                };  
            }
        }; 
        createQuest(content);
    });
};

const createQuest = arr => { 
    buttonNext.style.opacity = '0';
    if(key == false) {
        progress = 100 / arr.length;
        key = true;
    };

    if(loadBar < 100){

        if(loadBar > 50){
            console.log('a')
            document.querySelector('.titleQuest').style.color = '#fff';
        }

        loadBar = progress + loadBar;
        document.querySelector('.question-answer').innerHTML = '';
        let data = Object.values(arr[contador]);
        const fragment = document.createDocumentFragment();
        document.querySelector('.titleQuest').textContent = arr[contador].ask;
        for(let i = 1; i < data.length; i ++){
            console.log(i);
            const div = document.createElement('DIV');
            const span = document.createElement('SPAN');
            div.classList.add('quest');
            span.classList.add('spanColor');
    
            if(data[i].includes('1')){
                div.id = data[i].slice(0, 1);
                span.textContent = data[i].replace('1', ' ').trim();
            } else span.textContent = data[i];
            
            div.appendChild(span);
            fragment.appendChild(div);
        };
        document.querySelector('.question-answer').appendChild(fragment);
        quest = document.querySelectorAll('.quest');

        for(let i = 0; i <  quest.length; i ++){
            quest[i].addEventListener('click', () => {
                buttonNext.style.opacity = '1';
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
        percentText.textContent = `Conoces a fulanito un ${meet}%`
        document.querySelector('.modal').style.animation = 'aparecerModal 1.2s forwards';
    };
};

const getQuest = async (fn) => {
    if(content != undefined) return selectAns()
    const data = await fetch('quest.txt');
    const res = await data.json();
    content = res.quest;
    fn(content);
    selectAns();
};

document.getElementById('send').addEventListener('click', e => {
    e.preventDefault();
    if(document.getElementById('name').value.length < 1) return document.querySelector('.err').textContent = 'Debes ingresar un nombre antes de continuar'
    document.querySelector('.container').style.animation = 'aparecer .5s forwards'
    e.path[2].style.opacity = '0';
    getQuest(createQuest);
});