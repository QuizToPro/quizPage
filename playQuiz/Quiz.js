'use strict'

const linkwebpage = 'about:blank'
 //Valor ingresado el usuario cuando responde el quiz
const locationurl = window.location.href
const puntuaciones = document.querySelector('.puntuaciones').classList
const closeModal = document.querySelector('.close-modal');

// if(localStorage.getItem('url') == locationurl) alert('Ya haz completado éste quiz');

if (!locationurl.includes('=')) {
    window.location = linkwebpage;
}

const tableTops = document.querySelector('.tops')
const tableEnd = document.querySelector('.table-end')
const puntuacionesBTN = document.getElementById('punt');
const database = firebase.firestore();
const id_doc = locationurl.split('=')[1]
console.log(id_doc)
let click = false;
let uid_person = undefined; 
let userQuiz, nameUser, content, quest, idQuest, results; //nameUser: nombre del usuario que responde, content: variable que guarda el contenido del json, quest: contenedor de cada pregunta y respuestas, idQuest: sirve como comparador entre respuesta correcta o incorrecta
let similary = false;
let loadBar = 0;
let progress = 0;
let contador = 0;
let meet = 0;
let key = false;
let table = undefined;
const meetText = document.getElementById('meet');
const percentText = document.getElementById('percent');
const load = document.querySelector('.load3');
const buttonNext = document.getElementById('next');
const containerContent = document.querySelector('.container-content');
const localContent = indexedDB.open('local-content', 1);
const modal_content = document.querySelector('.modal');

puntuacionesBTN.addEventListener('click', e => {
    if(puntuaciones.contains('hide')) {
        puntuacionesBTN.innerHTML = 'Ocultar puntuaciones <i class="fas fa-chevron-up"aria-hidden="true"></i>'
        puntuaciones.remove('hide');
    } 
    else {
        puntuacionesBTN.innerHTML = 'Ver puntuaciones <i class="fas fa-chevron-down"aria-hidden="true"></i>'
        puntuaciones.add('hide');
    } 
})

closeModal.addEventListener('click', () => {
    puntuacionesBTN.style.cursor = 'pointer'
    puntuaciones.add('hide');
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
        
        console.log(msg)
    });

    return objectStore;
}

const addObject = () => {
    const objectStore = getIDBData("readwrite", "objeto agregado correctamente");
    objectStore.add({data: content, name: userQuiz, id: locationurl.split('=')[1]});
};


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
    if(b)  meet = meet + progress;
    console.log(arr)
    document.querySelector('.load-circle').style.display = 'none'
    let data = Object.values(arr);
    console.log(data)
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
        console.log("SEACABO")
        modal_content.style.display = 'block'
        const modal = document.querySelector('.container-content')
        modal.style.animation = 'desaparecer .5s forwards';
        if(meet <= 20) meetText.textContent = results.zero;
        if(meet > 20 && meet <= 40) meetText.textContent = results.twenty;
        if(meet > 40 && meet <= 60) meetText.textContent = results.fourty;
        if(meet > 60 && meet <= 80) meetText.textContent = results.sixty;
        if(meet > 80 && meet <= 99) meetText.textContent = results.eighty;
        if(meet >= 100) meetText.textContent = results.houndred;
        percentText.innerHTML = `Conoces a <b>${userQuiz}</b> en un ${meet.toFixed(2)}%`;
        setTimeout(() => {
            modal.style.display = 'none'
            document.querySelector('.modal').style.animation = 'aparecerModal 1.2s forwards';
        }, 500)
        localStorage.setItem('url', locationurl);

         //////////////////////////////////////////////////
         const numberscore = Number(meet);
         const userscore = {
             nameUser,
             numberscore
         };
         console.log(table)
         table.push(userscore)
 
         const tableWithActualUser = [...table];
         sortTable(tableWithActualUser)
         //tableWithActualUser is table with actual user
         //table is without the user
         console.info('Pusehado')

         console.info(tableWithActualUser)

         for(let i = 1; i <= 10; i++){
            const div = document.createElement('DIV');
            div.classList.add('table-content');
    
            const fragment = document.createDocumentFragment();
    
            const position = document.createElement('SPAN');
            const user = document.createElement('SPAN');
            const score = document.createElement('SPAN');
    
            position.textContent = i;
            user.textContent = table[i].nameUser;
            score.textContent = `${table[i].numberscore}%`;
            fragment.appendChild(position);
            fragment.appendChild(user);
            fragment.appendChild(score);
    
            div.appendChild(fragment);
            tableEnd.appendChild(div)
        }

         database.collection('scoreboards_table').doc(id_doc).update({
             table,
         }).then(()=>{
             console.info('User score saved sucessfully')
         }).catch((error)=>{
             console.error(error)
             console.error('No se pudo guardar puntuaciones usuario')
         });

    };
    similary = false;
};

document.getElementById('send').addEventListener('click', e => {
    e.preventDefault();
    if(document.getElementById('name').value.length < 1) return document.querySelector('.err').textContent = 'Debes ingresar un nombre antes de continuar';
    else nameUser = document.getElementById('name').value;
    e.path[2].style.opacity = '0';
    document.querySelector('.container').style.animation = 'aparecer .7s forwards';
    containerContent.style.display = 'block'
    setTimeout(() => {
        e.path[2].style.display = 'none'
    }, 20)
});

const setScorePhrase = () => {
    results = {
        zero: `Parece que casi no conoces a ${userQuiz} :(` , // de 0% a 20%
        twenty: `Vaya!, deberías hablar más con ${userQuiz}` , // de 20% a 40%
        fourty: `Conoces lo suficiente a ${userQuiz}, pero podrías acercarte más :)`, // 40% a 60%
        sixty: `Eres muy cercano a ${userQuiz}, acertaste la mayoría!`, //60% a 80%
        eighty: `Parece que ${userQuiz} tiene gente que la conoce muy bien! acertaste en la gran cantidad`, // de 80% a 99%
        houndred: `Perfecto! lograste acertar en todas las preguntas, conoces muy bien a ${userQuiz}!`  // 100% 
    }      
}

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
                        if(locationurl.includes(cursor.result.value.id)){
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
                    
                    console.log("objeto leido correctamente")
                });
            } 
            res();
            async function getGame2(b){
                if( b == false) {
                    console.log('Falso')
                    const gameRef = database.collection('quiz_personalizados').doc(id_doc);
                    const doc = await gameRef.get();
                    const data = doc.data()
                    
                    console.log(data)
                    const Game = Object.values(data.Game)
                    content = Game;
                    userQuiz = data.userQuiz;
                    setScorePhrase()      
                    addObject()
                    return callback(content);
                }else{
                    console.log('True')
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
        console.log(a.numberscore - b.numberscore)
        return a.numberscore - b.numberscore;
    })
}

async function getTable() {
    try {

    const tableee = await database.collection('scoreboards_table').doc(id_doc).get()
    const tablee = tableee.data() 
    sortTable(tablee.table)
    console.info(tablee)
    return tablee.table;
} catch (error) {
       console.error(error)
       console.error('No se pudo consultar las puntuaciones :(')
       return ['No se pudo consultar las puntuaciones :('] 
}
}

setTimeout(async()=>{
    await getGame(createQuest)
    table = await getTable()
    document.querySelector('.load-circle-top').style.display = 'none'
    for(let i = 1; i < 4; i++){
        const div = document.createElement('DIV');
        div.classList.add('table-content');

        const fragment = document.createDocumentFragment();

        const position = document.createElement('SPAN');
        const user = document.createElement('SPAN');
        const score = document.createElement('SPAN');

        position.textContent = i;
        user.textContent = table[i].nameUser;
        score.textContent = `${table[i].numberscore}%`;
        fragment.appendChild(position);
        fragment.appendChild(user);
        fragment.appendChild(score);

        div.appendChild(fragment);
        tableTops.appendChild(div)
    }
});