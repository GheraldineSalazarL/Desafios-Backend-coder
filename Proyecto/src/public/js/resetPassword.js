const passwordInput = document.getElementById('passwordInput');

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');


passwordInput.addEventListener('submit', e => {
    e.preventDefault();

    const formData = new FormData(passwordInput);
    formData.append('userToken', token);
  
    const data = Object.fromEntries(formData.entries());
  
    console.log(data);

    fetch('/api/sessions/reset-password', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        } 
    }).then(result => {
        if(result.status === 200) {
            window.location.replace('/login');
        }
    })
});