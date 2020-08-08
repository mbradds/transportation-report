function getData(Url) {
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", Url, false);
    Httpreq.send(null);
    return Httpreq.responseText;
};


function dynamicDropDown(id, optionsArray) {

    function addOption(id, text, select) {
        select.options[select.options.length] = new Option(text);
    }

    var select = document.getElementById(id);
    select.options.length = 0;

    for (var i = 0; i < optionsArray.length; i++) {
        addOption(id, optionsArray[i], select);
    }

}

//gets the unique regions to populate the dropdown
function getUnique(items, filterColumns) {
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

function filterData(data, map, filterMap) {
    //this for filters the data based on the default user parameters
    for (var key of Object.keys(filterMap)) {
        //this section of code gets all the valid provinces given the product
        //TODO: update the dropdown here with relevant regions
        // if(filterMap[key]['Dependent'] == true){
        //     var drop = getUnique(data,filterColumns=key)
        // }
        data = data.filter(row => row[key] == filterMap[key]['Value']);
        data = data.filter(row => delete row[key]);
    }

    var xyData = [];

    for (var row of data) {
        var xYrow = {}
        xYrow['y'] = row[map['y']]
        xYrow['x'] = row[map['x']]
        xyData.push(xYrow)
    }

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

function mapData(filterMap) {

    var hcColumns = [];
    for (i = 0; i < dataMap.length; i++) {
        var data = JSON.parse(JSON.stringify(githubData)); //deep copy so that only one github request is made
        var hcReady = filterData(data, dataMap[i], filterMap)
        hcColumns.push(hcReady); //TODO: look into how to only show series objects with data
    }

    return hcColumns
}

function graphEvent(product, units, region) {

    filterMap['Product']['Value'] = product
    filterMap['Units']['Value'] = units
    filterMap['Region']['Value'] = region

    json_obj = mapData(filterMap)
    Highcharts.charts.forEach((graph) => {

        graph.update({
            series: [{
                type: 'line',
                name: json_obj[0]['name'],
                data: json_obj[0]['data'],
                color: '#054169',
                visible: json_obj[0]['hasData']
            },
            {
                type: 'line',
                name: json_obj[1]['name'],
                data: json_obj[1]['data'],
                color: '#FFBE4B',
                visible: json_obj[1]['hasData']
            },
            {
                type: 'line',
                name: json_obj[2]['name'],
                data: json_obj[2]['data'],
                color: '#5FBEE6',
                visible: json_obj[2]['hasData']
            },
            {
                type: 'line',
                name: json_obj[3]['name'],
                data: json_obj[3]['data'],
                color: '#559B37',
                visible: json_obj[3]['hasData']
            }],

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

json_obj = mapData(filterMap)


var drop = getUnique(githubData, filterColumns = Object.keys(filterMap))
dynamicDropDown("select_region", drop['Region'].sort())
document.getElementById('select_region').value = 'Canada';


var select_product = document.getElementById('select_product');
select_product.addEventListener('change', (select_product) => {
    var product = select_product.target.value;
    var units = filterMap['Units']['Value']
    var region = filterMap['Region']['Value']
    graphEvent(product = product, units = units, region = region)
});

var select_units = document.getElementById('select_units');
select_units.addEventListener('change', (select_units) => {
    var units = select_units.target.value;
    var product = filterMap['Product']['Value']
    var region = filterMap['Region']['Value']
    graphEvent(product = product, units = units, region = region)
});

var select_region = document.getElementById('select_region');
select_region.addEventListener('change', (select_region) => {
    var region = select_region.target.value;
    var product = filterMap['Product']['Value']
    var units = filterMap['Units']['Value']
    graphEvent(product = product, units = units, region = region)
});


// function createSeries(json_obj){
//     //console.log(json_obj)
// }
// createSeries(json_obj)


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

    series: [{
        type: 'line',
        name: json_obj[0]['name'],
        data: json_obj[0]['data'],
        color: '#054169',
        visible: json_obj[0]['hasData']
    },
    {
        type: 'line',
        name: json_obj[1]['name'],
        data: json_obj[1]['data'],
        color: '#FFBE4B',
        visible: json_obj[1]['hasData']
    },
    {
        type: 'line',
        name: json_obj[2]['name'],
        data: json_obj[2]['data'],
        color: '#5FBEE6',
        visible: json_obj[2]['hasData']
    },
    {
        type: 'line',
        name: json_obj[3]['name'],
        data: json_obj[3]['data'],
        color: '#559B37',
        visible: json_obj[3]['hasData']
    }]

});








