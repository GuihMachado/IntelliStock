async function registrar(){
    const user = {
        name: $('#user_name').val(),
        email: $('#user_email').val(),
        password: $('#user_password').val(),
    }

    const company = {
        name: $('#company_name').val(),
        cnpj: $('#company_cnpj').val()
    }

    await axios({
        method: 'POST',
        url:`https://intellistock-api.herokuapp.com/companies`,
        data: {
            user,
            company
        }
    }).then(response => {
        console.log(response);

        var body = document.getElementById('spaceAlert');
        var alerta = document.createElement('div');

        alerta.innerHTML = `<div class="alert alert-sucess" role="alert"> Cadastrado com sucesso! </div> <hr>`;

        body.appendChild(alerta);

        setTimeout(function(){ window.location.href = "index.html"; }, 1500);

    }).catch(error => {

        console.log();

        var body = document.getElementById('spaceAlert');
        var alerta = document.createElement('div');

        alerta.innerHTML = `<div class="alert alert-danger" role="alert"> Erro ao cadastrar, tente novamente mais tarde! </div> <hr>`;

        body.appendChild(alerta);

        setTimeout(function(){ window.location.reload() }, 1500);
    })
}