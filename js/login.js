// const { src } = require("gulp");

async function login(){
    let email = $('#email').val();
    let password = $('#password').val();

    console.log(email);
    console.log(password);

    await axios({
        method: 'POST',
        url:`https://intellistock-api.herokuapp.com/users/login`,
        data: {
            email,
            password
        }
    }).then(response => {
        console.log(response);

        let user = {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            token: response.data.token,
            company_id: response.data.user.company_id
        }

        localStorage.setItem('user', JSON.stringify(user))

        window.location.href = "./views/home.html";
    }).catch(error => {

        if (error.response.status == 403) {
            var body = document.getElementById('spaceAlert');
            var alerta = document.createElement('div');

            alerta.innerHTML = `<div class="alert alert-danger" role="alert"> Email ou senha incorretos! </div> <hr>`;

            body.appendChild(alerta);

            setTimeout(function(){ window.location.reload() }, 1000);
        }
    })
}