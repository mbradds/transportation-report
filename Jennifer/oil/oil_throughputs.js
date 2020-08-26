const createChart = (githubData,filterMap) => {

    var throughcap = filterDataSeries(githubData,filterMap) 
    var throughput = throughcap.slice(0)[0]
    var capacity = throughcap.slice(-1)[0]
    var data = throughput.concat(capacity); 
    const chart = new Highcharts.chart('container_chart', {

        chart: {
            renderTo: 'container_chart',
            //type: 'area', //line,bar,scatter,area,areaspline
            zoomType: 'x', //allows the user to focus in on the x or y (x,y,xy)
            //borderColor: 'black',
            //borderWidth: 1,
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
            area: {
                stacking: 'normal'
            },
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
            animation: true,
            shared: true
        },

        title: {text: filterMap['Corporate Entity']['Value']+' '+filterMap['Key Point']['Value']},

        colors: ['#054169', '#FFBE4B', '#5FBEE6', '#559B37', '#FF821E', '#871455', '#8c8c96', '#42464B'],

        yAxis: {
            title: {
                text: 'Throughput and Capacity'
            },
        }, 

        xAxis: {
            type: 'datetime'
        },

        lang: {
            noData: "Click on a key point"
        },
        noData: {
            style: {
                fontWeight: 'bold',
                fontSize: '15px',
                color: '#303030'
            }
        },
        series: data
    });

    //return chart
}

//const chart = createChart(githubData,filterMap);

const getData = (Url) => {
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", Url, false);
    Httpreq.send(null);
    return Httpreq.responseText;
};

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

const groupBy = (itter,column) => {
    result = {}
    grouped = itter.reduce((result,current) => {
        result[current[column]] = result[current[column]] || [];
        result[current[column]].push(current['Available Capacity (1000 m3/d)']);
        return result
    })

    const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length

    hcGroup = []

    for (const [key, value] of Object.entries(grouped)) {
        if (Array.isArray(value)){
            hcGroup.push(
                {'x':key,
                 'y': arrAvg(grouped[key])}
            )
        } else {
            delete grouped[key]
        }
      }
    

    var completedMetric = {
        name: 'Available Capacity (1000 m3/d)',
        data: hcGroup,
        type: 'line'
    }
    
    return completedMetric
}

const filterDataSeries = (data, fm) => { 
    //get the specific pipeline
    Object.keys(fm).map((v,i) => {
        data = data.filter(row => row[v] == fm[v]['Value'])
    })

    var capacity =  JSON.parse(JSON.stringify(data)); //deep copy so changes dont get applied to throughput
    capacity = groupBy(capacity,'Date')

    var products = getUnique(data,'Product')
    var throughput = [];
    for (product in products){
        dataProduct = data.filter(row => row.Product == products[product])
        dataProduct = dataProduct.map((v,i) =>{
            hcRow = {
                x: v['Date'],
                y: v['Throughput (1000 m3/d)']
            }
            return hcRow
        });

        var completedMetric = {
            'name': products[product],
            'data': dataProduct,
            'type': 'area'
        };

        throughput.push(completedMetric)
    }

    return [throughput,capacity]
}


const filterDataPoints = (data, fm, colors) => { 
    
    data = data.filter(row => row.Commodity == fm.Commodity.Value)
    const nameChange = [['Longitude','lon'],['Latitude','lat'],['Key Point','name']]
    data = data.map((v,i) => {
    	for (var name in nameChange){
      	newName = nameChange[name]
        v[newName.slice(-1)[0]] = v[newName.slice(0)[0]]
        delete v[newName.slice(0)[0]]
      }
			v['color'] = colors[v['Corporate Entity']]
      return v
    })

    return data
}

const urlPoints = 'https://raw.githubusercontent.com/mbradds/HighchartsData/master/keyPoints.json'
var githubPoints = JSON.parse(JSON.stringify(JSON.parse(getData(urlPoints))));
const urlSeries = 'https://raw.githubusercontent.com/mbradds/HighchartsData/master/oil_throughcap.json'
var githubSeries = JSON.parse(JSON.stringify(JSON.parse(getData(urlSeries))));
var filterPoint = {
    'Commodity': {'Value': 'Oil', 'Dependent': false}
}
const colors = {
    'Trans Mountain Pipeline ULC': '#FFBE4B',
    'Enbridge Pipelines (NW) Inc': '#054169',
    'Enbridge Pipelines Inc':'#5FBEE6',
    'Kinder Morgan':'#559B37'
    }

var filterMap = {
    'Corporate Entity': {'Value': 'Enbridge Pipelines Inc.'},
    'Key Point':{'Value':'ex-Gretna'}
}

var oilPoints = filterDataPoints(githubPoints,filterPoint,colors)

//Create the chart
Highcharts.mapChart('container_map', {

		plotOptions: {
      series: {
          stickyTracking: false,
          point: {
                    events: {
                        click: function () {
                            var text = '<b>'+this['Corporate Entity']+' '+this.name+'</b>'+'<br>Series: ' + this.series.name
                                chart = this.series.chart;
                            if (!chart.clickLabel) {
                                chart.clickLabel = chart.renderer.label(text, 0, 250)
                                    .css({
                                        width: '180px'
                                    })
                                    .add();
                            } else {
                                chart.clickLabel.attr({
                                    text: text
                                });
                            }
                         filterMap['Corporate Entity'].Value = this['Corporate Entity']
                         filterMap['Key Point'].Value = this.name
                         createChart(githubSeries,filterMap)   
                        }
                    }
                }
      }
  	},
    chart: {
        map: 'countries/ca/ca-all',
        renderTo: 'container_map'
    },

    title: {
        text: 'Crude Oil Throughput and Capacity'
    },

/*     subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-all.js">Canada</a>'
    }, */

    mapNavigation: {
        enabled: true,
        buttonOptions: {
            verticalAlign: 'bottom'
        }
    },
    
    tooltip: {
    		snap: 0,
        //headerFormat: '<b>{point.name}</b>',
        //pointFormat: '<b>{point.name}</b><br>Lat: {point.lat}, Lon: {point.lon}'
        formatter: function() {
        	return '<b>'+this.point['Corporate Entity']+'-'+this.point.name +' key point'+'</b><br>'
          +'Click on key point to view throughput & capacity'
    }
    },

    
    series: [{
    	name: 'Basemap',
      borderColor: '#606060',
      nullColor: 'rgba(200, 200, 200, 0.2)',
      showInLegend: false
    },{
        type: 'mappoint',
        name: 'Key Points',
        data : oilPoints
    }]
        
});