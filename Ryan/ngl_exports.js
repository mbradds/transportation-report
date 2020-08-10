const getData = (Url) => {
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", Url, false);
    Httpreq.send(null);
    return Httpreq.responseText;
};

const dynamicDropDown = (id, optionsArray) => {

    function addOption(id, text, select) {
        select.options[select.options.length] = new Option(text);
    }

    const select = document.getElementById(id);
    select.options.length = 0;

    optionsArray.map((v, i) => {
        addOption(id, optionsArray[i], select);
    })

}

//gets the unique regions to populate the dropdown
const getUnique = (items, filterColumns) => {
    if (Array.isArray(filterColumns)) {
        var lookup = [];
        var result = {};

        for (f in filterColumns) {
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

const filterData = (xyData, map, fm) => {
    //this for filters the data based on the default user parameters
    for (var key of Object.keys(fm)) {
        xyData = xyData.filter(row => row[key] == fm[key]['Value']);
        xyData = xyData.filter(row => delete row[key]);
    }

    xyData = xyData.map((v,i) => {
        xYrow = {
            y: v[map['y']],
            x: v[map['x']]
        }
        return xYrow
    })

    //if one of the "y" columns isnt null, then add it to data. If all columns are null, then dont add it to data.
    //this ensures that the proper amount of legend items are shown

    let yNull = true
    for (t = 0; t < xyData.length; t++) {
        if (xyData[t]['y'] != null) {
            yNull = false;
            break;
        }
    };

    //This only adds a series if there is data
    let hasData = false
    if (!yNull) {
        hasData = true
    } else {
        hasData = false
    }
    data = {
        'name': map['y'],
        'data': xyData,
        'hasData': hasData
    }

    return data
}

const mapData = (fm,dm) => {
    return dm.map((v, i) => {
        const data = JSON.parse(JSON.stringify(githubData));
        return filterData(data, dm[i], fm)
    })
}

const createSet = (hcData,colors) => {
    return hcData.map((v,i) => {
        series = {
            type: 'line',
            name: v['name'],
            data: v['data'],
            color: colors[i],
            visible: v['hasData']
        }
        return series
    })
}

const graphEvent = (product, units, region, filterMap,dataMap) => {

    filterMap['Product']['Value'] = product
    filterMap['Units']['Value'] = units
    filterMap['Region']['Value'] = region

    json_obj = mapData(fm = filterMap,dm=dataMap)
    var customSeries = createSet(json_obj,colors=colors= ['#054169', '#FFBE4B', '#5FBEE6', '#559B37', '#FF821E', '#871455', '#FFFFFF', '#8c8c96', '#42464B']);
    Highcharts.charts.forEach((graph) => {

        graph.update({

            series: customSeries,

            title: { text: region + ' ' + product + ' Exports' },

            yAxis: {
                title: { text: units }
            },
        })

        graph.redraw(true);

    });

}

const xhr = new XMLHttpRequest();
const url = 'https://raw.githubusercontent.com/mbradds/HighchartsData/master/natural-gas-liquids-exports-monthly.json'
var githubData = JSON.parse(JSON.stringify(JSON.parse(getData(url))));

var dataMap = [{ 'x': 'Period', 'y': 'Pipeline' },
{ 'x': 'Period', 'y': 'Railway' },
{ 'x': 'Period', 'y': 'Marine' },
{ 'x': 'Period', 'y': 'Truck' },
];

//put the filters in order or dependency
var filterMap = {
    'Product': { 'Value': 'Propane', 'Dependent': false },
    'Units': { 'Value': 'bbl', 'Dependent': false },
    'Region': { 'Value': 'Canada', 'Dependent': true }
}

json_obj = mapData(fm=filterMap,dm=dataMap);
var customSeries = createSet(json_obj,colors= ['#054169', '#FFBE4B', '#5FBEE6', '#559B37', '#FF821E', '#871455', '#FFFFFF', '#8c8c96', '#42464B']);
const drop = getUnique(githubData, filterColumns = Object.keys(filterMap))
dynamicDropDown("select_region", drop['Region'].sort())
document.getElementById('select_region').value = 'Canada';


var select_product = document.getElementById('select_product');
select_product.addEventListener('change', (select_product) => {
    var product = select_product.target.value;
    var units = filterMap['Units']['Value']
    var region = filterMap['Region']['Value']
    graphEvent(product, units, region, filterMap, dataMap)
});

var select_units = document.getElementById('select_units');
select_units.addEventListener('change', (select_units) => {
    var units = select_units.target.value;
    var product = filterMap['Product']['Value']
    var region = filterMap['Region']['Value']
    graphEvent(product, units, region, filterMap, dataMap)
});

var select_region = document.getElementById('select_region');
select_region.addEventListener('change', (select_region) => {
    var region = select_region.target.value;
    var product = filterMap['Product']['Value']
    var units = filterMap['Units']['Value']
    graphEvent(product, units, region, filterMap, dataMap)
});


const chart = new Highcharts.chart('container', {

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
                        'https://www.cer-rec.gc.ca/index-eng.html',
                        '_blank' // <- This is what makes it open in a new window.
                    );
                }
            }
        }
    },

    credits: {
        //enabled:false //gets rid of the "Highcharts logo in the bottom right"
        text: 'Canada Energy Regulator',
        href: 'https://www.cer-rec.gc.ca/index-eng.html'
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

    colors: ['#054169', '#FFBE4B', '#5FBEE6', '#559B37', '#FF821E', '#871455', '#FFFFFF', '#8c8c96', '#42464B'],

    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
            day: '%e of %b'
        }
    },

    yAxis: {
        title: { text: 'bbl' }
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
    series: customSeries
});








