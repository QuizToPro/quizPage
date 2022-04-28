'use strict'

const name = document.getElementById('name');
const createQuiz = document.getElementById('create');
const repeat = document.getElementById('repeat');
const idioma = localStorage.getItem('lang');
const linkwebpage = 'https://mitrivia.site/';
const puntuacionesBTN = document.getElementById('punt');
const sendBTN = document.getElementById('send');
const locationurl = window.location.href
const puntuaciones = document.querySelector('.puntuaciones').classList
const closeModal = document.querySelector('.close-modal');
const idRandom = Math.ceil(Math.random()*10000)
const userQuiz2 = document.querySelector('.user-quiz');
const tableTops = document.querySelector('.table-end__content-top')
const tableEnd = document.querySelector('.table-end__content')
const database = firebase.firestore();
const selectLanguage = document.getElementById('select-language');
const plaiedTimes = document.getElementById('plaied-times');

let ispersonalizedquiz = undefined;

const id_doc = (locationurl.split('=')[1] == false) ? (ispersonalizedquiz = false,
    locationurl.split('=')[2]) : (ispersonalizedquiz = true, locationurl.split('=')[1]);

const meetText = document.getElementById('meet');
const percentText = document.getElementById('percent');
const load = document.querySelector('.load3');
const buttonNext = document.getElementById('next');
const containerContent = document.querySelector('.container-content');
const localContent = indexedDB.open('local-content', 1);
const modal_content = document.querySelector('.modal');



let click = false;
let uid_person = undefined; 
let similary = false;
let loadBar = 0;
let progress = 0;
let contador = 0;
let meet = 0;
let key = false;
let table = undefined;

let userQuiz, idLocal, userLocal, nameUser, content, quest, idQuest, results; //nameUser: nombre del usuario que responde, content: variable que guarda el contenido del json, quest: contenedor de cada pregunta y respuestas, idQuest: sirve como comparador entre respuesta correcta o incorrecta

if(idioma == 'en'){

    document.querySelector('.description').textContent = 'Find out who knows more about you';
    document.querySelector('.score-board').textContent = 'Score';
    document.querySelector('.name-board').textContent = 'Name'
    document.getElementById('contact-text').textContent = 'Contact';
    document.getElementById('send-email').textContent = 'Send email';
    document.getElementById('email-text').textContent = 'Let us know in what things maybe would us upgrade!, the opinions from the users are welcome';
    document.getElementById('select-lg-txt').textContent = 'Select your language';

    sendBTN.textContent = 'Next'
    repeat.textContent = 'Repeat'
    createQuiz.textContent = 'Create my Quiz'
    name.placeholder = 'Enter your name'
    puntuacionesBTN.innerHTML = 'Show scores <i class="fas fa-chevron-up"aria-hidden="true"></i>'
} 

if (localStorage.getItem('idQuiz') != undefined) idLocal = localStorage.getItem('idQuiz')
if (localStorage.getItem('userQuiz') != undefined) userLocal = localStorage.getItem('userQuiz')

// if(localStorage.getItem('url') == locationurl) alert('Ya haz completado éste quiz');

 if (!locationurl.includes('=')) {
     alert('No se pudo encontrar el quiz :(');
          window.location.href = linkwebpage;
 }

selectLanguage.addEventListener('change', e => {
    localStorage.setItem('lang', selectLanguage.value);
    history.go();
});

puntuacionesBTN.addEventListener('click', e => {
    if(puntuaciones.contains('hide')) {
        (idioma == 'es' || idioma == 'es-ES') ? puntuacionesBTN.innerHTML = 'Ocultar puntuaciones <i class="fas fa-chevron-up"aria-hidden="true"></i>' : puntuacionesBTN.innerHTML = 'Hide scores <i class="fas fa-chevron-up"aria-hidden="true"></i>'
        puntuaciones.remove('hide');
    } 
    else {
        (idioma == 'es' || idioma == 'es-ES') ? puntuacionesBTN.innerHTML = 'Ver puntuaciones <i class="fas fa-chevron-up"aria-hidden="true"></i>' : puntuacionesBTN.innerHTML = 'Show scores <i class="fas fa-chevron-up"aria-hidden="true"></i>'
        puntuaciones.add('hide');
    } 
})

closeModal.addEventListener('click', () => {
    puntuaciones.add('hide');
    (idioma == 'es' || idioma == 'es-ES') ? puntuacionesBTN.innerHTML = 'Ver puntuaciones <i class="fas fa-chevron-up"aria-hidden="true"></i>' : puntuacionesBTN.innerHTML = 'Show scores <i class="fas fa-chevron-up"aria-hidden="true"></i>'
})

localContent.addEventListener('upgradeneeded', () => {
    const db = localContent.result;
    db.createObjectStore("data", {
        autoIncrement: true
    });
});

const getIDBData = (mode, msg) => {
    const db = localContent.result; //Esto nos trae el resultado de la solicitud, "nos trae el objeto a modificar"

    const IDBTransaction = db.transaction("data", mode); // Esto da permisos de leer y escribir, modificar, y eliminar cualquier indice

    const objectStore = IDBTransaction.objectStore("data"); //Aquí accedemos a los objetos que contiene "nombres";
    IDBTransaction.addEventListener("complete", () =>{ // Esto nos avisará cuando el objeto sea agregado/leido/modificado/eliminado;
        
        // console.log(msg)
    });

    return objectStore;
}

const addObject = () => {
    const objectStore = getIDBData("readwrite", "objeto agregado correctamente");
    objectStore.add({data: content, name: userQuiz, id: id_doc});
};

firebase.auth().signInAnonymously()
  .then((user) => {
    //   console.log(user)
    // Signed in..
    uid_person = user.user.uid;
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // console.log(error)
    window.location.reload()
    // ...
  });

function selectAns(){
    return quest;
}

buttonNext.addEventListener('click', () => {
    for(const cl of selectAns()){
        if(cl.classList.contains('selected')){                   
            if(cl.id != idQuest) {
                load.style.width = `${loadBar}%`;
                load.style.background = '#F33';
                click = false;
                createQuest(content);
                return 
            }else if(cl.id == idQuest){
                load.style.width = `${loadBar}%`;
                load.style.background = 'rgb(93, 209, 245)';       
                if(meet <= 100) {
                    click = false;
                    createQuest(content, true);
                    return
                };
            };
        };
    };
});  

const createQuest = (arr, b) => { 
    (idioma == 'es' || idioma == 'es-ES') ? userQuiz2.innerHTML = `Estás respondiendo el quiz de: <b>${userQuiz}</b>` : userQuiz2.innerHTML = `You are answering the quiz of: <b>${userQuiz}</b>`
    if(b)  meet = meet + progress;
    // console.log(arr)
    document.querySelector('.load-circle').style.display = 'none'
    let data = Object.values(arr);
    // console.log(data)
    buttonNext.style.visibility = 'hidden';
    if(key == false) {
        progress = 100 / data.length;
        key = true;
    };

    if(loadBar < 100){

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
                    // console.log(c)
                };
            }else if(c != data[contador].pregunta){           
                span.textContent = c;
                // console.log(c)
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
        const numberscore = Number(meet).toFixed(2);
        const time = new Date().getTime()
        const userscore = {
            nameUser,
            numberscore,
            id: idRandom,
            time,
            
        };
        // console.log(table)
        table.push(userscore)

        const tableWithActualUser = [...table];
        sortTable(tableWithActualUser)
        // console.log(tableWithActualUser)
        // tableWithActualUser is table with actual user
        // table is without the user
        // console.log("SEACABO")

        
        database.collection('scoreboards_table').doc(id_doc).update({
            table,
        }).then(()=>{
            console.info('User score saved sucessfully');
        }).catch((error)=>{
            console.error(error);
            console.error('No se pudo guardar puntuaciones usuario');
        });
        addUserToTable(table, 50, tableEnd);
        // console.log("SEACABO2")
   modal_content.style.display = 'block';
   const modal = document.querySelector('.container-content');
   modal.style.animation = 'desaparecer .5s forwards';
   if(meet <= 20) meetText.innerHTML = results.zero;
   if(meet > 20 && meet <= 40) meetText.innerHTML = results.twenty;
   if(meet > 40 && meet <= 60) meetText.innerHTML = results.fourty;
   if(meet > 60 && meet <= 80) meetText.innerHTML = results.sixty;
   if(meet > 80 && meet <= 99) meetText.innerHTML = results.eighty;
   if(meet >= 100) meetText.innerHTML = results.houndred;
   percentText.innerHTML = `Conoces a <b>${userQuiz}</b> en un ${meet.toFixed(2)}%`;

   repeat.addEventListener('click', () => {
       window.location.reload()
   })

   setTimeout(() => {
       modal.style.display = 'none'
       document.querySelector('.modal').style.animation = 'aparecerModal 1.2s forwards';
   }, 500);


   localStorage.setItem('url', locationurl);
    };
    similary = false;
};

function addUserToTable(table_user, condition, node){
    if(table_user.length > 0){
        if(table_user.length > 15){
            plaiedTimes.innerHTML = `Han jugado éste quiz <b>${table_user.length}</b> veces <i class="fas fa-star"></i></h2>`
        }else if(table_user.length > 50){
            plaiedTimes.innerHTML = `Han jugado éste quiz <b>${table_user.length}</b> veces <i class="fas fa-star"></i> <i class="fas fa-star"></i></h2>`
        }else if(table_user.length > 100){
            plaiedTimes.innerHTML = `Han jugado éste quiz <b>${table_user.length}</b> veces <i class="fas fa-star"></i> <i class="fas fa-star"></i> <i class="fas fa-star"></i></h2>`
        }
        document.querySelector('.first').style.display = 'none'
        for(let i = 0; i < table_user.length; i++){
            if(i < condition){
                const div = document.createElement('DIV');
                div.classList.add('table-content');
        
                const fragment = document.createDocumentFragment();
        
                const position = document.createElement('SPAN');
                const user = document.createElement('SPAN');
                const score = document.createElement('SPAN');

                score.classList.add('ml')

                position.textContent = i + 1;
                // console.log(table_user[i])
               
                user.textContent = table_user[i].nameUser;
                score.textContent = `${table_user[i].numberscore}%`;

                if(table_user[i].id === idRandom){
                    div.classList.add('table-content-user')
                    const handIcon = document.createElement('I');
                    handIcon.classList.add('far', 'fa-hand-point-right');
                    div.appendChild(handIcon);
                }
                if(condition == 3 && table_user[i].nameUser == userLocal && table_user[i].id == idLocal){
                    div.classList.add('table-content-user')
                    const handIcon = document.createElement('I');
                    handIcon.classList.add('far', 'fa-hand-point-right');
                    div.appendChild(handIcon);
                }
                fragment.appendChild(position);
                fragment.appendChild(user);
                fragment.appendChild(score);
        
                div.appendChild(fragment);
                node.appendChild(div)
            };     
        };
    }else{
       (idioma == 'es' || idioma == 'es-ES') ? document.querySelector('.first').textContent = 'Aún nadie ha respondido éste quiz, sé el primero!' :  document.querySelector('.first').textContent = 'No one has answered this quiz yet, be the first!'
    };
};

sendBTN.addEventListener('click', e => {
    e.preventDefault();
    const name = document.getElementById('name');
    if(name.value.length < 1) return (idioma == 'es' || idioma == 'es-ES') ? document.querySelector('.err').textContent = 'Debes ingresar un nombre antes de continuar' : document.querySelector('.err').textContent = 'You must enter a name before continuing'
    else{
        nameUser = document.getElementById('name').value;
        localStorage.setItem('userQuiz', nameUser);
        localStorage.setItem('idQuiz', idRandom);
    } 
    e.path[2].style.opacity = '0';
    document.querySelector('.container').style.animation = 'aparecer .7s forwards';
    containerContent.style.display = 'block'
    setTimeout(() => {
        e.path[2].style.display = 'none'
    }, 20)
});

const setScorePhrase = () => {
    if(idioma == 'es' || idioma == 'es-ES'){
        results = {
            zero: `Parece que casi no conoces a <b>${userQuiz}</b> :(` , // de 0% a 20%
            twenty: `Vaya!, deberías hablar más con <b>${userQuiz}</b>` , // de 20% a 40%
            fourty: `Conoces lo suficiente a <b>${userQuiz}</b>, pero podrías acercarte más :)`, // 40% a 60%
            sixty: `Eres muy cercano a <b>${userQuiz}</b>, acertaste la mayoría!`, //60% a 80%
            eighty: `Parece que <b>${userQuiz}</b> tiene gente que la conoce muy bien! acertaste en la gran cantidad`, // de 80% a 99%
            houndred: `Perfecto! lograste acertar en todas las preguntas, conoces muy bien a <b>${userQuiz}</b>!`  // 100% 
        };  
    }else{
        results = {
            zero: `It seems you hardly know about <b>${userQuiz}</b> :(` , // de 0% a 20%
            twenty: `Wow, you should talk more to <b>${userQuiz}</b>` , // de 20% a 40%
            fourty: `You know enough about <b>${userQuiz}</b>, but could you come closer more :)`, // 40% a 60%
            sixty: `You know <b>${userQuiz}</b> well!`, //60% a 80%
            eighty: `It seems that <b>${userQuiz}</b> has people who know her very well! you got the right big number`, // de 80% a 99%
            houndred: `Perfect! you manage to get all the questions right, you know <b>${userQuiz}</b> very well!`  // 100% 
        };  
    };
};

async function getGame(callback) {
    try{
        localContent.addEventListener("success", async () => { 
            const res = () => {
                let bool = false;
                let data;
                const db = localContent.result; //Esto nos trae el resultado de la solicitud, "nos trae el objeto a modificar"
                const IDBTransaction = db.transaction("data", "readonly"); // Esto da permisos de leer y escribir, modificar, y eliminar cualquier indice
                const objectStore = IDBTransaction.objectStore("data"); //Aquí accedemos a los objetos que contiene "nombres";
                const cursor = objectStore.openCursor(); 
    
                // cursor accederá a los valores que contiene objectStore
                cursor.addEventListener("success", ()=>{ //Si es completado, me de devolverá una solicitud que tendrá que ser recibida mediante un .result
                    if(cursor.result){ // Como nos devolvió un .result que contiene todos los datos, entonces el if se ejecutará
                        if(id_doc == cursor.result.value.id){
                            bool = true;
                            data = cursor.result.value.data;
                            userQuiz = cursor.result.value.name
                        } 
                        cursor.result.continue(); //Aquí le diremos que continue leyendo después de cada uno
                    }else{
                        if(bool == false) return getGame2(bool)
                        else {
                            setScorePhrase()
                            content = data;
                            return createQuest(content)
                        } 
                    };
                });
                
                IDBTransaction.addEventListener("complete", () =>{ // Esto nos avisará cuando el objeto sea agregado/leido/modificado/eliminado;
                    
                    // console.log("objeto leido correctamente")
                });
            } 
            res();
            async function getGame2(b){
                if( b == false) {
                    // console.log('Falso')
                    // console.log(id_doc)
                    //const gameRef = database.collection('quiz_sugeridos').doc(id_doc)
                    // console.info(ispersonalizedquiz)
                    const gameRef = (ispersonalizedquiz === false) ? database.collection('quiz_sugeridos').doc(id_doc) : database.collection('quiz_personalizados').doc(id_doc)
                    console.log(gameRef)
                    const doc = await gameRef.get();
                    const data = doc.data()    
                    if (data == undefined) {
                        alert('No se pudo encontrar el quiz :(, asegurate de estar ingresando al enlace correctamente');
                        return window.location.href = linkwebpage
                    }
            
                    
                    const Game = Object.values(data.Game)
                    content = Game;
                    userQuiz = data.userQuiz;
                    setScorePhrase()      
                    addObject()
                    return callback(content);
                }
            };
            return
        });
    }catch (err){
        console.error(error);
        console.error('There was a problem geting the game, lets try again  '); 
       
        await getGame(createQuest) 
    }
};

function sortTable(table) {
    table.sort((b, a) => {
        // console.log(a.numberscore - b.numberscore)
        return a.numberscore - b.numberscore;
    })
}

async function getTable() {
    try {
    const tableee = await database.collection('scoreboards_table').doc(id_doc).get();
    const tablee = tableee.data();
    sortTable(tablee.table)
    return tablee.table;
    } catch (error) {
        console.error(error);
        console.error('No se pudo consultar las puntuaciones :(');
    };
};

setTimeout(async()=>{

    await getGame(createQuest);
    table = await getTable();

    document.querySelector('.load-circle-top').style.display = 'none';
     addUserToTable(table, 15, tableTops)
});

document.getElementById('home').addEventListener('click', () => {
    window.location.href = 'mitrivia.site'
})