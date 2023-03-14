const socket = io(); 

let user;

const chatbox = document.getElementById('chatBox');

Swal.fire({
title: 'Identifícate',
input:'email',
text: 'Ingresa tu email para identificarte en el chat',
inputValidator: (value) => { 
    const re = /\S+@\S+\.\S+/;
    const emailOk = re.test(value);
    return !emailOk && "Necesitas escribir un email correcto";
},
allowOutsideClick: false,
}) .then (result => {
user = result.value;
socket.emit('authenticated', user);
}) 

chatbox.addEventListener('keyup', evt => {
    if(evt.key === 'Enter') {
        if(chatbox.value.trim().length>0) {
            socket.emit('message', {
                user,
                message: chatbox.value
            });
        }

        resetInput();
    }
});

socket.on('messageLogs', data => {
    if(!user) return;
    let log = document.getElementById('messageLogs');
    let messages = '';
    data.forEach(message => {
        messages += `${message.user} dice: ${message.message}<br/>`
    });
    log.innerHTML = messages;
});

socket.on('newUserConnected', data =>{
    if(!user) return;
    Swal.fire({
        toast: true,
        position:'top-end',
        showConfirmButton:false,
        timer:6000,
        title: `${data} se ha unido al chat`,
        icon: 'success'
    })
})

const resetInput = () =>{
    chatbox.value = "";
}
