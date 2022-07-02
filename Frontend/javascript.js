var idContador = 0;
var qtdBeneficiarios = 0;

function exclui(id) {
  let campo = $("#" + id.id);
  campo.remove();
  qtdBeneficiarios--;

  $("input[name=qtdBeneficiarios]").val(qtdBeneficiarios);
  verificaValorDoPlano();

  verificaIds(qtdBeneficiarios);
}

function verificaIds(qtdBeneficiarios) {
  let beneficiarios = document.getElementById("beneficiarios");
  console.log(beneficiarios);

  for (i = 1; i < qtdBeneficiarios; i++) {
    let idIdade = "idade" + i;
    let idValor = "valor" + i;
    inserirValorPlano(idIdade, idValor);
  }
}

function inserirValorPlano(idIdade, idValor) {
  let planoFinal = JSON.parse(localStorage.getItem("priceFinal"));
  console.log(idIdade);

  let LidIdade = idIdade.id ? idIdade.id : idIdade;
  let LidValor = idValor.id ? idValor.id : idValor;

  let a = $("#" + LidIdade).val();
  let valor = 0;

  if (a <= 17) {
    valor = planoFinal.faixa1;
  } else if (a <= 40) {
    valor = planoFinal.faixa2;
  } else if (a > 40) {
    valor = planoFinal.faixa3;
  }

  $("#" + LidValor).val(valor);
}

$("select").on("change", function () {
  let valCod = $("select").val();
  let valReg = $("option").attr("data-registro");

  $("#codigo").text("");
  $("#codigo").append(valCod);

  $("#codigoDoPlano").val(valCod);
  $("input[name=registroPlano]").val(valReg);

  $("#beneficiarios li").remove();
  $("input[name=qtdBeneficiarios]").val(0);
  qtdBeneficiarios = 0;
});

$("#send").click(function (event) {
  //EVITAR QUE O FORMULÁRIO SEJA SUBMETIDO ANTES DO ENVIO PARA A API
  event.preventDefault();

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
    },
  });
});

$(document).ready(function () {
  function adicionaCampo() {
    let planoPorVidasMinimas = JSON.parse(
      localStorage.getItem("priceFiltered")
    );

    if (planoPorVidasMinimas != null) {
      idContador++;
      verificaIds(qtdBeneficiarios);

      qtdBeneficiarios++;

      let idName = "nome" + idContador;
      let idIdade = "idade" + idContador;
      let idValor = "valor" + idContador;

      let idInput = "formExtra" + idContador;

      let html = `<li id='${idInput}' >
      <div style='margin-top: 8px;' class='input-group' >
      <label>Nome: </label><input type='text' id='${idName}' name='${idName}' class='form-control novoCampo campoNome' placeholder='Insira um'required/>
      <label>Idade: </label><input onchange='inserirValorPlano(${idIdade},${idValor})' type='number' id='${idIdade}'name='${idIdade}' class='form-control novoCampo campoIdade' placeholder='Insira um'required/>
      <label>Valor: </label><input type='number' id='${idValor}' name='${idValor}' class='form-control novoCampo' placeholder='Preencha todos os campos'disabled />
      <span class='input-group-btn'>
      <button class='btn' onclick='exclui(${idInput})' type='button'>Excluir<span class='fa fa-trash'></span></button>
      </span></div></li>`;

      $("#beneficiarios").append(html);
      $("input[name=qtdBeneficiarios]").val(qtdBeneficiarios);
    } else {
      alert("Selecione o Plano");
    }
  }

  $("#addBenef").click(function () {
    adicionaCampo();
    verificaValorDoPlano();
  });
});

function verificaValorDoPlano() {
  let planoPorVidasMinimas = JSON.parse(localStorage.getItem("priceFiltered"));

  let qtdBeneficiarios = $("input[name=qtdBeneficiarios]").val();

  let valorDoPlano = "";

  planoPorVidasMinimas.map((item) => {
    if (qtdBeneficiarios >= item.minimo_vidas) {
      localStorage.setItem("priceFinal", JSON.stringify(item));
    }
  });

  //   if (planoPorVidasMinimas.length === 0) {
  //     console.log("plano sem minimo de vidas");
  //   } else if (planoPorVidasMinimas.length === 1) {
  //     valorDoPlano = planoPorVidasMinimas;
  //     localStorage.setItem("priceFinal", JSON.stringify(valorDoPlano));
  //     console.log("só tem um");
  //   } else {
  //     console.log(planoPorVidasMinimas);
  //   }
}
