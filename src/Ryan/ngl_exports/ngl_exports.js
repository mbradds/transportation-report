import {cerPalette,getData, fillDrop, prepareSeriesNonTidyUnits} from '../../modules/util.js'

const nglData = JSON.parse(getData('/src/Ryan/ngl_exports/natural-gas-liquids-exports-monthly.json'));
const nglFilters = {
    'Product':'Propane',
    'Region':'Canada'
}
const nglColors = {
    'Pipeline':cerPalette['Sun'],
    'Railway':cerPalette['Night Sky'],
    'Truck':cerPalette['Forest'],
    'Marine':cerPalette['Ocean']
}

var seriesData = prepareSeriesNonTidyUnits(nglData,
    nglFilters,
    'bbl',
    'bbl',
    6.2898,
    '/',
    ['Pipeline','Railway','Truck','Marine'],
    'Period',
    nglColors
    )


fillDrop('Region','select_region_ngl','Canada',nglData)


const createNglChart = (seriesData) => {

    const chart = new Highcharts.chart('container_ngl', {

        chart: {
            type: 'line', //line,bar,scatter,area,areaspline
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

        credits: {
            text: 'Source: CER Commodity Tracking System'
        },

        plotOptions: {
            series: {
                //stickyTracking: false,
                connectNulls: false,
                states: {
                    inactive: {
                        opacity: 1
                    },
                    hover: {
                        enabled: false
                    }
                }
            }
        },

        tooltip: {
            animation: true,
            shared: true,
        },

        title: { text: 'Canada Propane Exports' },


        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%e of %,b'
            },
        },

        yAxis: {
            title: {text: 'bbl'}
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

var nglChart = createNglChart(seriesData)

var selectProductNgl = document.getElementById('select_product_ngl');
selectProductNgl.addEventListener('change', (selectProductNgl) => {
    var product = selectProductNgl.target.value;
    nglFilters.Product = product
    var seriesData = prepareSeriesNonTidyUnits(nglData,
        nglFilters,
        'bbl',
        'bbl',
        6.2898,
        '/',
        ['Pipeline','Railway','Truck','Marine'],
        'Period',
        nglColors
        )

    nglChart = createNglChart(seriesData)
});

var selectRegionNgl = document.getElementById('select_region_ngl');
selectRegionNgl.addEventListener('change', (selectRegionNgl) => {
    var region = selectRegionNgl.target.value;
    nglFilters.Region = region
    var seriesData = prepareSeriesNonTidyUnits(nglData,
        nglFilters,
        'bbl',
        'bbl',
        6.2898,
        '/',
        ['Pipeline','Railway','Truck','Marine'],
        'Period',
        nglColors
        )
    
    nglChart = createNglChart(seriesData)
});

var selectUnitsNgl = document.getElementById('select_units_ngl');
selectUnitsNgl.addEventListener('change', (selectUnitsNgl) => {
    var units = selectUnitsNgl.target.value;
    var seriesData = prepareSeriesNonTidyUnits(nglData,
        nglFilters,
        units,
        'bbl',
        6.2898,
        '/',
        ['Pipeline','Railway','Truck','Marine'],
        'Period',
        nglColors
        )
    
    nglChart.update({
        series:seriesData,
        yAxis: {
            title:{text:units}
        }
    })
});





