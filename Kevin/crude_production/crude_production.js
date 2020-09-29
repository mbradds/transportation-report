const getData = (Url) => {
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", Url, false);
    Httpreq.send(null);
    return Httpreq.responseText;
};

const dynamicDropDown = (id,optionsArray) => {

    function addOption(id,text,select){
        select.options[select.options.length] = new Option(text);
    }

    var select = document.getElementById(id);
    //select.options.length = 0;

    for (var i = 0; i < optionsArray.length; i++) {
        addOption (id, optionsArray[i],select);
    }

}

const fillDrop = (column,dropName,value,data) => {
    const drop = getUnique(data, filterColumns = column)
    dynamicDropDown(dropName, drop)
    document.getElementById(dropName).value = value;
}

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


const prepareSeries = (data,region) => {

    const colors = ['#054169', '#FFBE4B', '#5FBEE6', '#559B37', '#FF821E', '#871455', '#8c8c96', '#42464B']
    seriesData = []
    data = data.filter(row => row.Region == region)
    const products = getUnique(data,'Product')
    
    products.map((v,iProducts) => {
        hcData = []
        const product = data.filter(row => row.Product == v)
        product.map((r,i) => {
            hcRow = {
                x: r.Year,
                y: r.Value
            }
            hcData.push(hcRow)
        })

        seriesData.push({
            name: v,
            data: hcData,
            color: colors[iProducts]
        })

    })

    return seriesData

}


const githubData = JSON.parse(JSON.stringify(JSON.parse(getData('/Crude_Oil_Production.json'))));
fillDrop('Region','select_region','Canada',githubData)
var seriesData = prepareSeries(githubData,'Canada')

const createChart = (seriesData) => {


var chart = new Highcharts.chart('container', {

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

return chart
}

chart = createChart(seriesData)

var select_region = document.getElementById('select_region');
select_region.addEventListener('change', (select_region) => {
    var region = select_region.target.value;
    var seriesData = prepareSeries(githubData,region)
    chart = createChart(seriesData)
});








