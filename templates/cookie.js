const accept = document.querySelector('.accept-cookie')
let accepted = false;

if(localStorage.getItem('cookie') === null){
    console.log('hola')
    function setCookie(name, value, expires){
        let d = new Date();
        d.setTime( d.getTime() + expires * 24 * 60 * 60 * 1000 );
        document.cookie = `${name} = ${value}; expires = ${d.toUTCString()}; path=/`;
    };
    
    accept.addEventListener('click', e => {
        localStorage.setItem('cookie', true)
        accepted = true;
        $cookieDiv.style.display = 'none'
    });
    
    $btnStart.addEventListener('click', () => {
        if(accepted){
            if($userInput.value.length > 0){        
                console.log('hola')  
                setCookie("user", $userInput.value, 10)
            };
        };
    });
};


