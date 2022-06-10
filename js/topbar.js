profile();
async function profile(){
    const cache = await caches.open('my-cache');
    
    const cacheResponse = await cache.match('/user');

    const user = await cacheResponse.json()

    console.log(user);
    console.log(user.id);
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;

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