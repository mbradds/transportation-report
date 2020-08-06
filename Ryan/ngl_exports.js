const xhr = new XMLHttpRequest();
const url = 'https://raw.githubusercontent.com/mbradds/HighchartsData/master/natural-gas-liquids-exports-monthly.json'
var githubData = JSON.parse(JSON.stringify(JSON.parse(getData(url))));

var dataMap = [{'x':'Period','y':'Pipeline'},
               {'x':'Period','y':'Railway'},
               {'x':'Period','y':'Marine'},
               {'x':'Period','y':'Truck'},
            ];

var filterMap = {'Product':'Propane',
                 'Region':'British Columbia',
                 'Units':'m3'}

function getData(Url){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",Url,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
};

function filterData(jsdata,map,filterMap){
    //this for filters the data based on the default user parameters
    for (var key of Object.keys(filterMap)){
        jsdata = jsdata.filter(row => row[key] == filterMap[key]);
        jsdata = jsdata.filter(row => delete row[key]);
    }

    var xyData = [];
    
    for (var row of jsdata){
        var xYrow = {}
        xYrow['y'] = row[map['y']]
        xYrow['x'] = row[map['x']]
        xyData.push(xYrow)
    }

    jsdata = {'name':map['y'],
              'data':xyData}

    return jsdata
}

function mapData(filterMap){

    var json_obj = [];
    for (i=0;i<dataMap.length;i++){
        var data = JSON.parse(JSON.stringify(githubData)); //deep copy so that only one github request is made
        var hcReady = filterData(data,dataMap[i],filterMap)
        //data has nulls removed at this point
        //if (hcReady['data'].length > 0){
        //    json_obj.push(hcReady);
        //}
        json_obj.push(hcReady); //TODO: look into how to only show series objects with data
    }

    return json_obj
}

json_obj = mapData(filterMap)

//console.log(json_obj)

const chart = new Highcharts.chart('container', {
 
        chart:{
            type:'line', //line,bar,scatter,area,areaspline
            zoomType: 'x', //allows the user to focus in on the x or y (x,y,xy)
            borderColor: 'black',
            borderWidth: 1
        },

        plotOptions: {
            series: {
                connectNulls: false 
            }
        },

        tooltip:{
            shared:true,
        },
    
        title:{text: 'Propane Exports'},
    
        colors:['#054169','#FFBE4B','#5FBEE6','#559B37','#FF821E','#871455','#FFFFFF','#8c8c96','#42464B'],

        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%e of %b'
            }
        },

        yAxis: {
            title:{text: 'Propane Exports'}
        },

        series: [{
            type: 'line',
            name: json_obj[0]['name'],
            data: json_obj[0]['data'],
            color: '#054169'
        },
        {
            type: 'line',
            name: json_obj[1]['name'],
            data: json_obj[1]['data'],
            color: '#FFBE4B'
        },
        {
            type: 'line',
            name: json_obj[2]['name'],
            data: json_obj[2]['data'],
            color: '#5FBEE6'
        },
        {
            type: 'line',
            name: json_obj[3]['name'],
            data: json_obj[3]['data'],
            color: '#559B37'
        }]
            
    });


function graphEvent(product,units){

    filterMap['Product'] = product
    filterMap['Units'] = units
    
    json_obj = mapData(filterMap)
    Highcharts.charts.forEach((graph) => {
        
        graph.update({
            series: [{
                type: 'line',
                name: json_obj[0]['name'],
                data: json_obj[0]['data'],
                color: '#054169'
            },
            {
                type: 'line',
                name: json_obj[1]['name'],
                data: json_obj[1]['data'],
                color: '#FFBE4B'
            },
            {
                type: 'line',
                name: json_obj[2]['name'],
                data: json_obj[2]['data'],
                color: '#5FBEE6'
            },
            {
                type: 'line',
                name: json_obj[3]['name'],
                data: json_obj[3]['data'],
                color: '#559B37'
            }],

            title:{text: product+' Exports'},

            yAxis: {
                title:{text: product+' Exports'}
            },
            })
                    
        graph.redraw(true);
                    
    });

}

var select_product = document.getElementById('select_product');
select_product.addEventListener('change', (select_product) => {
    var product = select_product.target.value;
    var units = filterMap['Units']
    graphEvent(product=product,units=units)

            
});       

var select_units = document.getElementById('select_units');
select_units.addEventListener('change', (select_units) => {
    var units = select_units.target.value;
    var product = filterMap['Product']
    graphEvent(product=product,units=units)

            
});       
