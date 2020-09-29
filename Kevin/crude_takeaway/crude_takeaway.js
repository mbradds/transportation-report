const getData = (Url) => {
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", Url, false);
    Httpreq.send(null);
    return Httpreq.responseText;
};


const getUnique = (items, filterColumns) => {
    if (Array.isArray(filterColumns)) {
        var lookup = [];
        var result = {};
    
        for (var f in filterColumns) {
            lookup.push({})
            result[filterColumns[f]] = []
        }
    
        for (var item, i = 0; item = items[i++];) {
            for (f in filterColumns) {
                var name = item[filterColumns[f]];
                if (!(name in lookup[f])) {
                    lookup[f][name] = 1;
                    result[filterColumns[f]].push(name);
                }
            }
        }

        return result
    
    } else {
        var lookup = {};
        var result = [];
        for (var item, i = 0; item = items[i++];) {
            var name = item[filterColumns];
            if (!(name in lookup)) {
                lookup[name] = 1;
                result.push(name);
            }
        }
        return result
    }
}


const prepareSeries = (data) => {

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
        var zIndex = null
        if (v=='Total Supply Available for Export') {
            chartType = 'line'
            zIndex = 1
        } else {
            chartType = 'area'
            zIndex = 0
        }

        seriesData.push({
            name: v,
            zIndex: zIndex,
            type: chartType,
            data: hcData,
            color: colors[iattr]
        })

    })

    return seriesData

}


const githubData = JSON.parse(JSON.stringify(JSON.parse(getData('/fgrs-eng.json'))));
var seriesData = prepareSeries(githubData)
console.log(seriesData)
const createChart = (seriesData) => {


var chart = new Highcharts.chart('container', {

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
        //shared: true,
    },

    // title: { text: 'Canada Propane Exports' },

    // xAxis: {
    // },

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

chart = createChart(seriesData)








