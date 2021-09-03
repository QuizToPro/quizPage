'use strict'

const $btnStart = document.getElementById('btn-start'); //Obtengo el boton de inicio 'Comenzar'
const $container = document.querySelector('.container'); //El article
const $main = document.querySelector('.main'); //section main
const $uQz = document.querySelector('.u-qz'); //La seccion de preguntas sugeridas
const $pQz = document.querySelector('.p-qz'); //La seccion de preguntas personalizadas
const $q = document.querySelectorAll('.q'); //Aquí me traigo ambas secciones de arriba 
let numAns = 0; //La seleccion de la cantidad de respuestas que podrá realizar el usuario
let id = 0; //Es el contador de id de cada div question
let contador = 1; //Contador que me permite identificar la respuesta seleccionada

//Evento para aparecer los apartados de que tipo de quiz prefieres

$btnStart.addEventListener('click', e => {
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
        }
        fragment.appendChild(select);              
    }else{ 
        //De éste lado, no le paso a proposito un valor de opción para poder crear un input color de la misma funcion y ahorrar código
        const inputColor = document.createElement('INPUT');
        inputColor.setAttribute('type', 'color');
        inputColor.classList.add('input-color')
        fragment.appendChild(span);
        fragment.appendChild(inputColor);
    }
    
    
    divContentQuest.appendChild(fragment);
    return divContentQuest;
}


//Ésta funcion es llamada cuando la parte de cantidad de respuestas es escogida, ésta funcion me permite poner un listener a cada icono de seleccion
const checkIcon = () => { 
    const iconClick = document.querySelectorAll('.fa-check');

    for(let i = 0; i < iconClick.length; i ++){
        iconClick[i].addEventListener('click', e => {

            (function(){ //Creo una función anonima autoejecutable para no gastar lineas llamandola después de ejecutarla
        
                for(const t of e.path[2].children){ //Ésta funcion me permite identificar si ya hay una opcion escogida, en caso de cambiar se borra el id y es colocado en la otra opción escogida
                    if(t.id == `selected-answer${contador - 1}`){               
                        t.removeAttribute('id');
                        t.children[1].removeAttribute('style')
                    }
                }
            }())
                        
            iconClick[i].style.backgroundColor = '#2af' //Establezco el color al icono después de haber sido clickeado
            iconClick[i].parentNode.id = `selected-answer${contador - 1}`   //Con esta linea establezco un id unico a cada selección hecha por el usuario (para poder ser identificable en la base de datos y hacer las comprobaciones en el frontend cuando se estén respondiendo los quiz)   
        });
    };                     
};


//Funcion que crea otra pregunta cuando se le da al boton de agregar otra pregunta
const createQuest = (entity, entries, p) => {
    if(contador > 10) return alert('Haz alcanzado el máximo de preguntas')
    const containDivQuest = document.createElement('DIV');
    containDivQuest.classList.add(`questions2`);
    const span = document.createElement('span');
    span.textContent = `Pregunta #${contador}` 
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
            inputQuestion.setAttribute('placeholder', 'Escribe una pregunta');
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
            inputQuest.setAttribute('spellcheck', 'true');
            inputQuest.setAttribute('placeholder', 'Escribe la posible respuesta');
            inputQuest.setAttribute('minlenght', '5');
            inputQuest.setAttribute('maxlength', '50');
            inputQuest.setAttribute('required', 'true');
            contentInput.appendChild(inputQuest);
            contentInput.appendChild(iconCheck);
            fragmentQuest.appendChild(contentInput);
        };
        containDivQuest.appendChild(fragmentQuest)
        return containDivQuest;
    }        
};


const addQuestInput = node => { //Ésta funcion me crea divs por separado cada vez que se crea una nueva pregunta

    const contentAnswer = document.createElement('DIV');
    const fragment = document.createDocumentFragment();
    contentAnswer.appendChild(addInput());
    contentAnswer.appendChild(createQuest());
    fragment.appendChild(contentAnswer);
    node.appendChild(fragment)
    return node;
};


//Funcion padre que me crea un tipo de quiz diferente dependiendo de lo que haya seleccionado el usuario
const contentHTML = (title, showBtn) => { //title es el tipo de quiz que se haya seleccionado, showBtn recibe un booleano que será el que me permita crear la funcion personalizada, si es false se crea el quiz sugerido
    const divContent = document.createElement('DIV');
    const form = document.createElement('FORM');
    const divTitle = document.createElement('DIV');
    const divQuestions = document.createElement('DIV');
    const divAnswer = document.createElement('DIV');
    const divMoreQuest = document.createElement('DIV');
    const inputSend = document.createElement('INPUT');
    const buttonAdd = document.createElement('BUTTON');
    const pTitle = document.createElement('P');
    const fragment = document.createDocumentFragment();
    const divSelectHowAns = document.createElement('DIV');
    const span1 = document.createElement('SPAN');
    const span2 = document.createElement('SPAN');
    const span3 = document.createElement('SPAN');
    const p = document.createElement('P');

    form.classList.add('flex-form');

    divContent.classList.add('c-ur-q');
    divTitle.classList.add('title');
    pTitle.textContent = title;

    divTitle.appendChild(pTitle);

    divQuestions.classList.add('questions');
            
    divAnswer.classList.add('answers');
    divSelectHowAns.classList.add('select-ans');

    if(showBtn == true){
        p.textContent = 'Selecciona la cantidad de respuestas que los usuarios podrán ingresar';
        span1.textContent = '2 Respuestas';
        span2.textContent = '3 Respuestas';
        span3.textContent = '4 Respuestas';
        span1.classList.add('entity');
        span2.classList.add('entity');
        span3.classList.add('entity');
        divSelectHowAns.appendChild(p);
        divSelectHowAns.appendChild(span1);
        divSelectHowAns.appendChild(span2);
        divSelectHowAns.appendChild(span3);
        divAnswer.appendChild(divSelectHowAns);
    }else{
        divAnswer.appendChild(createQuestSugered('¿Cuál es mi bebida favorita?', 'Pepsi', 'Coca-Cola'));
        divAnswer.appendChild(createQuestSugered('¿Cuál es mi color favorito?'));        
        divAnswer.appendChild(createQuestSugered('¿Qué prefiero?', 'Fiestas', 'Quedarme en casa'));
        divAnswer.appendChild(createQuestSugered('¿Deporte favorito?', 'Basketball', 'Futbol', 'Ninguno de los anteriores'));
        divAnswer.appendChild(createQuestSugered('¿Cuál comida prefiero?', 'Hamburguesas', 'Perros calientes'));

    }

    divMoreQuest.classList.add('more-quest');
    buttonAdd.classList.add('add-quest-btn');
    buttonAdd.textContent = 'Agregar otra pregunta';
    buttonAdd.style.display = 'none';
    divMoreQuest.appendChild(buttonAdd);

    inputSend.id = 'send';
    inputSend.setAttribute('type', 'submit');

    divQuestions.appendChild(divAnswer);
    fragment.appendChild(divTitle);
    fragment.appendChild(divQuestions);
    fragment.appendChild(divMoreQuest);
    fragment.appendChild(inputSend);
    form.appendChild(fragment);
    divContent.appendChild(form);
    $main.appendChild(divContent);
    divContent.style.animation = 'appear .5s both';
    divContent.style.animationDelay = '1s';

    const entity = document.querySelectorAll('.entity');

    for(let i = 0; i < entity.length; i++){
        entity[i].addEventListener('click', () => {    
            divAnswer.appendChild(createQuest(entity[i].textContent.slice(0, 1), entity));
            checkIcon();
            contador++;
            id++;
            divSelectHowAns.removeChild(p);
            buttonAdd.style.display = 'inline-block';
        });
    };
       
    document.querySelector('.add-quest-btn').addEventListener('click', e => {
        e.preventDefault();
        if(showBtn != false){
            divAnswer.appendChild(createQuest(numAns, '', true));
            contador++;
            id++;
            checkIcon()
        }else{
            divAnswer.appendChild(createQuest('', '', false));
        };
    });

    document.getElementById('send').addEventListener('click', e => {
        if(contador < 3 && showBtn == true){
            alert('Debes completar al menos dos preguntas');
            e.preventDefault();
        };
    });
};

const createQuiz = selected => {
    
    if(selected.id == 'p'){
        contentHTML('¡Estás creando tu quiz personalizado!', true)
    }else{
        contentHTML('¡Estás creando tu quiz sugerido!', false)
    }
}

for(let i = 0; i < $q.length; i++){
    $q[i].addEventListener('click', () => {

        $uQz.style.animation = 'hidden .7s forwards';
        $pQz.style.animation = 'hidden .7s forwards';

        createQuiz($q[i].children[0]);
    });
};