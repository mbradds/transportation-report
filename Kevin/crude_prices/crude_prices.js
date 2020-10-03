const crudePriceChartTypes = (series) => {
    series.map((data,seriesNum) => {
        if (data.name == 'Differential'){
            data.type = 'area'
        } else {
            data.type = 'line'
        }
    })

    return series
}

const crudePriceData = JSON.parse(JSON.stringify(JSON.parse(getData('Kevin/crude_prices/oil_prices.json'))));
const crudePriceColors = {'WCS':cerPalette['Night Sky'],
'WTI':cerPalette['Sun'],
'Differential':cerPalette['Ocean']}

var seriesData = crudePriceChartTypes(prepareSeriesNonTidy(crudePriceData,filters=false,valueVars=['WCS','WTI','Differential'],xCol='Date',colors=crudePriceColors))


const createCrudePriceChart = (seriesData) => {

var chart = new Highcharts.chart('container_crude_prices', {

    chart: {
        zoomType: 'x', //allows the user to focus in on the x or y (x,y,xy)
        borderColor: 'black',
        borderWidth: 1,
        animation: true,
        events: {
            load: function () {
                this.credits.element.onclick = function () {
                    window.open(
                        'https://www.cer-rec.gc.ca/index-eng.html',
                        '_blank' // <- This is what makes it open in a new window.
                    );
                }
            }
        }
    },

    title: {
        text: null
    },

    credits: {
        //enabled:false //gets rid of the "Highcharts logo in the bottom right"
        text: 'Canada Energy Regulator',
        href: 'https://www.cer-rec.gc.ca/index-eng.html'
    },

    plotOptions: {
        area: {
            stacking: 'normal',
            marker: false,
            dataLabels: {
                enabled: false
            }
        }
    },

    tooltip: {
        animation: true,
        shared: true,
    },

    // title: { text: 'Canada Propane Exports' },

    xAxis: {
        type: 'datetime'
    },

    yAxis: {
        title: { text: 'USD/bbl' },
        stackLabels: {
            enabled: false
        }
    },

    lang: {
        noData: "No Exports"
    },

    noData: {
        style: {
            fontWeight: 'bold',
            fontSize: '15px',
            color: '#303030'
        }
    },
    series: seriesData
});

return chart
}

chart = createCrudePriceChart(seriesData)








