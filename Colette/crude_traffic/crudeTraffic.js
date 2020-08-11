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
    console.log(fm)
    for (var key of Object.keys(fm)) {
        data = data.filter(row => row.Pipeline == fm[key]['Value'])
    }
    //var owner = data[0]['Corporate Entity']
    //these are all the financial metrics specific to the chosen pipeline
    var keyPoint = getUnique(items=data,filterColumns='Key Point')
    return data
    // var hcData = [];
    // for (point in keyPoint){
    //     dataPoint = data.filter(row => row.Type == keyPoint[point])
    //     var unit = dataMetric[0]['Unit']
    //     dataMetric = dataMetric.map((v,i) =>{
    //         hcRow = {
    //             x: v['Year'],
    //             y: v['Value']
    //         }
    //         return hcRow
    //     });

    //     var showSecond = false

    //     if (unit == '%'){
    //         var yAxis = 1
    //         var showSecond = true
    //         var chartType = 'scatter'

    //     } else {
    //         var yAxis = 0
    //         var chartType = 'line'
    //         // var marker = {
    //         //     symbol: 'triangle'
    //         // }
    //     }

    //     var completedMetric = {
    //         'name': finMetrics[metric],
    //         'data': dataMetric,
    //         'yAxis': yAxis,
    //         'type': chartType
    //     };
    //     hcData.push(completedMetric)
    // }

    // return [hcData,owner,showSecond]
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
    'Pipeline': {'Value':'Canadian Mainline'},
    'Units': {'Value':'Throughput (1000 b/d)'}
}

const colors= ['#054169', '#FFBE4B', '#5FBEE6', '#559B37', '#FF821E', '#871455', '#8c8c96', '#42464B']
const xhr = new XMLHttpRequest();
const urlThroughput = 'https://raw.githubusercontent.com/mbradds/HighchartsData/master/oil_throughput.json'
var throughputData = JSON.parse(JSON.stringify(JSON.parse(getData(urlThroughput))));
var onePipe = filterData(data=throughputData,fm=filterMap)
console.log(throughputData);
console.log(onePipe)
// var showSecond = customSeries[2]
// var owner = customSeries[1]
// customSeries = customSeries[0]
// const drop = getUnique(githubData, filterColumns = 'Pipeline')
// dynamicDropDown("select_pipeline", drop.sort())
// document.getElementById('select_pipeline').value = 'Canadian Mainline';



