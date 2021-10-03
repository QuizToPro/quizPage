const $form = document.getElementById('form');

$form.addEventListener('submit', handleSubmit)

async function handleSubmit(e){
    e.preventDefault()
    const form = new FormData(this)
    const res = await fetch(this.action, {
        method: this.method,
        body: form,
        headers: {
            'Accept': 'application/json'
        }
    })
    if(res.ok){
        alert('Form sended')
    }
}

document.getElementById('home').addEventListener('click', () => {
    window.location.href = 'https://mitrivia77-97762.web.app/'
})