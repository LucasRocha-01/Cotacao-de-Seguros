function exclui(id) {
    var campo = $("#" + id.id);
    campo.hide(200);
}

var idContador = 0;






$(".btnExcluir").click(function () {
    console.log("clicou");
    $(this).slideUp(200);
})

$(document).ready(function () {

    function adicionaCampo() {

        idContador++;

        var idName = "nome" + idContador;
        var idIdade = "idade" + idContador;
        var idValor = "valor" + idContador;

        var idForm = "formExtra" + idContador;

        var html = "";

        html += "<li id='" + idForm + "' >";
        html += "<div style='margin-top: 8px;' class='input-group' >";
        html += "<label>Nome: </label><input type='text' id='" + idName + "' name='" + idName + "' class='form-control novoCampo campoNome' placeholder='Insira um " + "'/>";
        html += "<label>Idade: </label><input type='number' id='" + idIdade + "'name='" + idIdade + "' class='form-control novoCampo campoIdade' placeholder='Insira um " + "'/>";
        html += "<label>Valor: </label><input type='number' id='" + idValor + "' name='" + idValor + "' class='form-control novoCampo' placeholder='Preencha todos os campos " + "'disabled />";
        html += "<span class='input-group-btn'>";
        html += "<button class='btn' onclick='exclui(" + idForm + ")' type='button'>Excluir<span class='fa fa-trash'></span></button>";
        html += "</span>";
        html += "</div>";
        html += "</li>"

        $("#beneficiarios").append(html);

    }

    adicionaCampo()

    $('select').on('change', function () {
        var valCod = $('select').val()
        var valReg = $('option').attr('data-registro')

        console.log(valReg);

        $('#codigo').text('')
        $('#codigo').append(valCod)

        $('#codigoDoPlano').val(valCod)
        $('input[name=registroPlano]').val(valReg)

        // console.log(val);
    })


    $('#addBenef').click(function () {
        adicionaCampo()
    })

    $("#send").click(function (event) {

        //EVITAR QUE O FORMULÁRIO SEJA SUBMETIDO ANTES DO ENVIO PARA A API
        event.preventDefault();

        var teste = $("#formulario").serialize();
        console.log(teste);

        // ENVIA PARA A API
        $.ajax({
            //METODO DE ENVIO
            type: "POST",
            //URL PARA QUAL OS DADOS SERÃO ENVIADOS
            url: "http://localhost:21262/add",
            //DADOS QUE SERÃO ENVIADOS
            data: $("#formulario").serialize(),
            //TIPOS DE DADOS QUE O AJAX TRATA
            dataType: "json",
            //CASO DÊ TUDO CERTO NO ENVIO PARA A API
            success: function () {
                //SUBMETE O FORMULÁRIO PARA A ACTION DEFINIDA NO CABEÇALHO
                $("#formulario").submit();
                console.log(data);
            }
        });
    })

})