// const { src } = require("gulp");
const cacheAvailable = 'caches' in self;

async function login(){
    let email = $('#email').val();
    let password = $('#password').val();

    await axios({
        method: 'POST',
        url:`https://intellistock-api.herokuapp.com/users/login`,
        data: {
            email,
            password
        }
    }).then(async (response) => {

        console.log(response.data.user.id);

        let user = {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            token: response.data.token,
            company_id: response.data.user.company_id
        }

        const options = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const cache = await caches.open('my-cache');
        
        await cache.put('/user', new Response (
            `
                {
                    "id":"${user.id}", 
                    "name":"${user.name}", 
                    "email":"${user.email}", 
                    "token":"${user.token}", 
                    "company_id":"${user.company_id}"
                }
            `
        , options))
        
        const respTest = await cache.match('/user');
        
        respTest.json().then(resposta => {
            console.log(resposta.id);

            // await cache.put('/user', new Response (`{"id":"${resposta.id}"}`))
            
            // const test = await cache.match('/user', optionsReq)
            // test.json().then(r => {
            //     console.log(r);
            // })
        })

 
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