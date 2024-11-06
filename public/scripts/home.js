document.addEventListener('DOMContentLoaded', () => {
    let user = sessionStorage.getItem('user');
    if (!user) {
        user = prompt('Ingresa un nombre de usuario:');
        if (user) {
            sessionStorage.setItem('user', user);
        } else {
            alert('Debe ingresar un nombre de usuario');
            window.location.href = '/';
        }
    }
});