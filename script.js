'use strict'

// const { rejects } = require("assert");

const database = firebase.firestore();
// TODO: Replace the following with your app's Firebase project configuration


console.log(database)

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
const idioma = localStorage.getItem('lang'); // Podría ser inglés u español
let user;
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
    $sugered.textContent = 'Crea un quiz con  preguntas sugeridas!'
    $personalized.textContent = 'Crea un quiz con  preguntas personalizadas!';
}else{
    titleQuiz.textContent = 'Create your Quiz';
    concept.textContent = 'Do you want to know who of your acquaintances knows the most about you? Put them to the test with this great test!';
    $btnStart.textContent = '¡Start!';
    $sugered.textContent = 'Create a quiz with our suggested questions!'
    $personalized.textContent = 'Create a quiz with your persolanized questions!';
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

if(idioma == 'es' || idioma == 'es-ES'){
    titleQuiz.textContent = 'Crea tu Quiz';
    concept.textContent = '¿Quieres saber quien de tus conocidos sabe más de ti?, ponlos aprueba con éste genial test!';
    $btnStart.textContent = '¡Comenzar!';
    $sugered.textContent = 'Crea un quiz con  preguntas sugeridas!'
    $personalized.textContent = 'Crea un quiz con  preguntas personalizadas!';
}else{
    titleQuiz.textContent = 'Create your Quiz';
    concept.textContent = 'Do you want to know who of your acquaintances knows the most about you? Put them to the test with this great test!';
    $btnStart.textContent = '¡Start!';
    $sugered.textContent = 'Create a quiz with our suggested questions!'
    $personalized.textContent = 'Create a quiz with your persolanized questions!';
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


  function upToFirebase (Game, load, btnSend, userQuiz,collectionName='quiz_personalizados'){
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


    database.collection(collectionName).add({
        timestamp:timestamp,
        uid:uid_person,
        Game,
        userQuiz: userQuiz
    })
        .then((docRef) => {
            console.log(docRef);
            console.log("Document written with ID: ", docRef.id);
            const pathToPlayQuiz = `./playQuiz/Quiz.html?id=${docRef.id}`;
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
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            showErrPop('Ha ocurrido un error, reintentalo de nuevo');
            reject(error,docRef.id);
        });
})};

const nextPage = (url, nodo) => {    
    nodo.style.animation = 'removeSection 1s forwards';
    const divCopy = document.querySelector('.share-link');
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
        <div><a href="https://api.whatsapp.com/send?text=Prueba mi nuevo Quiz!, mira quien conoce más sobre ti https://${url}" target="_blank"><i class="fab fa-whatsapp"></i></a></div>
        <div><a href="https://www.facebook.com/sharer/sharer.php?u=https://${url}" target="_blank"><i class="fab fa-facebook"></i></a> </div>
        <div><a href="https://twitter.com/intent/tweet?text=Prueba%20mi%20nuevo%20Quiz!,%20mira%20quien%20conoce%20más%20sobre%20sobre%20ti&url=https%3A%2F%2F${url}" target="_blank"><i class="fab fa-twitter"></i></a> </div>
        </div>              
    </div>`
    divCopy.innerHTML = codeCopy;
    document.querySelector('.share-link').style.opacity = '1';
    console.log(url)
    window.open(url, '_blank').focus();
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

const showErrPop = msg => {    
    if(err.classList.contains('show')) err.classList.remove('show');
    setTimeout(() => err.classList.add('show'), 1)
    err.children[0].textContent = msg;
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
    if(username < 1) return showErrPop('Debes ingresar un nombre antes de continuar');
    user = username;
    $container.style.animation = 'disappear .5s forwards';
    setTimeout(() => $container.style.display = 'none',500);
    $uQz.style.width = '100%';
    $pQz.style.width = '100%';
});

//Funcion que me crea el evento sugerido en caso de ser seleccionado

const createQuestSugered = (title, a, b, c) => { //Title seria la pregunta, las opciones serían a b y c
    const fragment = document.createDocumentFragment()
    const divContentQuest = document.createElement('DIV');
        divContentQuest.classList.add('content-quest');
    const select = document.createElement('SELECT');
    const span = document.createElement('SPAN');
    select.classList.add('sugered-select');

    span.textContent = title;
    if(a != undefined && b != undefined || c != undefined){ //Aquí comparo si se le pasaron algunos parametros como las opciones
        const option1 = document.createElement('OPTION');
        const option2 = document.createElement('OPTION');
        const option3 = document.createElement('OPTION');

        option1.value = 'a';
        option1.textContent = a;
    
        option2.value = 'b';
        option2.textContent = b;

        fragment.appendChild(span);  
        select.appendChild(option1);
        select.appendChild(option2);

        if(c != undefined){
            option3.value = 'c';       
            option3.textContent = c;
            select.appendChild(option3);
        };
        fragment.appendChild(select);              
    }else{ 
        //De éste lado, no le paso a proposito un valor de opción para poder crear un input color de la misma funcion y ahorrar código
        const inputColor = document.createElement('INPUT');
        inputColor.setAttribute('type', 'color');
        inputColor.classList.add('input-color');
        fragment.appendChild(span);
        fragment.appendChild(inputColor);
    };
    
    divContentQuest.appendChild(fragment);
    return divContentQuest;
};


//Ésta funcion es llamada cuando la parte de cantidad de respuestas es escogida, ésta funcion me permite poner un listener a cada icono de seleccion
const checkIcon = () => { 
    const iconClick = document.querySelectorAll('.fa-check');

    for(let i = 0; i < iconClick.length; i ++){
        iconClick[i].addEventListener('click', e => {
            (function(){ //Creo una función anonima autoejecutable para no gastar lineas llamandola después de ejecutarla      
                for(const t of e.path[2].children){ //Ésta funcion me permite identificar si ya hay una opcion escogida, en caso de cambiar se borra el id y es colocado en la otra opción escogida
                    if(t.id.includes('selected-answer')){
                        t.removeAttribute('id');
                        t.children[1].removeAttribute('style');
                    };
                };
            }());
            
            let idAns = iconClick[i].parentElement.parentElement;
            idAns.classList.add('selected');
            iconClick[i].style.backgroundColor = '#2af' //Establezco el color al icono después de haber sido clickeado
            iconClick[i].parentElement.id = `selected-answer${idAns.outerText.slice(idAns.outerText.length - 1, idAns.outerText.length)}` //Con esta linea establezco un id unico a cada selección hecha por el usuario (para poder ser identificable en la base de datos y hacer las comprobaciones en el frontend cuando se estén respondiendo los quiz)
        });
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
    (idioma != "en") ? span.textContent = `Pregunta ${contador + 1}` : span.textContent = `Question ${contador + 1}`;
    containDivQuest.id = id;
    const fragmentQuest = document.createDocumentFragment()

    fragmentQuest.appendChild(span)

    if(entries != undefined){
        for(let f of entries){
            f.style.display = 'none';
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


const addQuestInput = node => { //Ésta funcion me crea divs por separado cada vez que se crea una nueva pregunta

    const contentAnswer = document.createElement('DIV');
    const fragment = document.createDocumentFragment();
    contentAnswer.appendChild(addInput());
    contentAnswer.appendChild(createQuest());
    fragment.appendChild(contentAnswer);
    node.appendChild(fragment);
    return node;
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
    const pTitle = document.createElement('P');
    const p = document.createElement('P');
    const fragment = document.createDocumentFragment();
    const divSelectHowAns = document.createElement('DIV');
    
    sendIcon.classList.add('fas', 'fa-arrow-right')
    iIcon.classList.add('fas', 'fa-plus')
    form.classList.add('flex-form');

    divContent.classList.add('c-ur-q');
    divTitle.classList.add('title');
    pTitle.textContent = title;
    // if(languaje != 'es') {
        
    // }
    pTitle.classList.add('title-quest');
    divTitle.appendChild(pTitle);

    divQuestions.classList.add('questions');
            
    divAnswer.classList.add('answers');
    divSelectHowAns.classList.add('select-ans');

    if(showBtn == true){
        divSelectHowAns.appendChild(setLanguaje(languaje));
        divAnswer.appendChild(divSelectHowAns);
    }else{
        divQuestions.classList.replace('questions', 'questions-sug')
        const divPersonality = document.createElement('DIV');
        divPersonality.classList.add('personality', 'section-select');
            divPersonality.innerHTML = `
                <div class="content-sections" data-value="Personalidad"><span class="text-section c">¡Describe tu Personalidad!</span><img class="img-section" src="https://www.synergie.es/wp-content/uploads/2020/11/test-personalidad.jpg"></div>
            `
        const divStyleClothes = document.createElement('DIV');
        divStyleClothes.classList.add('clothes', 'section-select');
        divStyleClothes.innerHTML = `
                <div class="content-sections" data-value="Estilo_De_Vestir"><span class="text-section v">¿Como es tú Estilo de vestir?</span><img class="img-section" src="https://querido-dinero.imgix.net/1302/La-verdad-de-la-ropa-gen%C3%A9rica-vs.-la-de-marca_Portada.png?w=1200&h=628&fit=crop&crop=faces&auto=format,compress&lossless=1"></div>
            `
        const divFood = document.createElement('DIV');
        divFood.classList.add('food', 'section-select');
        divFood.innerHTML = `
                <div class="content-sections" data-value="Comida"><span class="text-section f">¿Cómo es tu Comida Favorita?</span><img class="img-section" src="https://cdn.pixabay.com/photo/2020/12/23/06/34/strawberry-5854081_960_720.png"></div>
            `
        const divTravel = document.createElement('DIV');
        divTravel.classList.add('travel', 'section-select');
        divTravel.innerHTML = `
                <div class="content-sections" data-value="Viajes"><span class="text-section t">¿Como serían tus Viajes ideales?</span><img class="img-section" src="https://p4.wallpaperbetter.com/wallpaper/672/343/818/1920x1080-px-aircraft-humor-imagination-minimalistic-paper-plane-wall-anime-full-metal-alchemist-hd-art-wallpaper-preview.jpg"></div>
            `
        fragment.appendChild(divPersonality);
        fragment.appendChild(divStyleClothes);
        fragment.appendChild(divFood);
        fragment.appendChild(divTravel);
    }
    
    divQuestions.appendChild(fragment)
    divMoreQuest.classList.add('more-quest');
    buttonAdd.classList.add('add-quest-btn');
    buttonAdd.textContent = 'Agregar otra pregunta ';
    buttonAdd.style.display = 'none';

    buttonAdd.classList.add('add-quest-btn');
    buttonAdd.textContent = 'Agregar otra pregunta';
    buttonAdd.appendChild(iIcon)
    buttonAdd.title = 'Agregar pregunta'
    buttonAdd.style.display = 'none';

    spanSend.id = 'send';
    spanSend.textContent = 'Crear quiz'
    spanSend.appendChild(sendIcon)
    divLoad.classList.add('load-send');

    if(idioma == 'en'){
        buttonAdd.textContent = 'Add other question';
    }

    if(showBtn != false){
        divMoreQuest.appendChild(buttonAdd);
        divMoreQuest.appendChild(spanSend);
       
    }

    // divMoreQuest.appendChild(spanSend); //Agergar boton en sugerido

    divQuestions.appendChild(divAnswer);
    fragment.appendChild(divTitle);
    fragment.appendChild(divQuestions);
    fragment.appendChild(divMoreQuest);
    fragment.appendChild(divLoad)
    form.appendChild(fragment);
    divContent.appendChild(form);
    $main.appendChild(divContent);
    divContent.style.animation = 'appear .5s both';
    divContent.style.animationDelay = '.5s';

    const entity = document.querySelectorAll('.entity');

    if(showBtn == false){
        spanSend.style.display = 'inline-block'
    }
    for(let i = 0; i < entity.length; i++){
        entity[i].addEventListener('click', () => {
            cantidad_de_respuestas = entity[i].outerText.slice( 0, 1 );
            let deleteP = document.querySelector('.select-ans');
            spanSend.style.display = 'inline-block'
            buttonAdd.style.display = 'inline-block';
            divAnswer.appendChild(createQuest(entity[i].textContent.slice(0, 1), entity));
            checkIcon();
            contador++;
            id++;
            deleteP.removeChild(deleteP.children[0]);
        });
    };
    if(showBtn == true){
        document.querySelector('.add-quest-btn').addEventListener('click', e => {
            e.preventDefault();
            if(showBtn != false){
                divAnswer.appendChild(createQuest(numAns, '', true));
                contador++;
                id++;
                checkIcon();
            }else{
                divAnswer.appendChild(createQuest('', '', false));
            };
        });
    }else{
        divQuestions.addEventListener('click', e => {
            if(e.path[1].children[0].tagName == 'SPAN'){
                console.log(e.path[1].getAttribute('data-value'))
                preguntaSugerida = e.path[1].getAttribute('data-value'); //Agrego la categoría de quiz sugerido que el usuario seleccionó 
                divMoreQuest.appendChild(spanSend)
            };
        });
    };
    
    //Evento para enviar los datos
    document.querySelector('.more-quest').addEventListener('click', e => {
        if(e.target.tagName == 'SPAN'){
            if(showBtn){
                let empty = false;
                let inputValue = document.querySelectorAll('.answ');
                let questionValue = document.querySelectorAll('.question');
                if(contador < 2 && showBtn == true){
                    return (idioma != "en") ? showErrPop('Debes completar al menos dos preguntas antes de continuar') : showErrPop('You need complete two question after continue');  
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
                    if(idioma != "en"){
                        (document.querySelectorAll('.selected').length < contador) ? showErrPop('No puedes dejar campos de respuestas sin seleccionar') : CreateObjectGame().then((Game)=>{
                            console.log("PROMESAAA");
                            upToFirebase(Game, divLoad, divMoreQuest, user).then( (url) =>nextPage(url, divContent))
                            .catch((error,docRef)=>{
                                divLoad.removeAttribute('style');
                                divMoreQuest.style.visibility = 'visible';
                                console.error(error);
                                showErrPop('Ha ocurrido un error, reintalo de nuevo')

                                database.collection('quiz_personalizados').doc(docRef).delete()
                                database.collection('scoreboards_table').doc(docRef).delete()

                                }   
                            )
                        });       
                    }else{
                        (document.querySelectorAll('.selected').length < contador) ? showErrPop('You can not let empty fields of responses without selected') : CreateObjectGame().then((Game)=>{
                            console.log("PROMESSSS")
                            upToFirebase(Game, divLoad, divMoreQuest, user).then((url)=>nextPage(url, divContent))
                            .catch((error)=>{
                                divLoad.removeAttribute('style')
                                divMoreQuest.style.visibility = 'visible';
                                console.error(error);
                                showErrPop('Ha ocurrido un error, reintalo de nuevo')
                                }            
                            )
                        });       
                    };
                }else return showErrPop('Comprueba que todos los campos estén completos antes de continuar');  
            }else{
                console.log('soy sugerido')
                //Nos traimos la plantilla elegida by user
                
                const get_pre_Game = async(preguntaSugerida)=>{ 
                    console.log("inicio")
                    const gameRef = database.collection('plantilla_quiz_sugeridos').doc(preguntaSugerida);
                    const doc = await gameRef.get();
                    const data = doc.data()
                    const Game = Object.values(data.Game)
                    return Game
                }
                get_pre_Game(preguntaSugerida)
                    .then((pre_game)=>{
                        console.log(pre_game)
                        //añadir un super for que por cada objeto en pregame muestre su pregunta y respuesta en el frontend, para luego insertar niceValue
                                //mision secundaria: guardar cada una de las 4 respuestas de pregame en el indexed db, asi get_pre_Game solo ocurra si no existe la plantilla json en la base de datos local xd
                        //por ultimo, al oprimir el boton final, asignar nicevalues y descomentar las 2 lineas de codigo de abajo        
                        //upToFirebase(Game, divLoad, divMoreQuest, user,'quiz_sugeridos').then((url) =>
                          //      nextPage(url, divContent))
                    })
                
            //    setTimeout(()=>{
            //     console.log(get_pre_Game)
            //    },5000) 
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
        $pQz.style.animation = 'hidden2 .7s forwards';

        createQuiz($q[i].children[0]);
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
            return showErrPop('Comprueba que todos los campos estén completos antes de continuar');
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

document.getElementById('send-email').addEventListener('click', () => {
    window.location.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=mitrivia77@gmail.com';
});
