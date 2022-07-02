$(document).ready(function () {
    localStorage.removeItem('priceFiltered');

    $('select').on('change', function () {
        var valCod = $('select').val()
        prices(valCod);
    })

    function getData(ajaxurl) {
        return $.ajax({
            url: ajaxurl,
            type: 'GET',
        });
    };

    async function planos() {
        try {
            const res = await getData('http://localhost:21262/planos')
            displayPlanos(res)
        } catch (err) {
            console.log(err);
        }
    }
    planos();

    async function prices(cod) {
        try {
            const res = await getData('http://localhost:21262/prices')
            displayPrices(res, cod)
        } catch (err) {
            console.log(err);
        }
    }



    const planex = document.getElementById('planex');
    const detalhesPlano = document.getElementById('detalhesPlano');

    const displayPlanos = (planos) => {
        const planosHTMLString = planos
            .map(
                (plano_single) => `
                <option value="${plano_single.codigo}" data-registro="${plano_single.registro}">${plano_single.nome}</option>
                `
            )
            .join('');
        // planex.innerHTML = planosHTMLString;
        $('#planex').append(planosHTMLString)
    };


    const displayPrices = (prices, cod) => {
        const pricesHTMLstring = prices.filter(prices => prices.codigo == cod)
            .map(
                (price) =>
                    `
                    <div>
                        ${price.codigo}
                        <p>Mínimo de vidas: ${price.minimo_vidas}</p>
                        <ul id="listaPrices">
                            <li><span>0 a 17 anos: </span><span>${price.faixa1}</span></li>
                            <li><span>18 a 40 anos: </span><span>${price.faixa2}</span></li>
                            <li><span>+40 anos: </span><span>${price.faixa3}</span></li>
                        </ul>
                    </div>
                `
            )
            .join('');

        const priceFiltered = prices
            .sort(function (a, b) { return a.minimo_vidas - b.minimo_vidas })
            .filter(price => price.codigo == cod)

        localStorage.removeItem('priceFiltered');
        localStorage.setItem('priceFiltered', JSON.stringify(priceFiltered))

        detalhesPlano.innerHTML = pricesHTMLstring;
    }

})