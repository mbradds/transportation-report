
// var dataMap = [{'x':'Date','y':'Crude by Rail'},{'x':'Date','y':'WCS-WTI Differential'}];

// function filterData(jsdata,map,filter_value='bbl per day'){
//     jsdata = jsdata.filter(row => row['Units'] === filter_value);
//     jsdata = jsdata.filter(row => delete row['Units']);
//     for (var key of Object.keys(map)){
//         jsdata = jsdata.filter(row => row[key] = row[map[key]]);
//         jsdata = jsdata.filter(row => delete row[map[key]]);
//     }
    
//     //TODO: remove extra json columns here
//     jsdata = jsdata.map(function(elt) {return (({ x, y }) => ({ x, y }))(elt);});

//     jsdata = {'name':map['y'],
//               'data':jsdata}

//     return jsdata
// }

// function mapData(filter_value){

//     var json_obj = [];
//     for (i=0;i<dataMap.length;i++){
//         var data = JSON.parse(JSON.stringify(githubData)); //deep copy so that only one github request is made
//         json_obj.push(filterData(data,dataMap[i],filter_value));
//     }

//     return json_obj
// }

const prepareSeriesRail = (data,units) => {
    const colors = ['#054169', '#FFBE4B', '#5FBEE6', '#559B37', '#FF821E', '#871455', '#8c8c96', '#42464B']
    data = data.filter(row => row.Units == units)
    const railTypes = getUnique(data,'variable')
    seriesData = []

    railTypes.map((iType,vType) => {
        hcData = []
        const type = data.filter(row => row.variable == iType)

        type.map((i,v) => {
            hcRow = {
                x: i.Date,
                y: i.value
            }
            hcData.push(hcRow)
        })

        seriesData.push({
            name: iType,
            data: hcData,
            color: colors[vType]
        })
    })


    return seriesData
}


const url = 'Colette/crude_by_rail/crude_by_rail_wcs.json';
var railData = JSON.parse(JSON.stringify(JSON.parse(getData(url))));
var seriesData = prepareSeriesRail(railData,'bbl per day')

const createRailChart = (json_obj,units='bbl per day') => {

const chartRail = new Highcharts.chart('container_crude_by_rail', {
 
        chart:{
            type:'area', //line,bar,scatter,area,areaspline
            zoomType: 'x', //allows the user to focus in on the x or y (x,y,xy)
            borderColor: 'black',
            borderWidth: 1,
            animation: false,
            events:{
                load: function() {
                    this.credits.element.onclick = function() {
                        window.open(
                            'https://www.cer-rec.gc.ca/index-eng.html',
                            '_blank' // <- This is what makes it open in a new window.
                        );
                     }
                }
            }   
        },
    
        credits:{
            //enabled:false //gets rid of the "Highcharts logo in the bottom right"
            text:'Canada Energy Regulator',
            href:'https://www.cer-rec.gc.ca/index-eng.html'
        },

        legend: {
            enabled: true
        },
    
        title:{text:null},
    
        tooltip:{
            shared:true,
        },

        series: [{
            type: 'area',
            yAxis: 0,
            name: json_obj[0]['name'],
            data: json_obj[0]['data'],
            color: '#054169'
        },
        {
            type: 'line',
            yAxis: 1,
            name: json_obj[1]['name'],
            data: json_obj[1]['data'],
            color: '#FFBE4B'
        }],
    
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%e of %b'
            }
        },
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value}',
                style: {
                    color: 'black'
                }
            },
            title: {
                text: 'Rail Exports - '+units,
                style: {
                    color: 'black'
                }
            }
        }, { // Secondary yAxis
            title: {
                text: 'Differential - USD/bbl',
                style: {
                    color: 'black'
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: 'black'
                }
            },
            opposite: true
        }],
            
    });

    return chartRail
        
}

var chartRail = createRailChart(seriesData)

var selectUnitsRail = document.getElementById('select_units_rail');
selectUnitsRail.addEventListener('change', (selectUnitsRail) => {
    var units = selectUnitsRail.target.value;
    var seriesData = prepareSeriesRail(railData,units)
    chartRail = createRailChart(seriesData,units)
});
