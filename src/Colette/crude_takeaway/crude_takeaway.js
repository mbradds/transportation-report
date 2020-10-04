import {cerPalette,getData,prepareSeriesNonTidyUnits} from '../../modules/util.js'

const crudeTakeawayChartTypes = (series) => {
    series.map((data,seriesNum)=>{
        if (data.name == 'Total Supply Available for Export'){
            data.type = 'line'
            data.zIndex = 1
        } else {
            data.type = 'area'
            data.zIndex = 0
        }
    })

    return series
}


const crudeTakeawayData = JSON.parse(getData('/src/Colette/crude_takeaway/fgrs-eng.json'));
const crudeTakeawayColors = {
    'Total Supply Available for Export': cerPalette['Cool Grey'],
    'Express':cerPalette['Dim Grey'],
    'Milk River':cerPalette['Dim Grey'],
    'Aurora/Rangeland':cerPalette['Dim Grey'],
    'TransMountain':cerPalette['Night Sky'],
    'Enbridge Mainline':cerPalette['Sun'],
    'Keystone':cerPalette['Forest'],
    'Enbridge Line 3':cerPalette['Night Sky'],
    'TMX':cerPalette['Night Sky'],
    'Keystone XL':cerPalette['Forest'],
    'Structural Rail':cerPalette['Flame'],
    'Variable Rail':cerPalette['Ocean']
}

const seriesData = crudeTakeawayChartTypes(prepareSeriesNonTidyUnits(
    crudeTakeawayData,
    false,
    'MMb/d',
    'MMb/d',
    0.0062898,
    '/',
    ['Total Supply Available for Export','Express','Milk River','Aurora/Rangeland','TransMountain','Enbridge Mainline','Keystone','Enbridge Line 3','TMX','Keystone XL','Structural Rail','Variable Rail'],
    'Year',
    crudeTakeawayColors
    ))

const createChartCrudeTakeaway = (seriesData) => {

    var chart = new Highcharts.chart('container_crude_takeaway', {

        chart: {
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
            //enabled:false //gets rid of the "Highcharts logo in the bottom right"
            text: 'Source: Energy Futures'
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
            //shared: true,
        },

        yAxis: {
            title: {text: 'MMb/d'},
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

const crudeTakeawayChart = createChartCrudeTakeaway(seriesData)

var selectUnitsCrudeTakeaway = document.getElementById('select_units_crude_takeaway');
selectUnitsCrudeTakeaway.addEventListener('change', (selectUnitsCrudeTakeaway) => {
    var units = selectUnitsCrudeTakeaway.target.value;
    var seriesData = crudeTakeawayChartTypes(prepareSeriesNonTidyUnits(
        crudeTakeawayData,
        false,
        units,
        'MMb/d',
        0.0062898,
        '/',
        ['Total Supply Available for Export','Express','Milk River','Aurora/Rangeland','TransMountain','Enbridge Mainline','Keystone','Enbridge Line 3','TMX','Keystone XL','Structural Rail','Variable Rail'],
        'Year',
        crudeTakeawayColors
        ))
    
    crudeTakeawayChart.update({
        series:seriesData,
        yAxis: {
            title:{text:units}
        }
    })
});





