const crudeExportColors = {'PADD I':cerPalette['Sun'],
'PADD II':cerPalette['Night Sky'],
'PADD III':cerPalette['Ocean'],
'PADD IV':cerPalette['Forest'],
'PADD V':cerPalette['Cool Grey'],
'Other':cerPalette['Flame']}

var crudeExportFilters = {'Unit':'bbl/d'}

const crudeExportsData = JSON.parse(JSON.stringify(JSON.parse(getData('Kevin/crude_exports/crude-oil-exports-by-destination-annual.json'))));
fillDrop('Unit','select_units_crude_exports','bbl/d',crudeExportsData)
var seriesData = prepareSeriesTidy(crudeExportsData,crudeExportFilters,'PADD',xCol='Year',yCol='Value',crudeExportColors)

const createCrudeExportsChart = (seriesData) => {

    var chartCrudeExports = new Highcharts.chart('container_crude_exports', {

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

    return chartCrudeExports

}

var chartCrudeExports = createCrudeExportsChart(seriesData)

var selectUnitsCrudeExports = document.getElementById('select_units_crude_exports');
selectUnitsCrudeExports.addEventListener('change', (selectUnitsCrudeExports) => {
    var units = selectUnitsCrudeExports.target.value;
    crudeExportFilters['Unit'] = units
    var seriesData = prepareSeriesTidy(crudeExportsData,crudeExportFilters,'PADD',xCol='Year',yCol='Value',crudeExportColors)
    //chartCrudeExports = createCrudeExportsChart(seriesData)
    chartCrudeExports.update({
        series:seriesData
    })
});








