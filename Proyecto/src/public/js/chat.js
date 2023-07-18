const socket = io();

const userDataEmailElement = document.getElementById('userEmail-data');
const user = userDataEmailElement.getAttribute('data-userEmail');

const chatbox = document.getElementById('chatBox');

socket.emit('authenticated', user);

socket.on('messageLogs', data => {
    if (!user) return;
    let log = document.getElementById('messageLogs');
    let messages = '';
    data.forEach(message => {
        const messageClass = message.user === user ? 'own-message' : '';
        messages += `<p class="message ${messageClass}">${message.user} dice: ${message.message}</p>`;
    });
    log.innerHTML = messages;
    scrollToBottom(log); 
});

chatbox.addEventListener('keyup', evt => {
    if (evt.key === 'Enter') {
        if (chatbox.value.trim().length > 0) {
            socket.emit('message', {
                user,
                message: chatbox.value
            });
        }

        resetInput();
    }
});

socket.on('newUserConnected', data => {
    if (!user) return;
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 6000,
        title: `${data} se ha unido al chat`,
        icon: 'success'
    })
})

const resetInput = () => {
    chatbox.value = "";
}

function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
}