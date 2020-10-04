import {cerPalette,getData,fillDrop,prepareSeriesNonTidyUnits} from '../../modules/util.js'

const crudeProdColors = {'Conventional Light':cerPalette['Sun'],
'Conventional Heavy':cerPalette['Night Sky'],
'C5+':cerPalette['Ocean'],
'Field Condensate':cerPalette['Forest'],
'Mined Bitumen':cerPalette['Cool Grey'],
'In Situ Bitumen':cerPalette['Dim Grey']}

var crudeProdFilters = {'Region':'Canada'}
var units = '1000 bbl/day'
const crudeProdColumns=['Conventional Light','Conventional Heavy','C5+','Field Condensate','Mined Bitumen','In Situ Bitumen']
const crudeProdData = JSON.parse(getData('Kevin/crude_production/Crude_Oil_Production.json'));
fillDrop('Region','select_region_crude_prod','Canada',crudeProdData)


var seriesData = prepareSeriesNonTidyUnits(crudeProdData,
    crudeProdFilters,
    units,
    units,
    6.2898,
    '/',
    crudeProdColumns,
    'Year',
    crudeProdColors)

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
                        'https://www.cer-rec.gc.ca/en/data-analysis/canada-energy-future/index.html',
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
        text: 'Source: Energy Futures'
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


    yAxis: {
        title: { text: '1000 bbl/day' },
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

var chartCrude = createCrudeProdChart(seriesData) //do I need to have each chart variable with a different name?

//recreate the chart when the region changes
var selectRegionCrudeProd = document.getElementById('select_region_crude_prod');
selectRegionCrudeProd.addEventListener('change', (selectRegionCrudeProd) => {
    var region = selectRegionCrudeProd.target.value;
    crudeProdFilters['Region'] = region
    var seriesData = prepareSeriesNonTidyUnits(crudeProdData,
        crudeProdFilters,
        units,
        '1000 bbl/day',
        6.2898,
        '/',
        crudeProdColumns,
        'Year',
        crudeProdColors)
    chartCrude = createCrudeProdChart(seriesData)
});

//update existing chart when the units change
var selectUnitsCrudeProd = document.getElementById('select_units_crude_prod');
selectUnitsCrudeProd.addEventListener('change', (selectUnitsCrudeProd) => {
    var units = selectUnitsCrudeProd.target.value;
    var seriesData = prepareSeriesNonTidyUnits(crudeProdData,
        crudeProdFilters,
        units,
        '1000 bbl/day',
        6.2898,
        '/',
        crudeProdColumns,
        'Year',
        crudeProdColors)
    
    chartCrude.update({
        series:seriesData,
        yAxis: {
            title: {text:units}
        }
    })
});








