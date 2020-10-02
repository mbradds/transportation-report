const railChartTypes = (series) => {
    series.map((data,seriesNum)=> {
        if (data.name == 'Crude by Rail') {
            data.type = 'area'
            data.yAxis = 0
        } else {
            data.type = 'line'
            data.yAxis = 1
        }
    })

    return series

}

const railData = JSON.parse(JSON.stringify(JSON.parse(getData('Colette/crude_by_rail/crude_by_rail_wcs.json'))));
const railFilters = {'Units':'bbl per day'}
const railColors = {'Crude by Rail':cerPalette['Night Sky'],
'WCS-WTI Differential':cerPalette['Sun']}

var seriesData = railChartTypes(prepareSeriesNonTidy(railData,railFilters,valueVars=['Crude by Rail','WCS-WTI Differential'],xCol='Date',railColors))

const createRailChart = (json_obj,units='bbl per day') => {

const chartRail = new Highcharts.chart('container_crude_by_rail', {
 
        chart:{
            type:'area', //line,bar,scatter,area,areaspline
            zoomType: 'x', //allows the user to focus in on the x or y (x,y,xy)
            borderColor: 'black',
            borderWidth: 1,
            animation: true,
            events:{
                load: function() {
                    this.credits.element.onclick = function() {
                        window.open(
                            'https://www.cer-rec.gc.ca/index-eng.html',
                            '_blank' // <- This is what makes it open in a new window.
                        );
                     }
                }
            }   
        },
    
        credits:{
            //enabled:false //gets rid of the "Highcharts logo in the bottom right"
            text:'Canada Energy Regulator',
            href:'https://www.cer-rec.gc.ca/index-eng.html'
        },

        legend: {
            enabled: true
        },
    
        title:{text:null},
    
        tooltip:{
            shared:true,
        },

        series: seriesData,
    
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%e of %b'
            }
        },
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value}',
                style: {
                    color: 'black'
                }
            },
            title: {
                text: 'Rail Exports - '+units,
                style: {
                    color: 'black'
                }
            }
        }, { // Secondary yAxis
            title: {
                text: 'Differential - USD/bbl',
                style: {
                    color: 'black'
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: 'black'
                }
            },
            opposite: true
        }],
            
    });

    return chartRail
        
}

var chartRail = createRailChart(seriesData)


var selectUnitsRail = document.getElementById('select_units_rail');
selectUnitsRail.addEventListener('change', (selectUnitsRail) => {
    var units = selectUnitsRail.target.value;
    railFilters['Units'] = units
    var seriesData = railChartTypes(prepareSeriesNonTidy(railData,railFilters,valueVars=['Crude by Rail','WCS-WTI Differential'],xCol='Date',railColors))
    chartRail.update({
        series:seriesData
    })
});