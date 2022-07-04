var idContador = 0;
var qtdBeneficiarios = 0;

var swiper = new Swiper(".mySwiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "4",
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    // when window width is >= 640px
    1200: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
  },

  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  },
  pagination: {
    el: ".swiper-pagination",
  },
  on: {
    slideChange: function () {
      selecionaPlano(swiper.activeIndex);
    },
  },
});

function adicionaCampo() {
  let planoPorVidasMinimas = JSON.parse(localStorage.getItem("priceFiltered"));

  if (planoPorVidasMinimas != null) {
    qtdBeneficiarios++;
    let html = `
    <li class="liGroup" >
    <div style='margin-top: 8px;' class='input-group' >
    <label class="labelNome">Nome: <input type='text' name='Name' class='campoNome form-control required' placeholder='Digite o Nome' required/></label>
    <label>Idade: <input type='number'name='Idade' class='campoIdade form-control required' onChange="verificaValorDoPlano()" placeholder='Digite a Idade' required/></label>
    <label>Valor: <input type='number' name='Valor' class='campoValor form-control' placeholder='Preencha todos os campos' readonly /></label>
    </div>
    <button class='btn btn-danger btn-Excluir' type="button" onClick="exlcuirLi(event.target)" >Excluir<span class='fa fa-trash'></span></button>
    </li>
    `;

    $("#beneficiarios").append(html);
    $("input[name=qtdBeneficiarios]").val(qtdBeneficiarios);

    verificaValorDoPlano();

    verificaIds(qtdBeneficiarios);
  } else {
    alert("Selecione o Plano");
  }
}

function selecionaPlano(id) {
  let element = $(".swiper-wrapper").find(".swiper-slide").eq(id);
  let valCod = element.attr("value");
  let valReg = element.attr("data-registro");

  $("#codigoDoPlano").val(valCod).change();

  $("input[name=registroPlano]").val(valReg);

  verificaValorDoPlano();
}
function verificaValorDoPlano() {
  let planoPorVidasMinimas = JSON.parse(localStorage.getItem("priceFiltered"));

  let qtdBeneficiarios = $("input[name=qtdBeneficiarios]").val();
  exibeTotal(qtdBeneficiarios);

  planoPorVidasMinimas.map((item) => {
    if (qtdBeneficiarios >= item.minimo_vidas) {
      localStorage.setItem("priceFinal", JSON.stringify(item));

      let planoFinal = item;
      $("#beneficiarios li").map((index) => {
        let idadeBene = $("#beneficiarios")
          .find("li")
          .eq(index)
          .find(".campoIdade")
          .val();

        let valor = 0;
        if (idadeBene <= 17) {
          valor = planoFinal.faixa1;
        } else if (idadeBene <= 40) {
          valor = planoFinal.faixa2;
        } else if (idadeBene > 40) {
          valor = planoFinal.faixa3;
        }

        $("#beneficiarios").find("li").eq(index).find(".campoValor").val(valor);

        let valorTotal = 0;
        $.each($(".campoValor "), function (index, value) {
          console.log($(value).val());

          valorTotal = valorTotal + Number($(value).val());

          $("#totalPanos").val("R$ " + valorTotal.toFixed(2));
        });
      });
    }
  });
}

function exibeTotal(qtd) {
  if (Number(qtd) == 0) {
    $("div.totalPanos").css("display", "none");
    $("#send").css("display", "none");
  } else {
    $("div.totalPanos").css("display", "flex");
    $("#send").css("display", "flex");
  }
}

function verificaIds() {
  $("#beneficiarios li").map((index) => {
    $("#beneficiarios")
      .find("li")
      .eq(index)
      .attr("id", "liGroup-" + index);

    $("#beneficiarios").find("button").eq(index).attr("id", index);
    $("#beneficiarios")
      .find(".campoNome")
      .eq(index)
      .attr("name", "nome" + index);
    $("#beneficiarios")
      .find(".campoIdade")
      .eq(index)
      .attr("name", "idade" + index);
    $("#beneficiarios")
      .find(".campoValor")
      .eq(index)
      .attr("name", "valor" + index);
  });
}

$(window).keydown(function (event) {
  if (event.keyCode == 13) {
    event.preventDefault();
    return false;
  }
});

function exlcuirLi(elemento) {
  $("#liGroup-" + elemento.id).remove();

  qtdBeneficiarios--;
  $("input[name=qtdBeneficiarios]").val(qtdBeneficiarios);

  verificaValorDoPlano();
  verificaIds(qtdBeneficiarios);
}

$(document).ready(function () {
  $("#codigoDoPlano").val(1).change();

  $("#addBenef").click(function () {
    adicionaCampo();
  });

  // $("#myForm input.required").change(function () {
  $("#send").on("click", function () {
    var valid = true;
    $.each($("#formulario input.required"), function (index, value) {
      if (!$(value).val()) {
        valid = false;
      }
    });
    if (valid) {
      alert("Proposta Enviada");

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
        },
      });
    } else {
    }
  });

  // $("#send").click(function (event) {
  //   //EVITAR QUE O FORMULÁRIO SEJA SUBMETIDO ANTES DO ENVIO PARA A API
  //   event.preventDefault();

  //   // ENVIA PARA A API
  //   $.ajax({
  //     //METODO DE ENVIO
  //     type: "POST",
  //     //URL PARA QUAL OS DADOS SERÃO ENVIADOS
  //     url: "http://localhost:21262/add",
  //     //DADOS QUE SERÃO ENVIADOS
  //     data: $("#formulario").serialize(),
  //     //TIPOS DE DADOS QUE O AJAX TRATA
  //     dataType: "json",
  //     //CASO DÊ TUDO CERTO NO ENVIO PARA A API
  //     success: function () {
  //       //SUBMETE O FORMULÁRIO PARA A ACTION DEFINIDA NO CABEÇALHO
  //       $("#formulario").submit();
  //     },
  //   });
  // });
});
