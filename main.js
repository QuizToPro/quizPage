'use strict' 

const database = firebase.firestore();
// TODO: Replace the following with your app's Firebase project configuration


console.log(database)
let localData;

document.getElementById('home').addEventListener('click', () => {
    window.location.href = 'https://mitrivia77-97762.web.app/'
})
const sugeredContent = indexedDB.open('sugered-content', 1)

sugeredContent.addEventListener('upgradeneeded', () => {
    const db = sugeredContent.result;
    db.createObjectStore("json-sugered", {
        autoIncrement: true
    });
})

const getIDBData = (mode, msg) => {
    const db = sugeredContent.result; //Esto nos trae el resultado de la solicitud, "nos trae el objeto a modificar"

    const IDBTransaction = db.transaction("json-sugered", mode); // Esto da permisos de leer y escribir, modificar, y eliminar cualquier indice

    const objectStore = IDBTransaction.objectStore("json-sugered"); //Aquí accedemos a los objetos que contiene "nombres";
    IDBTransaction.addEventListener("complete", () =>{ // Esto nos avisará cuando el objeto sea agregado/leido/modificado/eliminado;  
        console.log(msg)
    });
    return objectStore;
}

const addObject = (name, json, lang) => {
    const objectStore = getIDBData("readwrite", "objeto agregado correctamente");
    objectStore.add({json, name, lang});
};
const upBtn = document.querySelector('.up');
const divInfo = document.querySelector('.game-description-content_container')

const observer = new IntersectionObserver( entries => {
    if(entries[0].isIntersecting) upBtn.style.animation = 'appUp .5s ease-in forwards'
    else upBtn.style.animation = 'disUp .5s ease-in forwards'
    
},{
    threshold: .2
})

observer.observe(divInfo)

const err = document.querySelector('.err');
const selectLanguage = document.getElementById('select-language');
const titleQuiz = document.querySelector('.title-quiz');
const concept = document.querySelector('.concept');
const $btnStart = document.getElementById('btn-start'); //Obtengo el boton de inicio 'Comenzar'
const $sugered = document.getElementById('s');
const $personalized = document.getElementById('p');
const $container = document.querySelector('.container'); //El article
const $main = document.querySelector('.main'); //section main
const $uQz = document.querySelector('.u-qz'); //La seccion de preguntas sugeridas
const $pQz = document.querySelector('.p-qz'); //La seccion de preguntas personalizadas
const $q = document.querySelectorAll('.q'); //Aquí me traigo ambas secciones de arriba 
const $userInput = document.getElementById('user');
const idioma = localStorage.getItem('lang'); // Podría ser inglés u español
const askQ = {}
let deletedQuest = 0;
let questionsQ;
let clicked = false;
let get_pre_Game;
let user, skip;
let numAns = 0; //La seleccion de la cantidad de respuestas que podrá realizar el usuario
let id = 0; //Es el contador de id de cada div question
let contador = 0; //Contador que me permite identificar la respuesta seleccionada
let checkRes = 1;
let cantidad_de_respuestas = undefined;
let uid_person = undefined;
let preguntaSugerida = undefined;
    
if(idioma != "es-ES" && idioma != "en" && idioma != "es"){
    document.querySelector('.es').addEventListener('click', () => {
        localStorage.setItem('lang', 'es');
        modal.style.animation = 'disappearModal 1s forwards';
        setTimeout(() => modal.style.display = 'none', 1000);
        history.go();
    });
    
    document.querySelector('.en').addEventListener('click', () => {
        localStorage.setItem('lang', 'en');
        modal.style.animation = 'disappearModal 1s forwards';
        setTimeout(() => modal.style.display = 'none', 1000);
        history.go();
    });
};

if(idioma == 'es' || idioma == 'es-ES'){
    titleQuiz.textContent = 'Crea tu Quiz';
    concept.textContent = '¿Quieres saber quien de tus conocidos sabe más de ti?, ponlos aprueba con éste genial test!';
    $btnStart.textContent = '¡Comenzar!';
    $sugered.textContent = 'Crea un quiz con  preguntas sugeridas!';
    $personalized.textContent = 'Crea un quiz con  preguntas personalizadas!';
}else{
    titleQuiz.textContent = 'Create your Quiz';
    concept.textContent = 'Do you want to know who of your acquaintances knows the most about you? Put them to the test with this great Quiz!';
    $btnStart.textContent = '¡Start!';
    $sugered.textContent = 'Create a quiz with our suggested questions!';
    $personalized.textContent = 'Create a quiz with your persolanized questions!';
    $userInput.placeholder = 'Enter your name';
    document.getElementById('contact-text').textContent = 'Contact';
    document.getElementById('email-text').textContent = 'Let us know in what things maybe would us upgrade!, the opinions from the users are welcome';
    document.getElementById('select-lg-txt').textContent = 'Select your language';
    document.getElementById('send-email').textContent = 'Send email';

}; 


    
if(idioma != "es-ES" && idioma != "en" && idioma != "es"){
    document.querySelector('.es').addEventListener('click', () => {
        localStorage.setItem('lang', 'es');
        modal.style.animation = 'disappearModal 1s forwards';
        setTimeout(() => modal.style.display = 'none', 1000);
        history.go();
    });
    
    document.querySelector('.en').addEventListener('click', () => {
        localStorage.setItem('lang', 'en');
        modal.style.animation = 'disappearModal 1s forwards';
        setTimeout(() => modal.style.display = 'none', 1000);
        history.go();
    });
};

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


  function upToFirebase (Game, load, btnSend, userQuiz, collectionName='quiz_personalizados'){
    return new Promise((resolve,reject)=>{
        load.style.opacity = '1';
        load.style.animation = 'loop 1s linear infinite';
        btnSend.style.visibility = 'hidden';
        if (Object.entries(Game).length === 0) {
            console.error(Game);
            console.error("An error has ocurred. please try later");
            reject("Game has troublesome");
        }

    const timestamp = Math.floor(Date.now()/1000);

    console.log(Game)
    database.collection(collectionName).add({
        timestamp:timestamp,
        uid:uid_person,
        Game,
        userQuiz: userQuiz
    })
        .then((docRef) => {
            console.log(docRef);
            console.log("Document written with ID: ", docRef.id);
            const pathToPlayQuiz = (collectionName === 'quiz_sugeridos') ? `https://mitrivia77-97762.web.app/playQuiz/Quiz.html?id==${docRef.id}` : `https://mitrivia77-97762.web.app/playQuiz/Quiz.html?id=${docRef.id}`;
                database.collection('scoreboards_table').doc(docRef.id).set({
                    table:[],
                    uid:uid_person,
                })  
            .then((a)=>{
                console.info(a)
                console.info('scoreboard set good')
                resolve(pathToPlayQuiz)
                })  
            .catch((error)=>{
                console.error("Error adding table: ", error);
                reject(error,docRef.id);
            })
            resolve(pathToPlayQuiz)
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            (idioma == 'es' || idioma == 'es-ES') ? showErrPop('Ha ocurrido un error, reintalo de nuevo') : showErrPop('An error has occurred, retry it again')
            reject(error,docRef.id);
        });
})};

const nextPage = (url, nodo) => {    
    nodo.style.animation = 'removeSection 1s forwards';
    const divCopy = document.createElement('DIV');
    divCopy.classList.add('share-link')
    const codeCopy = `<div class="content-links">
        <p>Quiz Creado con éxito!</p>
        <p>Compartir enlace</p>
        <div class="grid-content-link">
            <span id="text-link">${url}</span>
            <button onclick="copyClipboard()">Copiar</button>
            <div class="alert-copy">
                <span>Enlace Copiado correctamente</span>
            </div>
        </div>
    
        <div class="content-icons">
        <div><a href="https://api.whatsapp.com/send?text=Prueba mi nuevo Quiz!, mira quien conoce más sobre ti ${url}" target="_blank"><i class="fab fa-whatsapp"></i></a></div>
        <div><a href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank"><i class="fab fa-facebook"></i></a> </div>
        <div><a href="https://twitter.com/intent/tweet?text=Prueba%20mi%20nuevo%20Quiz!,%20mira%20quien%20conoce%20más%20sobre%20ti&url=${url}" target="_blank"><i class="fab fa-twitter"></i></a> </div>
        </div>              
    </div>`
    window.scrollTo(0, 0)
    setTimeout(() =>{
        $main.style.height = '100vh'
        divCopy.innerHTML = codeCopy;
        $main.appendChild(divCopy)
        document.querySelector('.share-link').style.opacity = '1';
    }, 100) 
};

function copyClipboard(){
    const content = document.getElementById('text-link').innerHTML;
    const copyText = document.querySelector('.alert-copy');
    navigator.clipboard.writeText(content)
    .then(() => {
        copyText.style.display = 'grid';
        copyText.style.animation = 'aparecerCopy 2s linear';
        setTimeout(() => copyText.removeAttribute('style'), 2000)
    });
};

const showErrPop = (msg, className) => {    
    if(err.classList.contains('show')) err.classList.remove('show', 'info');
    setTimeout(() => err.classList.add('show', className), 1)
    document.querySelector('.msj').textContent = msg;
};

document.querySelector('.close-err').addEventListener('click', e => {
    err.classList.remove('show')
});

selectLanguage.addEventListener('change', e => {
    localStorage.setItem('lang', selectLanguage.value);
    history.go();
});


//Evento para aparecer los apartados de que tipo de quiz prefieres

$btnStart.addEventListener('click', e => {
    let username = document.getElementById('user').value;
    if(username < 1) return (idioma == 'es' || idioma == 'es-ES') ? showErrPop('Debes ingresar un nombre antes de continuar') : showErrPop('You have to enter a name before to continue')
    user = username;
    $container.style.animation = 'disappear .5s forwards';
    setTimeout(() => {
        $container.style.display = 'none';
        
        $uQz.classList.add('menu')
        $pQz.classList.add('menu')
        $q.forEach(q => q.style.animation = 'visible .5s both')
    }, 500);
  
});

//Funcion que me crea el evento sugerido en caso de ser seleccionado

const createQuestSugered = (ask, containerQuest) => { //Title seria la pregunta, las opciones serían a b y c
    const divContentQuest = document.createElement('DIV');
        divContentQuest.classList.add('content-quest'); //Contenedor de todo
    const spanAskText = document.createElement('SPAN'); //Va a tener el texto de la pregunta    
    const skipQuest = document.createElement('SPAN'); //X que me permite saltar la pregunta
    const divAsk = document.createElement('DIV'); //Contenedor de la pregunta
    const divQuest = document.createElement('DIV'); //Será mi contenedor de la pregunta 
    divAsk.classList.add('ask-content')
    divQuest.classList.add('questions-content');
    spanAskText.textContent = `${ask}:`;
    skipQuest.textContent = 'X'
    skipQuest.classList.add('skip')
    divAsk.appendChild(spanAskText);
    divAsk.appendChild(skipQuest);
    containerQuest.forEach(quest => {
        if(quest != undefined){
            const contentSpanQuest = document.createElement('DIV');
            const spanQuestText = document.createElement('SPAN'); //Va a tener el texto de las respuestas
            const check = document.createElement('I');
            check.classList.add('fas', 'fa-check');
            spanQuestText.textContent = quest;
            spanQuestText.classList.add('q-text');
            contentSpanQuest.classList.add('container-sugered-quest');
            contentSpanQuest.appendChild(spanQuestText);
            contentSpanQuest.appendChild(check);
            divQuest.appendChild(contentSpanQuest);
        }
    })
    divContentQuest.appendChild(divAsk)
    divContentQuest.appendChild(divQuest);
    return divContentQuest;
};


//Ésta funcion es llamada cuando la parte de cantidad de respuestas es escogida, ésta funcion me permite poner un listener a cada icono de seleccion
const checkIcon = (icon = true) => {
    if(icon){
        const iconClick = document.querySelectorAll('.fa-check');

        for(let i = 0; i < iconClick.length; i ++){
            iconClick[i].addEventListener('click', e => {
                (function(){ //Creo una función anonima autoejecutable para no gastar lineas llamandola después de ejecutarla      
                   
                    for(let i = 2; i < e.path[2].children.length; i++){
                        if(e.path[2].children[i].firstChild.classList.contains('wh-in')) e.path[2].children[i].firstChild.classList.remove('wh-in')
                    }
                    for(const t of e.path[2].children){ //Ésta funcion me permite identificar si ya hay una opcion escogida, en caso de cambiar se borra el id y es colocado en la otra opción escogida
                        if(t.id.includes('selected-answer')){
                            t.removeAttribute('id');
                            t.children[1].removeAttribute('style');
                        };
                    };
                }());
                
                let idAns = iconClick[i].parentElement.parentElement;
                let id = idAns.children[0].children[0].textContent
                idAns.classList.add('selected');
                e.path[1].firstChild.classList.add('wh-in') //Agrega fondo blanco a los inputs ya seleccionados
                iconClick[i].style.backgroundColor = '#2af' //Establezco el color al icono después de haber sido clickeado
                iconClick[i].parentElement.id = `selected-answer${id}` //Con esta linea establezco un id unico a cada selección hecha por el usuario (para poder ser identificable en la base de datos y hacer las comprobaciones en el frontend cuando se estén respondiendo los quiz)
            });
        };
    }else{
        const spanClick = document.querySelectorAll('.q-text');

        for(let i = 0; i < spanClick.length; i ++){
            spanClick[i].addEventListener('click', e => {

                for(const t of e.path[2].children){
                    if(t.children[0].classList.contains('selected-answer')){
                        t.children[0].classList.remove('selected-answer');
                        t.classList.remove('container-sugered-quest-select')
                    }
                };
                
                spanClick[i].classList.add('selected-answer');
                e.path[1].classList.add('container-sugered-quest-select')
            });
        };
    };
};


//Funcion que crea otra pregunta cuando se le da al boton de agregar otra pregunta
const createQuest = (entity, entries, p) => {
    if(contador > 9) {
        return (idioma != "en") ? showErrPop('Haz alcanzado el máximo de preguntas') : showErrPop('You has been reached the maximun quest');       
    };
    const containDivQuest = document.createElement('DIV');
    containDivQuest.classList.add(`questions2`);
    const span = document.createElement('span');
    (idioma != "en") ? span.innerHTML = `Pregunta <b>${contador + 1}</b> ` : span.innerHTML = `Question <b>${contador + 1}</b>`;
    containDivQuest.id = id;
    const fragmentQuest = document.createDocumentFragment()

    fragmentQuest.appendChild(span)

    if(entries != undefined){
        for(let f of entries){
            f.style.animation = 'disentity .5s forwards'
            setTimeout(() => f.style.display = 'none', 500);     
        };
    };
   
    if(entity != undefined) numAns = entity;

    if(p == true || p == undefined){       
        const inputQuestion = document.createElement('INPUT');

        inputQuestion.classList.add('question');
            inputQuestion.setAttribute('spellcheck', 'false');
            (idioma != "en") ? inputQuestion.setAttribute('placeholder', 'Escribe una pregunta') : inputQuestion.setAttribute('placeholder', 'Write a quest');
            inputQuestion.setAttribute('required', 'true');
            inputQuestion.setAttribute('minlength', '5');
            inputQuestion.setAttribute('maxlength', '50');
    
        fragmentQuest.appendChild(inputQuestion);
        
        for(let i = 0; i < numAns; i++){
            const contentInput = document.createElement('DIV');
            contentInput.classList.add('contentInput');
            const inputQuest = document.createElement('INPUT');
            const iconCheck = document.createElement('I');

            iconCheck.classList.add('fas');
            iconCheck.classList.add('fa-check');
            inputQuest.classList.add('answ')
            inputQuest.setAttribute('spellcheck', 'false');
            (idioma != "en") ? inputQuest.setAttribute('placeholder', 'Escribe la posible respuesta') : inputQuest.setAttribute('placeholder', 'Write a possible response'); 
            inputQuest.setAttribute('minlenght', '5');
            inputQuest.setAttribute('maxlength', '50');
            inputQuest.setAttribute('required', 'true');
            contentInput.appendChild(inputQuest);
            contentInput.appendChild(iconCheck);
            fragmentQuest.appendChild(contentInput);
        };
        containDivQuest.appendChild(fragmentQuest)
        return containDivQuest;
    };      
};

const setLanguaje = lang => {
    const p = document.createElement('P');
    const fragment = document.createDocumentFragment();
    if(lang == 'es' || lang == 'es-ES'){
        const span1 = document.createElement('SPAN');
        const span2 = document.createElement('SPAN');
        const span3 = document.createElement('SPAN');
        p.textContent = 'Selecciona la cantidad de respuestas que los usuarios podrán ingresar';
        span1.textContent = '2 Respuestas';
        span2.textContent = '3 Respuestas';
        span3.textContent = '4 Respuestas';
        span1.classList.add('entity');
        span2.classList.add('entity');
        span3.classList.add('entity');
        fragment.appendChild(p);
        fragment.appendChild(span1);
        fragment.appendChild(span2);
        fragment.appendChild(span3);
        return fragment;
    }else{
        const span1 = document.createElement('SPAN');
        const span2 = document.createElement('SPAN');
        const span3 = document.createElement('SPAN');
        p.textContent = 'Selected the number of responses that users can enter';
        span1.textContent = '2 Responses';
        span2.textContent = '3 Responses';
        span3.textContent = '4 Responses';
        span1.classList.add('entity');
        span2.classList.add('entity');
        span3.classList.add('entity');
        fragment.appendChild(p);
        fragment.appendChild(span1);
        fragment.appendChild(span2);
        fragment.appendChild(span3);
        return fragment;
    }
}

//Funcion padre que me crea un tipo de quiz diferente dependiendo de lo que haya seleccionado el usuario
const contentHTML = (title, showBtn, languaje) => { //title es el tipo de quiz que se haya seleccionado, showBtn recibe un booleano que será el que me permita crear la funcion personalizada, si es false se crea el quiz sugerido
    const divContent = document.createElement('DIV');
    const form = document.createElement('FORM');
    const divTitle = document.createElement('DIV');
    const divQuestions = document.createElement('DIV');
    const divAnswer = document.createElement('DIV');
    const divMoreQuest = document.createElement('DIV');
    const spanSend = document.createElement('SPAN');
    const divLoad = document.createElement('DIV');
    const buttonAdd = document.createElement('BUTTON');
    const iIcon = document.createElement('I');
    const sendIcon = document.createElement('I');
    const h2Title = document.createElement('H2');
    const p = document.createElement('P');
    const fragment = document.createDocumentFragment();
    const divSelectHowAns = document.createElement('DIV');
    
    sendIcon.classList.add('fas', 'fa-arrow-right')
    iIcon.classList.add('fas', 'fa-plus')
    form.classList.add('flex-form');

    divContent.classList.add('c-ur-q');
    divTitle.classList.add('title');
    h2Title.textContent = title;
    // if(languaje != 'es') {
        
    // }
    h2Title.classList.add('title-quest');
    divTitle.appendChild(h2Title);

    divQuestions.classList.add('questions');
            
    divAnswer.classList.add('answers');
    divSelectHowAns.classList.add('select-ans');

    if(showBtn == true){
        divSelectHowAns.appendChild(setLanguaje(languaje));
        divAnswer.appendChild(divSelectHowAns);
        divQuestions.style.display = 'none'
    }else{
        divQuestions.classList.replace('questions', 'questions-sug')
        const divPersonality = document.createElement('DIV');
        const divStyleClothes = document.createElement('DIV');
        const divFood = document.createElement('DIV');
        const divTravel = document.createElement('DIV');
        divPersonality.classList.add('personality', 'section-select');
        divStyleClothes.classList.add('clothes', 'section-select');
        divFood.classList.add('food', 'section-select');
        divTravel.classList.add('travel', 'section-select');

        if(idioma == 'en'){
            divPersonality.innerHTML = `
            <div class="content-sections" data-value="Personalidad"><span class="text-section c">¡Describes your Personality!</span><img class="img-section" src="https://www.synergie.es/wp-content/uploads/2020/11/test-personalidad.jpg"></div>
                `

            divStyleClothes.innerHTML = `
                    <div class="content-sections" data-value="Estilo_De_Vestir"><span class="text-section v">¿How is your clothing style?</span><img class="img-section" src="https://querido-dinero.imgix.net/1302/La-verdad-de-la-ropa-gen%C3%A9rica-vs.-la-de-marca_Portada.png?w=1200&h=628&fit=crop&crop=faces&auto=format,compress&lossless=1"></div>
                `
                        
            divFood.innerHTML = `
                    <div class="content-sections" data-value="Comida"><span class="text-section f">¿How is your favorite food?</span><img class="img-section" src="https://cdn.pixabay.com/photo/2020/12/23/06/34/strawberry-5854081_960_720.png"></div>
                `
                     
            divTravel.innerHTML = `
                    <div class="content-sections" data-value="Viajes"><span class="text-section t">¿How would your ideal trips be?</span><img class="img-section" src="https://p4.wallpaperbetter.com/wallpaper/672/343/818/1920x1080-px-aircraft-humor-imagination-minimalistic-paper-plane-wall-anime-full-metal-alchemist-hd-art-wallpaper-preview.jpg"></div>
                `
        }else{
            divPersonality.innerHTML = `
            <div class="content-sections" data-value="Personalidad"><span class="text-section c">¡Describe tu Personalidad!</span><img class="img-section" src="https://www.synergie.es/wp-content/uploads/2020/11/test-personalidad.jpg"></div>
                `

            divStyleClothes.innerHTML = `
                    <div class="content-sections" data-value="Estilo_De_Vestir"><span class="text-section v">¿Como es tú Estilo de vestir?</span><img class="img-section" src="https://querido-dinero.imgix.net/1302/La-verdad-de-la-ropa-gen%C3%A9rica-vs.-la-de-marca_Portada.png?w=1200&h=628&fit=crop&crop=faces&auto=format,compress&lossless=1"></div>
                `
                        
            divFood.innerHTML = `
                    <div class="content-sections" data-value="Comida"><span class="text-section f">¿Cómo es tu Comida Favorita?</span><img class="img-section" src="https://cdn.pixabay.com/photo/2020/12/23/06/34/strawberry-5854081_960_720.png"></div>
                `
                     
            divTravel.innerHTML = `
                    <div class="content-sections" data-value="Viajes"><span class="text-section t">¿Como serían tus Viajes ideales?</span><img class="img-section" src="https://p4.wallpaperbetter.com/wallpaper/672/343/818/1920x1080-px-aircraft-humor-imagination-minimalistic-paper-plane-wall-anime-full-metal-alchemist-hd-art-wallpaper-preview.jpg"></div>
                `
        }
        
        fragment.appendChild(divPersonality);
        fragment.appendChild(divStyleClothes);
        fragment.appendChild(divFood);
        fragment.appendChild(divTravel);
    }
    
    divQuestions.appendChild(fragment)

    divMoreQuest.classList.add('more-quest');
    buttonAdd.classList.add('add-quest-btn');
    (idioma == 'es' || idioma == 'es-ES') ? buttonAdd.textContent = 'Agregar otra pregunta' : buttonAdd.textContent = 'Add other question'
    buttonAdd.appendChild(iIcon)
    buttonAdd.title = 'Agregar pregunta'
    buttonAdd.style.display = 'none';

    (idioma == 'es' || idioma == 'es-ES') ? spanSend.textContent = 'Crear quiz' : spanSend.textContent = 'Create quiz'
    spanSend.id = 'send';
    spanSend.appendChild(sendIcon)
    divLoad.classList.add('load-send');


    if(showBtn != false){
        divMoreQuest.appendChild(buttonAdd);
        divMoreQuest.appendChild(spanSend);
    }

    // divMoreQuest.appendChild(spanSend); //Agergar boton en sugerido

  
    fragment.appendChild(divTitle);
    fragment.appendChild(divQuestions);
    fragment.appendChild(divAnswer);
    fragment.appendChild(divMoreQuest);
    fragment.appendChild(divLoad)
    form.appendChild(fragment);
    divContent.appendChild(form);
    $main.appendChild(divContent);
    divContent.style.animation = 'appear .5s both';
    divContent.style.animationDelay = '.5s';

    const entity = document.querySelectorAll('.entity');

    if(showBtn == false){
        spanSend.style.display = 'flex'
    }
    for(let i = 0; i < entity.length; i++){
        entity[i].addEventListener('click', () => {
            cantidad_de_respuestas = entity[i].outerText.slice( 0, 1 );
            let deleteP = document.querySelector('.select-ans');
            spanSend.style.display = 'flex'
            buttonAdd.style.display = 'inline-block';
            divAnswer.appendChild(createQuest(entity[i].textContent.slice(0, 1), entity));
            document.querySelector('.questions2').style.animation = 'appFrag 1s forwards'
            checkIcon();
            contador++;
            id++;
            deleteP.removeChild(deleteP.children[0]);
            (idioma == 'es' || idioma == 'es-ES') ? showErrPop('Para seleccionar una respuesta correcta debes tocar el icono de Check al final de cada campo', 'info') :  showErrPop('To select a correct response you to have touch the check icon to end of field', 'info');
        });
    };
    if(showBtn == true){
        document.querySelector('.add-quest-btn').addEventListener('click', e => {
            e.preventDefault();
            if(showBtn != false){
                divAnswer.appendChild(createQuest(numAns, '', true));
                const qDiv = document.querySelectorAll('.questions2');
                qDiv[contador].style.animation = 'appFrag .5s forwards'
                contador++;
                id++;
                checkIcon();
            }else{
                divAnswer.appendChild(createQuest('', '', false));
            };
        });
    }else{
        divQuestions.addEventListener('click', e => {
            let bool = false;
            get_pre_Game = async(preguntaSugerida)=>{ 
                divLoad.style.opacity = '1';
                divLoad.style.animation = 'loop 1s linear infinite';
                console.log("inicio")
                const gameRef = (idioma == 'es' || idioma == 'es-ES') ? database.collection('plantilla_quiz_sugeridos').doc(preguntaSugerida) : database.collection('plantilla_quiz_sugeridos_en').doc(preguntaSugerida)

                const doc = await gameRef.get();
                const data = doc.data()
                const Game = Object.values(data.Game)
                return Game
            }

            if(clicked == false){
                if(e.path[1].children[0].tagName == 'SPAN'){
                    
                    const animations = ['moveUp .7s ease-in-out infinite', 'moveLeft .7s ease-in infinite','moveRight .7s ease-in infinite','moveDown .7s ease-in infinite']
                    const disappear = document.querySelectorAll('.section-select');
                    
                    disappear.forEach(item => {
                        let randomNum = Math.random()*4
                        
                        if(item.children[0].children[0].textContent != e.path[1].children[0].textContent){
                            item.style.animation = animations[Math.floor(randomNum)]
                            setTimeout(() => {
                                item.style.display = 'none'
                            }, 700)
                        }else{
                            item.style.opacity = '0'
                            setTimeout(() => item.style.animation = 'selected 1s forwards', 700)
                            
                            item.children[0].children[0].id = 'selected'
                        };
                    });
    
                    console.log(e.path[1].getAttribute('data-value'))
                    preguntaSugerida = e.path[1].getAttribute('data-value'); //Agrego la categoría de quiz sugerido que el usuario seleccionó 
                    
                //Comprobar si existen datos en el idexeDB

                const objectStore = getIDBData("readonly")
                const cursor = objectStore.openCursor(); // cursor accederá a los valores que contiene objectStore
                const fragment = document.createDocumentFragment();

                cursor.addEventListener("success", ()=>{ //Si es completado, me de devolverá una solicitud que tendrá que ser recibida mediante un .result

                    if(cursor.result){ // Como nos devolvió un .result que contiene todos los datos, entonces el if se ejecutará
                        if(cursor.result.value.name == preguntaSugerida && cursor.result.value.lang == idioma){
                            
                            console.log('holi')
                            bool = true;
                            askQ.pregunta = cursor.result.value.name
                            questionsQ = cursor.result.value.json
                        }
                        cursor.result.continue(); //Aquí le diremos que continue leyendo después de cada uno
                    }else{
                        if(bool == false){
                            console.log('No estoy funcionando, que raro')
                            get_pre_Game(preguntaSugerida)
                            .then((pre_game)=>{
                                divLoad.removeAttribute('style')
                                addObject(preguntaSugerida, pre_game, idioma)
                                const fragment = document.createDocumentFragment()
                                let pregunta;
                                let arrQuest = []
                                questionsQ = pre_game
                                for(const ask of pre_game){        
                                    fragment.appendChild(createQuestSugered(ask.pregunta, [ask.A, ask.B, ask.C, ask.D]));
                                };

                                divAnswer.appendChild(fragment);
                                skip = document.querySelectorAll('.skip')           
                                for(let i = 0; i < skip.length; i++){
                                    skip[i].addEventListener('click', e => {
                                        if(deletedQuest < 5){
                                            deletedQuest++
                                            e.path[3].removeChild(e.path[2])
                                        }else{
                                            (idioma == 'es' || idioma == 'es-ES') ? showErrPop('No puedes omitir más preguntas') : showErrPop('You can not skip more questions')
                                        }
                                    })
                                }                              
                                (idioma == 'es' || idioma == 'es-ES') ? showErrPop('Puedes saltar una pregunta presionando la "X"', 'info') : showErrPop('You can skip a question touching on the "X"', 'info');
                                divMoreQuest.appendChild(spanSend);
                                checkIcon(false)
                            })
                        }else{
                            const fragment = document.createDocumentFragment();
                            console.log(askQ.pregunta, questionsQ);
                            for(const ask of questionsQ){        
                                fragment.appendChild(createQuestSugered(ask.pregunta, [ask.A, ask.B, ask.C, ask.D]));
                            };
                            divAnswer.appendChild(fragment);
                            skip = document.querySelectorAll('.skip')                             
                                for(let i = 0; i < skip.length; i++){
                                    skip[i].addEventListener('click', e => {
                                        if(deletedQuest < 5){
                                            deletedQuest++
                                            e.path[3].removeChild(e.path[2])
                                        }else{
                                            (idioma == 'es' || idioma == 'es-ES') ? showErrPop('No puedes omitir más preguntas') : showErrPop('You can not skip more questions')
                                    
                                        }          
                                    })
                                }
                            (idioma == 'es' || idioma == 'es-ES') ? showErrPop('Puedes saltar una pregunta presionando la "X"', 'info') : showErrPop('You can skip a question touching on the "X"', 'info');
                        
                            divMoreQuest.appendChild(spanSend);
                            checkIcon(false)
                        
                        }
                    } //Como última vuelta nos dara null por lo cual se ejecutará el else
                });                     
                    clicked = true; 
                };
            }
            
        });
    };
  
    //Evento para enviar los datos
    document.querySelector('.more-quest').addEventListener('click', e => {
        if(e.target.tagName == 'SPAN'){
            if(showBtn){
                console.log
                let empty = false;
                let inputValue = document.querySelectorAll('.answ');
                let questionValue = document.querySelectorAll('.question');
                if(contador < 2 && showBtn == true){
                    return (idioma == 'es' || idioma == 'es-ES') ? showErrPop('Debes completar al menos dos preguntas antes de continuar') : showErrPop('You need complete two question before continue');  
                };
                
                inputValue.forEach(item => {
                    if(item.value < 1) {
                        empty = true;
                        return
                    }else{
                        empty = false;
                    };
                });
        
                if(empty == false){
                    
                        (document.querySelectorAll('.selected').length < contador) ? ( (idioma == 'es' || idioma == 'es-ES') ? showErrPop('No puedes dejar campos de respuestas sin seleccionar') : showErrPop('You can not let empty fields of responses without select') )  : CreateObjectGame().then((Game)=>{
                            console.log("PROMESAAA");
                            upToFirebase(Game, divLoad, divMoreQuest, user).then( (url) =>nextPage(url, divContent))
                            .catch((error, docRef)=>{
                                divLoad.removeAttribute('style');
                                divMoreQuest.style.visibility = 'visible';
                                console.error(error);
                                (idioma == 'es' || idioma == 'es-ES') ? showErrPop('Ha ocurrido un error, reintalo de nuevo') : showErrPop('An error has occurred, retry it again')
                                database.collection('quiz_personalizados').doc(docRef).delete()
                                database.collection('scoreboards_table').doc(docRef).delete()
                                }   
                            )
                        });       
                       
                }else return (idioma == 'es' || idioma == 'es-ES') ? showErrPop('Comprueba que todos los campos estén completos antes de continuar') : showErrPop('Check that all fields are complete before continuing')
            }else{
                console.log('creando sugerido')
                const contentQuest = document.querySelectorAll('.content-quest');
                const selectedAns = document.querySelectorAll('.container-sugered-quest-select');

                if(selectedAns.length < contentQuest.length) return (idioma == 'es' || idioma == 'es-ES') ? showErrPop('Comprueba que todas las respuestas están seleccionadas') : showErrPop('Check that all answers are selected')
                const responses = document.querySelectorAll('.selected-answer');
                questionsQ.forEach(item => {
                    responses.forEach(res => {
                        let data = res.textContent
                        if(data == item.A || data == item.B|| data == item.C|| data == item.D){
                          
                            return item.niceValue = data
                        };
                    });
                });
                const Game = {...questionsQ}

                upToFirebase(Game, divLoad, divMoreQuest, user,'quiz_sugeridos')
                .then(url =>  nextPage(url, divContent))
                .catch(err => {
                    console.log(err)
                    divLoad.removeAttribute('style');
                    divMoreQuest.style.visibility = 'visible';
                    (idioma == 'es' || idioma == 'es-ES') ? showErrPop('Ha ocurrido un error, reintalo de nuevo') : showErrPop('An error has occurred, retry it again')
                                
                })
            }
        }
    })
}

const createQuiz = selected => {
    
    if(selected.id == 'p'){
        (idioma != 'en') ? contentHTML('¡Estás creando tu quiz personalizado!', true, idioma) : contentHTML("You're creating your personalized quiz!", true, idioma);
        
    }else{
        (idioma != 'en') ? contentHTML('Selecciona una categoría para tu quiz', false, idioma) : contentHTML("You're creating a suggered quiz!", false, idioma);      
    };
};

for(let i = 0; i < $q.length; i++){
    $q[i].addEventListener('click', () => {

        $uQz.style.animation = 'hidden .7s forwards';
        $pQz.style.animation = 'hidden .7s forwards';

        setTimeout(() => {
            $uQz.style.display = 'none'
            $pQz.style.display = 'none'

        createQuiz($q[i].children[0]);
        }, 700);

    });
};

function CreateObjectGame () {
    return new Promise((resolve,reject)=>{
    
    const preguntas = document.querySelectorAll('.question'); //traigo todas las clases.question

    let empty = false; // variable que si es true no deja continuar con el script
    preguntas.forEach(item => {
        if(item.value < 1) {
            empty = true; //Se vuelve true si consigue un input sin llenar
            reject()
            return (idioma == 'es' || idioma == 'es-ES') ? showErrPop('Comprueba que todos los campos estén completos antes de continuar') : showErrPop('Check that all fields are complete before continuing')
        };
    });

    if(empty == false){
        const answers = document.querySelectorAll('.answ');//traigo todas las clases.answ
        const Array_preguntas_answers = new Array; //Creo el array donde guardaré los valores de las preguntas y respuestas
        let duqueisnotreadingthis = 0; //sé que duquenoestaleyendoesto

         for(let i = 0; i < preguntas.length; i++) { //creo un for sayayin

            let obj_pregunta_y_respuestas = new Object;//creo el objeto, y dependiendo de la cantidad de respuestas lo lleno
            const correctAnswer = document.querySelector(`#selected-answer${i+1} > input`).value //traigo el valor de la respuesta correcta
            console.log(correctAnswer)//Si falta por seleccionar alguna respuesta correcta, se llama igual la funcion, error: Uncaught TypeError: Cannot read property 'value' of null

                if (cantidad_de_respuestas === "2"  ) {
                    obj_pregunta_y_respuestas = {
                        pregunta:preguntas[i].value,
                        A:answers[duqueisnotreadingthis].value,
                        B:answers[duqueisnotreadingthis+1].value,
                        niceValue:correctAnswer
                    }
                }
                else if (cantidad_de_respuestas === "3"  ) {
                    obj_pregunta_y_respuestas = {
                        pregunta:preguntas[i].value,
                        A:answers[duqueisnotreadingthis].value,
                        B:answers[duqueisnotreadingthis+1].value,
                        C:answers[duqueisnotreadingthis+2].value,
                        niceValue:correctAnswer
                    }
                }
                else if (cantidad_de_respuestas === "4"  ) {
                    obj_pregunta_y_respuestas = {
                        pregunta:preguntas[i].value,
                        A:answers[duqueisnotreadingthis].value,
                        B:answers[duqueisnotreadingthis+1].value,
                        C:answers[duqueisnotreadingthis+2].value,
                        D:answers[duqueisnotreadingthis+3].value,
                        niceValue:correctAnswer
                    }
                }
                else{
                    console.error("error en la cantidad de respuestas");
                    reject();
                };
                console.log(obj_pregunta_y_respuestas);

                Array_preguntas_answers.push(obj_pregunta_y_respuestas) //una vez llenado el objeto de preguntasyrespuestas, lo guardo en el array
                duqueisnotreadingthis = duqueisnotreadingthis + parseInt(cantidad_de_respuestas) //como duque no esta leyendo esto le sumo un numero
            }; //traer respuestas
            const Game = { ...Array_preguntas_answers }; //por ultimo, tenemos el objeto del juego
            // Game.username = user;
            console.info(Game);

            resolve(Game);
        };
    });
};

upBtn.addEventListener('click', () => {
    window.scrollTo(0, 0)
})