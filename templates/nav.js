const nav = document.querySelector('.nav');

document.querySelector('.fa-bars').addEventListener('click', () => {
    nav.classList.toggle('showNav')
})

document.querySelector('.close-nav').addEventListener('click', () => {
    nav.classList.toggle('showNav')
})