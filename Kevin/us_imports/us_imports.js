import {cerPalette,getData,prepareSeriesTidy} from '../../modules/util.js'

const crudeImportsChartTypes = (series) => {

    series.map((data,seriesNum) => {
        if (data.name == 'U.S crude oil exports'){
            data.type = 'line'
            data.zIndex = 1
        } else {
            data.type = 'column'
            data.zIndex = 0
        }
    })

    return series

}

const crudeImportColors = {'ROW imports':cerPalette['Night Sky'],
'U.S crude oil exports':cerPalette['Ocean'],
'Canadian imports':cerPalette['Sun']}

const crudeImportsData = JSON.parse(getData('Kevin/us_imports/UScrudeoilimports.json'));
var crudeImportsFilters = {'Units':'MMb/d'}
var seriesData = crudeImportsChartTypes(prepareSeriesTidy(crudeImportsData,crudeImportsFilters,'Attribute','Year','Value',crudeImportColors))
const createCrudeImportsChart = (seriesData) => {


var chartCrudeImports = new Highcharts.chart('container_crude_imports', {

    chart: {
        zoomType: 'x', //allows the user to focus in on the x or y (x,y,xy)
        borderColor: 'black',
        borderWidth: 1,
        animation: true,
        events: {
            load: function () {
                this.credits.element.onclick = function () {
                    window.open(
                        'https://apps.cer-rec.gc.ca/CommodityStatistics/Statistics.aspx?language=english',
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
        text: 'Source: CER Commodity Tracking System & EIA'
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
        shared: true,
    },

    yAxis: {
        title: {text: 'MMb/d'},
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

return chartCrudeImports
}

var chartCrudeImports = createCrudeImportsChart(seriesData)

var selectUnitsCrudeImports = document.getElementById('select_units_crude_imports');
selectUnitsCrudeImports.addEventListener('change', (selectUnitsCrudeImports) => {
    var units = selectUnitsCrudeImports.target.value;
    crudeImportsFilters['Units'] = units
    var seriesData = crudeImportsChartTypes(prepareSeriesTidy(crudeImportsData,crudeImportsFilters,'Attribute','Year','Value',crudeImportColors))
    chartCrudeImports.update({
        series:seriesData,
        yAxis: {
            title:{text:units}
        }
    })
});








