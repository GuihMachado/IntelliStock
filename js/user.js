axios.defaults.headers.patch['Content-Type'] = 'Multipart/form-data';

//Listagem
meuPerfil();
async function meuPerfil() {
    const cache = await caches.open('my-cache');
    
    const cacheResponse = await cache.match('/user');

    user = await cacheResponse.json()
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;

    await axios({
        method: 'GET',
        url: `https://intellistock-api.herokuapp.com/users/${user.id}`
    }).then(response => {

        console.log(user.id);

        $('#nome').val(response.data.name);
        $('#email').val(response.data.email);

    }).catch(error => {
        console.log(error);
        if (error.response.status == 401) {
            document.getElementById('goToLogin').click();
        }
    })

    $('#empresa').addClass('active');
}

//Abertura de modal de edição
async function EditUser() {

    $('#EditUsuario').modal('show');

    await axios({
        method: 'GET',
        url: `https://intellistock-api.herokuapp.com/users/${user.id}`
    }).then(response => {

        $('#nome-edit').val(response.data.name);
        $('#email-edit').val(response.data.email);

    }).catch(error => {
        console.log(error);
        if (error.response.status == 401) {
            document.getElementById('goToLogin').click();
        }
    })
}

//Edição de usuário
async function editarUsuario() {
    if ($('#nome-edit').val() != "" && $('#email-edit').val() != "") {

        let id = user.id;
        let name = $('#nome-edit').val();
        let email = $('#email-edit').val();

        await axios({
            method: 'PUT',
            url: `https://intellistock-api.herokuapp.com/users/${id}`,
            data: {
                name,
                email
            }
        }).then(response => {

            $('#EditUsuario').modal('hide');
            var modal = document.getElementById('bodyModal');
            var alerta = document.createElement('div');
            
            alerta.innerHTML = `<div class="alert alert-success" role="alert"> Sucesso ao editar usuário! </div>`;
            
            modal.appendChild(alerta);

            $('#alertStatus').modal('show');
            setTimeout(function(){ $('#alertStatus').modal('hide'); window.location.reload(true); alerta.innerHTML = ''}, 1500);

        }).catch(error => {
            $('#EditUsuario').modal('hide');
            
            var modal = document.getElementById('bodyModal');
            var alerta = document.createElement('div');
            
            alerta.innerHTML = `<div class="alert alert-danger" role="alert"> Erro ao editar usuário! </div>`;
            
            modal.appendChild(alerta);

            $('#alertStatus').modal('show');
            setTimeout(function(){ $('#alertStatus').modal('hide'); window.location.reload(true); alerta.innerHTML = ''}, 1500);
        })

    } else {
        $('#EditUsuario').modal('hide');

        var modal = document.getElementById('bodyModal');
        var alerta = document.createElement('div');
        
        alerta.innerHTML = `<div class="alert alert-warning" role="alert"> Campos incompletos! </div>`;
        
        modal.appendChild(alerta);

        $('#alertStatus').modal('show');
        setTimeout(function(){ $('#alertStatus').modal('hide'); alerta.innerHTML = ''}, 1500);
    }
}

//Logout
async function logout() {
    const cache = await caches.open('my-cache');
    
    await cache.delete('/user');

    window.location.href = "../index.html";
}