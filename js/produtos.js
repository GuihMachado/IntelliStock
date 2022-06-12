produtos();
async function produtos(){
    const cache = await caches.open('my-cache');
    
    const cacheResponse = await cache.match('/user');

    user = await cacheResponse.json()
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;

    await axios({
        method: 'GET',
        url: `https://intellistock-api.herokuapp.com/products/company/${user.id}`
    }).then(async (response) => {

        $('#dataTable').DataTable().destroy();
        
        var tbody = document.getElementById('conteudo-produtos');

        response.data.products.forEach(produtos => {

            console.log(produtos);

            var tr = document.createElement('tr');
            
            // var td_id = document.createElement('td');
            var td_titulo = document.createElement('td');
            var td_categoria = document.createElement('td');
            var td_quantidade = document.createElement('td');
            var td_editar = document.createElement('td');
            var td_excluir = document.createElement('td');
            
            // td_id.innerHTML = id;
            td_titulo.innerHTML = produtos.name;
            td_categoria.innerHTML = ''
            td_quantidade.innerHTML = produtos.amount;
            
            td_editar.innerHTML =
                "<center>" +
                "<button class='btn btn-warning btn-circle' onclick='editProdutos(" + produtos.id + ")' >" +
                "<i class='fas fa-edit' ></i>" +
                "</button>" +
                "</center>";

            td_excluir.innerHTML =
                "<center>" +
                "<button class='btn btn-danger btn-circle' onclick='del(" + produtos.id + ")' >" +
                "<i class='fas fa-trash'></i>" +
                "</button>" +
                "</center>";

            // tr.appendChild(td_id);
            tr.appendChild(td_titulo);
            tr.appendChild(td_categoria);
            tr.appendChild(td_quantidade);
            tr.appendChild(td_editar);
            tr.appendChild(td_excluir);
        
            tbody.appendChild(tr);
        })

        $('#dataTable').DataTable({});

    }).catch(error => {
        console.log(error);
    })

    $('#produtos').addClass('active');
}

async function addProdutos(){
    $('#AddProdutos').modal('show');

    var aux_cate = 0;
    var select_cate = document.getElementById('categoriasProdutos');
    select_cate.innerText = "";
    await axios({
        url: `https://intellistock-api.herokuapp.com/categories`,
        method: 'GET'
    })
    .then(resp => {
        resp.data.forEach(function(value) {
            if(aux_cate == 0) {
                aux_cate++;
            }

            var categorias = document.createElement("option");
            categorias.setAttribute("value", value.id);
            var categorias_nome = document.createTextNode(value.name);
            categorias.appendChild(categorias_nome);

            select_cate.appendChild(categorias);
        })
    }).then(resp => {
        $(function(){  
            $('#categoriasProdutos').multiselect({
                buttonWidth: '100%',
                enableCaseInsensitiveFiltering: true,
                filterPlaceholder: 'Procurar...',
                buttonText: function(options) {
                    if (options.length === 0) {
                        return 'Nada selecionado';
                    }
                    else {
                        var labels = [];
                        options.each(function() {
                            if ($(this).attr('label') !== undefined) {
                                labels.push($(this).attr('label'));
                            }
                            else {
                                labels.push($(this).html());
                            }
                        });
                        return labels.join(', ') + '';
                    }
                }
            });
        });
    })
}

async function AdicionarProdutos() {

    var id_categoria = $('#categoriasProdutos').val()
    var name = $('#titulo').val()
    var amount = $('#quantidade').val()
    var id_company = user.company_id

    await axios({
        method: 'POST',
        url: `https://intellistock-api.herokuapp.com/products/company/${id_company}/category/${id_categoria}`,
        data: {
            name,
            amount
        }
    }).then(response => {

        $('#AddProdutos').modal('hide');
        var modal = document.getElementById('modalAlert');
        var alerta = document.createElement('div');
        
        alerta.innerHTML = `<div class="alert alert-success" role="alert"> Sucesso ao cadastrar! </div>`;
        
        modal.appendChild(alerta);

        $('#alertStatus').modal('show');
        setTimeout(function(){ $('#alertStatus').modal('hide'); window.location.reload(true); alerta.innerHTML = ''}, 1500);

    }).catch(error => {
        console.log(error);
        $('#AddProdutos').modal('hide');
        var modal = document.getElementById('modalAlert');
        var alerta = document.createElement('div');
        
        alerta.innerHTML = `<div class="alert alert-danger" role="alert"> Erro ao cadastrar! </div>`;
        
        modal.appendChild(alerta);

        $('#alertStatus').modal('show');
        setTimeout(function(){ $('#alertStatus').modal('hide'); alerta.innerHTML = ''}, 1500);
    })
}

async function editProdutos(id) {
    $('#EditProdutos').modal('show');

    await axios({
        method: 'GET',
        url: `https://intellistock-api.herokuapp.com/products/${id}`
    }).then(response => {

        console.log(response);

        $('#id_produto').val(id);

        var div_cate = document.getElementById('div-categoriesEdit')
        
        var aux_cat = 0;
        var select_cat = document.createElement('select');
        select_cat.setAttribute('name', 'editcategoriaId')
        select_cat.setAttribute('id', 'editcategoriaId')
        select_cat.setAttribute('class', 'form-control')
        select_cat.setAttribute('style', 'display:none')

        select_cat.innerText = "";

        var label = document.createElement('label')
        label.innerHTML = 'Categorias: '
        div_cate.appendChild(label)

        axios({
            url: `https://intellistock-api.herokuapp.com/categories`,
            method: 'GET'
        })
        .then(resp => {
            resp.data.forEach(function(value) {

                console.log(value);

                if(aux_cat == 0) {
                    aux_cat++;
                }

                var categorias = document.createElement("option");
                categorias.setAttribute("value", value.id);
                var categorias_nome = document.createTextNode(value.name);
                categorias.appendChild(categorias_nome);
                
                if(response.data.category_id == value.id){
                    categorias.setAttribute("selected", "selected");
                }

                select_cat.appendChild(categorias);
            })

            div_cate.appendChild(select_cat)
        }).then(resp => {
            $(function(){  
                $('#editcategoriaId').multiselect({
                    buttonWidth: '100%',
                    enableCaseInsensitiveFiltering: true,
                    filterPlaceholder: 'Procurar...',
                    buttonText: function(options) {
                        if (options.length === 0) {
                            return 'Nada Selecionado';
                        }
                        else {
                            var labels = [];
                            options.each(function() {
                                if ($(this).attr('label') !== undefined) {
                                    labels.push($(this).attr('label'));
                                }
                                else {
                                    labels.push($(this).html());
                                }
                            });
                            return labels.join(', ') + '';
                        }
                    }
                });
            });
            $('#EditProdutos').on('hide.bs.modal', function (event) {
                const div = document.querySelector("#div-categoriesEdit");
                div.innerHTML = "";
            })
        })

        // console.log(response.data.linha_de_pesquisa);

        $('#edittitulo').val(response.data.name);
        $('#editquantidade').val(response.data.amount);
    })
}

async function editarProdutos(){       
    
    var id_categoria = $('#editcategoriaId').val()
    var name = $('#edittitulo').val()
    var amount = $('#editquantidade').val()
    var id_produto = $('#id_produto').val()    

    await axios({
        method: 'PUT',
        url: `https://intellistock-api.herokuapp.com/products/${id_produto}/category/${id_categoria}`,
        data: {
            name,
            amount
        }

    }).then(response => {

        $('#EditProdutos').modal('hide');
        var modal = document.getElementById('bodyModal');
        var alerta = document.createElement('div');
        
        alerta.innerHTML = `<div class="alert alert-success" role="alert"> Sucesso ao editar! </div>`;
        
        modal.appendChild(alerta);

        $('#alertStatus').modal('show');
        setTimeout(function(){ $('#alertStatus').modal('hide'); window.location.reload(true); alerta.innerHTML = ''}, 1500);
    }).catch(error => {
        console.log(error);
        $('#EditProdutos').modal('hide');
        var modal = document.getElementById('bodyModal');
        var alerta = document.createElement('div');
        
        alerta.innerHTML = `<div class="alert alert-danger" role="alert"> Erro ao cadastrar! </div>`;
        
        modal.appendChild(alerta);

        $('#alertStatus').modal('show');
        setTimeout(function(){ $('#alertStatus').modal('hide'); alerta.innerHTML = ''}, 1500);
    })
}

function del(id){
    $('#del').modal('show');
    $('#idDel').val(id);
}

async function deletar(){
    var id = $('#idDel').val()

    await axios({
        method: 'DELETE',
        url: `https://intellistock-api.herokuapp.com/products/${id}`
    }).then(response => {
        $('#del').modal('hide');
        var modal = document.getElementById('bodyModal');
        var alerta = document.createElement('div');
        
        alerta.innerHTML = `<div class="alert alert-success" role="alert"> Sucesso ao excluir! </div>`;
        
        modal.appendChild(alerta);

        $('#alertStatus').modal('show');
        setTimeout(function(){ $('#alertStatus').modal('hide'); window.location.reload(true); alerta.innerHTML = ''}, 1500);

    }).catch(error => {
        console.log(error);
        $('#del').modal('hide');
        var modal = document.getElementById('bodyModal');
        var alerta = document.createElement('div');
        
        alerta.innerHTML = `<div class="alert alert-danger" role="alert"> Erro ao excluir! </div>`;
        
        modal.appendChild(alerta);

        $('#alertStatus').modal('show');
        setTimeout(function(){ $('#alertStatus').modal('hide'); alerta.innerHTML = ''}, 1500);
    })
}

async function logout() {
    const cache = await caches.open('my-cache');
    
    await cache.delete('/user');

    window.location.href = "../index.html";
}