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
        url: `https://intellistock-api.herokuapp.com/companies/${user.id}`
    }).then(response => {

        console.log(user.id);

        $('#nome').val(response.data.name);
        $('#cnpj').val(response.data.cnpj);
        document.getElementById('img-profile').setAttribute("src", "data:image/jpg;base64," + `${response.data.logo}`);

    }).catch(error => {
        console.log(error);
        if (error.response.status == 401) {
            document.getElementById('goToLogin').click();
        }
    })

    $('#empresa').addClass('active');
}

//Alteração de imagem
async function alterarImagem() {

    if ($('#img-profile-input').val() != "") {

        var data = new FormData(document.getElementById("form-data"));

        await axios({
            method: 'PATCH',
            url: `https://intellistock-api.herokuapp.com/companies/${user.id}`,
            data
        }).then(response => {

            user.img = response.data.imagem;

            var modal = document.getElementById('bodyModal');
            var alerta = document.createElement('div');
            
            alerta.innerHTML = `<div class="alert alert-success" role="alert"> Sucesso ao editar a imagem! </div>`;
            
            modal.appendChild(alerta);

            $('#alertStatus').modal('show');
            setTimeout(function(){ $('#alertStatus').modal('hide'); window.location.reload(true); alerta.innerHTML = ''}, 1500);
            
        }).catch(error => {
            console.log(error);
            window.location.reload(true);
            var modal = document.getElementById('bodyModal');
            var alerta = document.createElement('div');
            
            alerta.innerHTML = `<div class="alert alert-danger" role="alert"> Erro ao editar a imagem! </div>`;
            
            modal.appendChild(alerta);

            $('#alertStatus').modal('show');
            setTimeout(function(){ $('#alertStatus').modal('hide'); window.location.reload(true); alerta.innerHTML = ''}, 1500);
            })

    } 
     else {
        var modal = document.getElementById('bodyModal');
        var alerta = document.createElement('div');
        
        alerta.innerHTML = `<div class="alert alert-warning" role="alert"> Selecione uma imagem! </div>`;
        
        modal.appendChild(alerta);

        $('#alertStatus').modal('show');
        setTimeout(function(){ $('#alertStatus').modal('hide'); alerta.innerHTML = ''}, 1500);
    }
}

//Abertura de modal de edição
async function EditUser() {

    $('#EditUsuario').modal('show');

    await axios({
        method: 'GET',
        url: `https://intellistock-api.herokuapp.com/companies/${user.id}`
    }).then(response => {

        $('#nome-edit').val(response.data.name);
        $('#cnpj-edit').val(response.data.cnpj);

    }).catch(error => {
        console.log(error);
        if (error.response.status == 401) {
            document.getElementById('goToLogin').click();
        }
    })
}

//Edição de usuário
async function editarUsuario() {
    if ($('#nome-edit').val() != "" && $('#cnpj-edit').val() != "") {

        let id = user.id;
        let name = $('#nome-edit').val();
        let cnpj = $('#cnpj-edit').val();

        await axios({
            method: 'PUT',
            url: `https://intellistock-api.herokuapp.com/companies/${id}`,
            data: {
                name,
                cnpj,
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
function logout() {
    
}