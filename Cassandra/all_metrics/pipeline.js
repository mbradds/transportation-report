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

const filterData = (data, fm) => { 
    //get the specific pipeline
    data = data.filter(row => row.Pipeline == fm['Pipeline']['Value'])
    var owner = data[0]['Owner']
    //these are all the financial metrics specific to the chosen pipeline
    var finMetrics = getUnique(items=data,filterColumns='Type')

    var hcData = [];
    for (metric in finMetrics){
        dataMetric = data.filter(row => row.Type == finMetrics[metric])
        var unit = dataMetric[0]['Unit']
        dataMetric = dataMetric.map((v,i) =>{
            hcRow = {
                x: v['Year'],
                y: v['Value']
            }
            return hcRow
        });

        var showSecond = false

        if (unit == '%'){
            var yAxis = 1
            var showSecond = true
            var chartType = 'scatter'
            // var marker = {
            //     symbol: 'url(https://raw.githubusercontent.com/mbradds/HighchartsData/master/percentage-sign-svgrepo-com.svg)',
            //     width: 10,
            //     height: 10,
            //     color: '#FFBE4B'
            // }
        } else {
            var yAxis = 0
            var chartType = 'line'
            // var marker = {
            //     symbol: 'triangle'
            // }
        }

        var completedMetric = {
            'name': finMetrics[metric],
            'data': dataMetric,
            'yAxis': yAxis,
            'type': chartType
        };
        hcData.push(completedMetric)
    }

    return [hcData,owner,showSecond]
}

const createSet = (githubData,filterMap,colors) => {

    hcData = filterData(githubData,filterMap)
    owner = hcData[1]
    hcData = hcData[0]

    hcData = hcData.map((v,i) => {
        series = {
            type: v['type'],
            name: v['name'],
            data: v['data'],
            color: colors[i],
            yAxis: v['yAxis']
        }
        return series
    })
    return [hcData,owner,showSecond]
}

var filterMap = {
    'Pipeline': { 'Value': 'Canadian Mainline', 'Dependent': false }
}

const xhr = new XMLHttpRequest();
const url = 'https://raw.githubusercontent.com/mbradds/HighchartsData/master/PipelineProfileTables.json'
var githubData = JSON.parse(JSON.stringify(JSON.parse(getData(url))));
var customSeries = createSet(githubData,filterMap,colors= ['#054169', '#FFBE4B', '#5FBEE6', '#559B37', '#FF821E', '#871455', '#8c8c96', '#42464B']);
var showSecond = customSeries[2]
var owner = customSeries[1]
customSeries = customSeries[0]
const drop = getUnique(githubData, filterColumns = 'Pipeline')
dynamicDropDown("select_pipeline", drop.sort())
document.getElementById('select_pipeline').value = 'Canadian Mainline';

const createChart = (newData,owner,showSecond) => {

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

        title: {text: owner+': '+filterMap.Pipeline.Value},

        colors: ['#054169', '#FFBE4B', '#5FBEE6', '#559B37', '#FF821E', '#871455', '#8c8c96', '#42464B'],

        // yAxis: {
        //     title: { text: 'Canadian Dollars ($)' }
        // },

        yAxis: [{ // Primary yAxis
            title: {
                text: 'CAD'
            }
        }, { // Secondary yAxis
            title: {
                text: '% Metric'
            },
            labels: {
                format: '{value}%'
            },
            opposite: true,
            visible: showSecond
        }],

        lang: {
            noData: "No Financial Data"
        },
        noData: {
            style: {
                fontWeight: 'bold',
                fontSize: '15px',
                color: '#303030'
            }
        },
        series: newData
    });

}

const chart = createChart(customSeries,owner);

var select_pipeline = document.getElementById('select_pipeline');
select_pipeline.addEventListener('change', (select_pipeline) => {
    var pipeline = select_pipeline.target.value;
    graphEvent(pipeline, filterMap)
});

const graphEvent = (pipeline,filterMap) => {
    filterMap['Pipeline']['Value'] = pipeline
    var customSeries = createSet(githubData,filterMap,colors= ['#054169', '#FFBE4B', '#5FBEE6', '#559B37', '#FF821E', '#871455', '#8c8c96', '#42464B']);
    var showSecond = customSeries[2]
    var owner = customSeries[1]
    customSeries = customSeries[0]
    createChart(customSeries,owner,showSecond)
}




