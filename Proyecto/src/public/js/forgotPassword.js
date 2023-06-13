const emailInput = document.getElementById('emailInput');

emailInput.addEventListener('submit', e => {
    e.preventDefault();

    const data = new FormData(emailInput);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);

    fetch('/api/sessions/forgot-password', {
       method: 'POST',
       body: JSON.stringify(obj),
       headers: {
        'Content-Type': 'application/json'
       } 
    }).then(result => {
        if(result.status === 200) {
            window.location.replace('/login');
        }
    })
});