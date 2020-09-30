const filterData = (data, fm) => { 
    //get the specific pipeline
    data = data.filter(row => row.Type == fm['Type']['Value'])
    if (fm['Pipeline']['Value'] == 'Oil'){
        data = data.filter(row => pipeCategory.Oil.includes(row.Pipeline))
    } else if (fm['Pipeline']['Value'] == 'Gas'){
        data = data.filter(row => !pipeCategory.Oil.includes(row.Pipeline))
    }
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

const createSet = (financialData,filterMap,colors) => {
    hcData = filterData(financialData,filterMap)
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

var filterMap = {
    'Type': {'Value': 'Assets', 'Dependent': false},
    'Pipeline':{'Value':'All','Dependent':false}
}

const pipeCategory = {'Oil':['Aurora Pipeline','Enbridge Mainline','Enbridge Norman Wells Pipeline','Express Pipeline','Cochin Pipeline','Milk River Pipeline','Montreal Pipeline','Southern Lights Pipeline','Trans Mountain Pipeline','Keystone Pipeline System','Trans-Northern Pipeline','Wascana','Westspur Pipeline']
}


var financialData = JSON.parse(JSON.stringify(JSON.parse(getData('Cassandra/all_pipes/PipelineProfileTables.json'))));
var customSeries = createSet(financialData,filterMap,colors= ['#054169', '#FFBE4B', '#5FBEE6', '#559B37', '#FF821E', '#871455', '#8c8c96', '#42464B']);
yOptions = customSeries[1];
customSeries = customSeries[0]
fillDrop(column='Type',dropName='select_metric_financial',value='Assets',data=financialData)


const createFinancialChart = (newData,yOptions) => {

    const chart = new Highcharts.chart('container_financial_metrics', {

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

const chart = createFinancialChart(customSeries,yOptions);

var selectMetricFinancial = document.getElementById('select_metric_financial');
selectMetricFinancial.addEventListener('change', (selectMetricFinancial) => {
    var metric = selectMetricFinancial.target.value;
    var pipeGroup = filterMap.Pipeline.Value
    graphEvent(metric, pipeGroup, filterMap)
});

var selectPipeFinancial = document.getElementById('select_pipelines_financial');
selectPipeFinancial.addEventListener('change', (selectPipeFinancial) => {
    var pipeGroup = selectPipeFinancial.target.value;
    var metric = filterMap.Type.Value
    graphEvent(metric, pipeGroup, filterMap)
});

const graphEvent = (metric,pipeGroup, filterMap) => {
    filterMap['Type']['Value'] = metric
    filterMap['Pipeline']['Value'] = pipeGroup
    var customSeries = createSet(financialData,filterMap,colors= ['#054169', '#FFBE4B', '#5FBEE6', '#559B37', '#FF821E', '#871455', '#8c8c96', '#42464B']);
    yOptions = customSeries[1];
    customSeries = customSeries[0]
    createFinancialChart(customSeries,yOptions)
}




