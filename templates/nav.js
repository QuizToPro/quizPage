const nav = document.querySelector('.nav');

document.querySelector('.fa-bars').addEventListener('click', () => {
    nav.classList.toggle('showNav')
})

document.querySelector('.close-nav').addEventListener('click', () => {
    nav.classList.toggle('showNav')
})

if(localStorage.getItem('lang') == 'en'){
    const $home = document.getElementById('home-nav');
    const $contact = document.getElementById('contact-nav');
    const $aboutUs = document.getElementById('about-us_nav');

    $home.innerHTML = '<i class="fas fa-home"></i> Home </a>'
    $contact.innerHTML = '<i class="far fa-address-card"></i> Contact'
    $aboutUs.innerHTML = '<i class="fas fa-question-circle"></i> About us'
}