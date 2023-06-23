function changeUserRole(userId, isChecked) {    
    // const data = {
    //   userId: userId,
    //   isChecked: isChecked
    // };
    console.log(userId)
  
    fetch(`http://localhost:8080/api/users/premium/${userId}`, {
        method: 'POST',
        body: JSON.stringify({ id: userId }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    .then(response => {
    if (response.ok) {
        location.reload();
    } else {
        throw new Error('Error en la solicitud POST');
    }
    })
    .then(data => console.log(data))
      
  }


//   document.addEventListener('click', function(event) {
//     const target = event.target;
//     if (target && target.matches('.switch input[type="checkbox"]')) {
//       const userId = target.parentNode.parentNode.querySelector('td').textContent;
//       const isChecked = target.checked;
//       changeUserRole(userId, isChecked);
//     }
//   });