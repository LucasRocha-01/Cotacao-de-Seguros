$(document).ready(function () {
  localStorage.removeItem("priceFiltered");

  $("#codigoDoPlano").on("change", function () {
    console.log("teste");
    var valCod = $("#codigoDoPlano").val();
    // $("select").val(valCod);
    prices(valCod);
  });

  function getData(ajaxurl) {
    return $.ajax({
      url: ajaxurl,
      type: "GET",
    });
  }

  async function planos() {
    try {
      const res = await getData("http://localhost:21262/planos");
      displayPlanos(res);
    } catch (err) {
      console.log(err);
    }
  }
  planos();

  async function prices(cod) {
    try {
      const res = await getData("http://localhost:21262/prices");
      displayPrices(res, cod);
    } catch (err) {
      console.log(err);
    }
  }

  const planex = document.getElementById("planex");
  const detalhesPlano = document.getElementById("detalhesPlano");

  const displayPlanos = (planos) => {
    const planosHTMLString = planos
      .map(
        (plano_single) => `
                <div class="swiper-slide" value="${plano_single.codigo}" data-registro="${plano_single.registro}">
                    <div class="container">
                        <h4 class="titlePlano">
                            ${plano_single.nome}
                        </h4>
                        <p class="titleDiferenciais">Diferenciais</p>
                        <ul>
                            <li>Diferencial</li>
                            <li>Diferencial</li>
                            <li>Diferencial</li>
                        </ul>
                    </div>
                </div>
            `
      )
      .join("");
    // planex.innerHTML = planosHTMLString;
    $("#planex").append(planosHTMLString);
    $("#planes").append(planosHTMLString);
  };

  const displayPrices = (prices, cod) => {
    const pricesHTMLstring = prices
      .filter((prices) => prices.codigo == cod)
      .map(
        (price) =>
          `
            <div>
                <p>Mínimo de vidas: ${price.minimo_vidas}</p>
                <ul id="listaPrices">
                    <li><span>Até 17 anos: </span><span>R$ ${price.faixa1.toFixed(
                      2
                    )}</span></li>
                    <li><span>Até 40 anos: </span><span>R$ ${price.faixa2.toFixed(
                      2
                    )}</span></li>
                    <li><span>Acima 40 anos: </span><span>R$ ${price.faixa3.toFixed(
                      2
                    )}</span></li>
                </ul>
            </div>
        `
      )
      .join("");

    const priceFiltered = prices
      .sort(function (a, b) {
        return a.minimo_vidas - b.minimo_vidas;
      })
      .filter((price) => price.codigo == cod);

    localStorage.removeItem("priceFiltered");
    localStorage.setItem("priceFiltered", JSON.stringify(priceFiltered));

    verificaValorDoPlano();
    detalhesPlano.innerHTML = pricesHTMLstring;
  };
});
