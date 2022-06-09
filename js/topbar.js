var user = JSON.parse(localStorage.getItem('user') || '{}');
axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;

profile();
async function profile(){
    await axios({
        method: 'GET',
        url: `https://intellistock-api.herokuapp.com/companies/${user.id}`
    }).then(response => {
        console.log(response.data.name);
        var name = document.getElementById('nameProfile')
        name.innerHTML = `${response.data.name}`
        document.getElementById('logoProfile').setAttribute("src", "data:image/jpg;base64," + `${response.data.logo}`);
    })
} 