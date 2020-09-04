const getData = (Url) => {
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", Url, false);
    Httpreq.send(null);
    return Httpreq.responseText;
};

const dynamicDropDown = (id, optionsArray) => {

    function addOption(text, select) {
        select.options[select.options.length] = new Option(text);
    }

    var select = document.getElementById(id);
    var i, L = select.options.length - 1;
    for(i = L; i >= 0; i--) {
       select.remove(i);
    }
    //select.options.length = 0;

    optionsArray.map((v, i) => {
        addOption(optionsArray[i], select);
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
    
    //get the specific financial metric
    data = data.filter(row => row.Type == fm['Type']['Value'])
    //get the pipes in commodity category
    if (fm['Pipeline']['Value'] == 'Oil'){
        data = data.filter(row => pipeCategory.Oil.includes(row.Pipeline))
    } else if (fm['Pipeline']['Value'] == 'Gas'){
        data = data.filter(row => !pipeCategory.Oil.includes(row.Pipeline))
    }

    dropData = data;
    //these are all the financial metrics specific to the chosen pipeline
    var finPipes = getUnique(items=data,filterColumns='Pipeline')

    var hcData = [];
    for (pipe in finPipes){
        dataPipe = data.filter(row => row.Pipeline == finPipes[pipe])
        var unit = dataPipe[0]['Unit']
        dataPipe = dataPipe.map((v,i) =>{
            hcRow = {
                x: v['Year'],
                y: v['Value']
            }
            return hcRow
        });

        if (unit == '%'){
            var yFormat = '{value}%'
            var yLabel = '%'
        } else {
            var yFormat = '{value:,.0f}'
            var yLabel = 'CAD ($)'
        }

        var completedMetric = {
            'name': finPipes[pipe],
            'data': dataPipe
        };
        hcData.push(completedMetric)
    }

    return [hcData,[yFormat,yLabel]]
}

const createSet = (githubData,filterMap,colors) => {

    hcData = filterData(githubData,filterMap)
    dropData = hcData[2]
    yOptions = hcData[1]
    hcData = hcData[0]

    hcData = hcData.map((v,i) => {
        series = {
            name: v['name'],
            data: v['data'],
            color: colors[i]
        }
        return series
    })
    return [hcData,yOptions]
}

const relevantValues = (data,pipeGroup) => {
    // var select_pipes = document.getElementById('select_pipelines');
    // select_pipes.addEventListener('change', (select_pipes) => {
    //     var pipeGroup = select_pipes.target.value;
    //     console.log(pipeGroup)
    // });

    if (pipeGroup == 'Oil'){
        data = data.filter(row => pipeCategory.Oil.includes(row.Pipeline))
    } else if (pipeGroup == 'Gas'){
        data = data.filter(row => !pipeCategory.Oil.includes(row.Pipeline))
    }

    commodityMetrics = getUnique(items=data,filterColumns='Type')
    return commodityMetrics
}

const fillDrop = (column,dropName,value,data) => {
    const drop = getUnique(data, filterColumns = column)
    dynamicDropDown(dropName, drop.sort())
    document.getElementById(dropName).value = value;
}

var filterMap = {
    'Type': {'Value': 'Assets', 'Dependent': false},
    'Pipeline':{'Value':'All','Dependent':false}
}

const pipeCategory = {'Oil':['Aurora Pipeline','Enbridge Mainline','Enbridge Norman Wells Pipeline','Express Pipeline','Cochin Pipeline','Milk River Pipeline','Montreal Pipeline','Southern Lights Pipeline','Trans Mountain Pipeline','Keystone Pipeline System','Trans-Northern Pipeline','Wascana','Westspur Pipeline']
}


const url = 'https://raw.githubusercontent.com/mbradds/HighchartsData/master/PipelineProfileTables.json'
var githubData = JSON.parse(JSON.stringify(JSON.parse(getData(url))));
var customSeries = createSet(githubData,filterMap,colors= ['#054169', '#FFBE4B', '#5FBEE6', '#559B37', '#FF821E', '#871455', '#8c8c96', '#42464B']);
yOptions = customSeries[1];
customSeries = customSeries[0]
fillDrop(column='Type',dropName='select_metric',value='Assets',data=githubData)


const createChart = (newData,yOptions) => {

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
                stickyTracking: false,
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
            animation: true
            //shared: true,
        },

        title: {text: filterMap.Type.Value+': '+filterMap.Pipeline.Value+' pipelines'},

        colors: ['#054169', '#FFBE4B', '#5FBEE6', '#559B37', '#FF821E', '#871455', '#8c8c96', '#42464B'],

        yAxis: {
            title: {
                text: yOptions[1]
            },
            labels: {
                format: yOptions[0]
            },
        }, 

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

const chart = createChart(customSeries,yOptions);

var select_metric = document.getElementById('select_metric');
select_metric.addEventListener('change', (select_metric) => {
    var metric = select_metric.target.value;
    var pipeGroup = filterMap.Pipeline.Value
    graphEvent(metric, pipeGroup, filterMap)
});

//selects oil, gas, or all
var select_pipes = document.getElementById('select_pipelines');
select_pipes.addEventListener('change', (select_pipes) => {
    var pipeGroup = select_pipes.target.value;
    var metric = filterMap.Type.Value
    commodityMetrics = relevantValues(githubData,pipeGroup)
    console.log(commodityMetrics)
    dynamicDropDown('select_metric', commodityMetrics)
    graphEvent(metric, pipeGroup, filterMap)
});

const graphEvent = (metric,pipeGroup, filterMap) => {
    filterMap['Type']['Value'] = metric
    filterMap['Pipeline']['Value'] = pipeGroup
    var customSeries = createSet(githubData,filterMap,colors= ['#054169', '#FFBE4B', '#5FBEE6', '#559B37', '#FF821E', '#871455', '#8c8c96', '#42464B']);
    yOptions = customSeries[1];
    customSeries = customSeries[0]
    createChart(customSeries,yOptions)
}




