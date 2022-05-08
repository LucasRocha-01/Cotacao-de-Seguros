$(document).ready(function () {

    function getData(ajaxurl) {
        return $.ajax({
            url: ajaxurl,
            type: 'GET',
        });
    };

    async function test() {
        try {
            const res = await getData('http://localhost:21262/planos')

            displayPlanos(res)

        } catch (err) {
            console.log(err);
        }
    }

    test();


    const planex = document.getElementById('planex');

    const displayPlanos = (planos) => {
        const planosHTMLString = planos
            .map(
                (plano_single) => `
                <option value="${plano_single.codigo}" data-registro="${plano_single.registro}">${plano_single.nome}</option>
                `
            )
            .join('');
        planex.innerHTML = planosHTMLString;
    };

})