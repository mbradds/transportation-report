const prepareSeriesProd = (data,region) => {

    const colors = ['#054169', '#FFBE4B', '#5FBEE6', '#559B37', '#FF821E', '#871455', '#8c8c96', '#42464B']
    seriesData = []
    data = data.filter(row => row.Region == region)
    const products = getUnique(data,'Product')
    
    products.map((v,iProducts) => {
        hcData = []
        const product = data.filter(row => row.Product == v)
        product.map((r,i) => {
            hcRow = {
                x: r.Year,
                y: r.Value
            }
            hcData.push(hcRow)
        })

        seriesData.push({
            name: v,
            data: hcData,
            color: colors[iProducts]
        })

    })

    return seriesData

}


const crudeProdData = JSON.parse(JSON.stringify(JSON.parse(getData('Kevin/crude_production/Crude_Oil_Production.json'))));
fillDrop('Region','select_region','Canada',crudeProdData)
var seriesData = prepareSeriesProd(crudeProdData,'Canada')

const createCrudeProdChart = (seriesData) => {


var chart = new Highcharts.chart('container_crude_production', {

    chart: {
        type: 'column', //line,bar,scatter,area,areaspline
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
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: false
            }
        }
    },

    tooltip: {
        animation: true,
        //shared: true,
    },

    // title: { text: 'Canada Propane Exports' },

    // xAxis: {
    // },

    yAxis: {
        title: { text: 'Thousand bbl/day' },
        stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
            }
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

chart = createCrudeProdChart(seriesData)

var select_region = document.getElementById('select_region');
select_region.addEventListener('change', (select_region) => {
    var region = select_region.target.value;
    var seriesData = prepareSeriesProd(crudeProdData,region)
    chart = createCrudeProdChart(seriesData)
});








