const $selectLanguage = document.getElementById('select-language');

$selectLanguage.addEventListener('change', e => {
    localStorage.setItem('lang', $selectLanguage.value);
    history.go();
});

if(localStorage.getItem('lang') == 'en'){
    const $p1 = document.querySelector('.p1')
    const $p2 = document.querySelector('.p2')
    const $ab = document.querySelector('.ab')
    $p1.innerHTML = `
        We are a new company called <b><i>R.R - Company</i></b> that loves the develop and technologies
        we are specialized in the web developer area, our vision about <b>MiTRIVIA</b> is make that users could funny
        and could stay together with their friends, having in count the dinamic and flexible is our web
        given at user the posibility of choose
    `
    $p2.innerHTML = `
        <b> <i> R.R - Company </i> </b>
        it is based a lot on the opinion of our users, who always help us to improve our site since we always read their requests,
        If you want to contact us, you can go to the section <a href="../contact/contact.html"> Contact </a>, there you can ask us any questions or doubts you have
        about us or our website
    `
    document.getElementById('contact-text').textContent = 'Social Networks';
    document.getElementById('email-text').textContent = 'Let us know in what things maybe would us upgrade!, the opinions from the users are welcome';
    document.getElementById('select-lg-txt').textContent = 'Select your language';
    document.getElementById('send-email').textContent = 'Send email';

    $ab.textContent = 'About us'
}



document.getElementById('home').addEventListener('click', () => {
    window.location.href = 'https://mitrivia77-97762.web.app/'
})