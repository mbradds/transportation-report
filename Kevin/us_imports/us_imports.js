const prepareSeriesImports = (data) => {

    const colors = ['#054169', '#FFBE4B', '#5FBEE6', '#559B37', '#FF821E', '#871455', '#8c8c96', '#42464B']
    seriesData = []
    const attributes = getUnique(data,'Attribute')
    
    attributes.map((v,iattr) => {
        hcData = []
        const attr = data.filter(row => row.Attribute == v)
        attr.map((r,i) => {
            hcRow = {
                x: r.Year,
                y: r.Value
            }
            hcData.push(hcRow)
        })


        var chartType = ''
        if (v=='U.S crude oil exports') {
            chartType = 'line'
        } else {
            chartType = 'column'
        }

        seriesData.push({
            name: v,
            type: chartType,
            data: hcData,
            color: colors[iattr]
        })

    })

    return seriesData

}


const crudeImportsData = JSON.parse(JSON.stringify(JSON.parse(getData('Kevin/us_imports/UScrudeoilimports.json'))));
var seriesData = prepareSeriesImports(crudeImportsData)
const createCrudeImportsChart = (seriesData) => {


var chart = new Highcharts.chart('container_crude_imports', {

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
        title: { text: 'Million bbl/day' },
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

chart = createCrudeImportsChart(seriesData)








