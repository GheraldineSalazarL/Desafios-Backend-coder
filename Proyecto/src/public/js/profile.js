const forms = document.querySelectorAll('.uploadForm');

const handleFormSubmit = async (event, form) => {

    const userElement = document.getElementById('user-data');
    const uid = userElement.getAttribute('data-user');
    event.preventDefault();

    const formData = new FormData();
    const inputName = form.getAttribute('data-input');
    const fileInput = form.querySelector('.fileInput');
    const file = fileInput.files[0];
    const newFileName = form.querySelector('input[name="filename"]').value;

    const fileExtension = file.name.split('.').pop(); 
    const finalFileName = `${newFileName}.${fileExtension}`;

    formData.append('document', file, finalFileName);

    try {
        const response = await fetch(`/api/users/${uid}/documents`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (response.ok) {
            location.reload();
        } else {
        }
    } catch (error) {
        console.error(error);
    }

};

forms.forEach(form => {
    const fileInput = form.querySelector('.fileInput');

    fileInput.addEventListener('change', async (event) => {
        await handleFormSubmit(event, form);
    });
});



const fileInputs = document.querySelectorAll('.fileInput');

fileInputs.forEach(input => {
    input.addEventListener('change', () => {
        const label = input.previousElementSibling; 
        if (input.files && input.files[0]) {
            label.classList.add('file-label-upload'); 
            label.innerHTML = `<i class="fas fa-file"></i><span>Archivo Cargado</span>`;
        } else {
            label.classList.remove('file-label-upload'); 
            label.innerHTML = `<i class="fas fa-cloud-upload-alt"></i><span>Seleccionar archivo</span>`; 
        }
    });
});