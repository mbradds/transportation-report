const prepareSeriesGasTraffic = (data,dataColumn) => {

    const colors = ['#054169', '#FFBE4B', '#5FBEE6', '#559B37', '#FF821E', '#871455', '#8c8c96', '#42464B']
    seriesData = []

    if (dataColumn == 'throughput') {
        const pipes = getUnique(data,'Point')
        pipes.map((v,iPipes) => {
            hcData = []
            const pipe = data.filter(row => row['Point'] == v)
            pipe.map((r,i) => {
                hcRow = {
                    x: r.Date,
                    y: r['Throughput (1000 m3/d)']
                }
                hcData.push(hcRow)
            })

            seriesData.push({
                name: v,
                data: hcData,
                color: colors[iPipes],
                type: 'area'
            })

        })
    } else {

        hcData = []
        data.map((v,iCap) => {
            hcRow = {
                x: v.Date,
                y: v['Capacity (1000 m3/d)']
            }
            hcData.push(hcRow)
        })

        seriesData.push({
            name: 'Capacity (1000 m3/d)',
            data: hcData,
            color: '#42464B',
            type: 'line'
        })
    }

    return seriesData

}

const gasTrafficSeries = (gasThroughput,gasCapacity) => {
    const throughput = prepareSeriesGasTraffic(gasThroughput,dataColumn='throughput')
    const capacity = prepareSeriesGasTraffic(gasCapacity,dataColumn='capacity')
    return throughput.concat(capacity)
}

const gasThroughput = JSON.parse(JSON.stringify(JSON.parse(getData('Sara/gas_traffic/gas_throughput.json'))));
const gasCapacity = JSON.parse(JSON.stringify(JSON.parse(getData('Sara/gas_traffic/gas_capacity.json'))));
const gasSeries = gasTrafficSeries(gasThroughput,gasCapacity)

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
            title: { text: 'Million bbl/day' },
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
    
chart = createChartGasTraffic(gasSeries)