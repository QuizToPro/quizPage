const $form = document.getElementById('form');
const $selectLanguage = document.getElementById('select-language');
$form.addEventListener('submit', handleSubmit);

if(localStorage.getItem('lang') == 'en'){

    const $name = document.getElementById('name');
    const $lastName = document.getElementById('last-name');
    const $msg = document.getElementById('msg');
    const $p1 = document.querySelector('.p1');
    const $hContact = document.querySelector('.hContact');

    $name.placeholder = 'Name';
    $lastName.placeholder = 'Last name';
    $msg.placeholder = 'Message';

    $hContact.textContent = 'Contact';
    $p1.textContent = 'Do you have any questions? You are in the right place, write to us and we will answer you soon';

    document.getElementById('contact-text').textContent = 'Social Networks';
    document.getElementById('email-text').textContent = 'Let us know in what things maybe would us upgrade!, the opinions from the users are welcome';
    document.getElementById('select-lg-txt').textContent = 'Select your language';
    document.getElementById('send-email').textContent = 'Send email';
};

async function handleSubmit(e){
    e.preventDefault();
    const form = new FormData(this);
    const res = await fetch(this.action, {
        method: this.method,
        body: form,
        headers: {
            'Accept': 'application/json'
        }
    });
    if(res.ok){
        alert('Form sended')
    };
}

document.getElementById('home').addEventListener('click', () => {
    window.location.href = 'https://mitrivia77-97762.web.app/'
});

$selectLanguage.addEventListener('change', e => {
    localStorage.setItem('lang', $selectLanguage.value);
    history.go();
});