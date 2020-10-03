const gasTrafficChartTypes = (series) => {
    series.map((data,seriesNum) => {
        if (data.name == 'Capacity') {
            data.type = 'line'
        } else {
            data.type = 'area'
        }
    })

    return series
}

const gasColors = {
    'Alliance Pipeline Limited Partnership - Alliance Pipeline - Border':cerPalette['Night Sky'],
    'Foothills Pipe Lines Ltd. (Foothills) - Foothills System - Kingsgate':cerPalette['Sun'],
    'Foothills Pipe Lines Ltd. (Foothills) - Foothills System - Monchy':cerPalette['Flame'],
    'TransCanada PipeLines Limited - Canadian Mainline - Northern Ontario Line':cerPalette['Forest'],
    'Capacity':cerPalette['Cool Grey']
}
const gasData = JSON.parse(JSON.stringify(JSON.parse(getData('Sara/gas_traffic/gas_traffic.json'))));

var seriesData = gasTrafficChartTypes(prepareSeriesNonTidyUnits(gasData,
    filters=false,
    unitsCurrent='BCf/d',
    baseUnits='1000 m3/d',
    conversion=0.0000353,
    convType='*',
    valueVars=['Alliance Pipeline Limited Partnership - Alliance Pipeline - Border',
    'Foothills Pipe Lines Ltd. (Foothills) - Foothills System - Kingsgate',
    'Foothills Pipe Lines Ltd. (Foothills) - Foothills System - Monchy',
    'TransCanada PipeLines Limited - Canadian Mainline - Northern Ontario Line',
    'Capacity'],
    xCol='Date',
    colors=gasColors))


const createChartGasTraffic = (seriesData) => {


    var chart = new Highcharts.chart('container_gas_traffic', {
    
        chart: {
            zoomType: 'x', //allows the user to focus in on the x or y (x,y,xy)
            borderColor: 'black',
            borderWidth: 1,
            animation: true,
            events: {
                load: function () {
                    this.credits.element.onclick = function () {
                        window.open(
                            'https://open.canada.ca/data/en/dataset/dc343c43-a592-4a27-8ee7-c77df56afb34',
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
            text: 'Source: Open Government Throughput and Capacity Data'
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
            title: {text: 'Bcf/d'},
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
    
var chartGasTraffic = createChartGasTraffic(seriesData)

var selectUnitsGasTraffic = document.getElementById('select_units_gas_traffic');
selectUnitsGasTraffic.addEventListener('change', (selectUnitsGasTraffic) => {
    var units = selectUnitsGasTraffic.target.value;
    var seriesData = gasTrafficChartTypes(prepareSeriesNonTidyUnits(gasData,
        filters=false,
        unitsCurrent=units,
        baseUnits='1000 m3/d',
        conversion=0.0000353,
        convType='*',
        valueVars=['Alliance Pipeline Limited Partnership - Alliance Pipeline - Border',
        'Foothills Pipe Lines Ltd. (Foothills) - Foothills System - Kingsgate',
        'Foothills Pipe Lines Ltd. (Foothills) - Foothills System - Monchy',
        'TransCanada PipeLines Limited - Canadian Mainline - Northern Ontario Line',
        'Capacity'],
        xCol='Date',
        colors=gasColors))

    chartGasTraffic.update({
        series:seriesData,
        yAxis: {
            title:{text:units}
        }
    })
});