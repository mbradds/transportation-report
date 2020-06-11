document.addEventListener('DOMContentLoaded', () => {
    const options = {
        chart:{
            type: 'column',
            zoomType: 'xy'
        },
        title: {
            text: 'Our First Chart'
        },
        yAxis: {
            title: {
                text: 'Fruits Eaten'
            }
        }
    };
//    $.get('test.csv', csv => {
//        options.data = {
//            csv
//        };
//        Highcharts.chart('container', options);
//    });
    console.log(window.location.origin + '/test.csv')
    fetch('https://github.com/mbradds/HighchartsData/blob/master/oil_price.csv').then(res => {
        return res.text(); //res.json()
    }).then(csv => {
        options.data = {
            csv
        };
        Highcharts.chart('container',options);
    });
});
