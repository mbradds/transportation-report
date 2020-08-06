const xhr = new XMLHttpRequest();
const url = 'https://raw.githubusercontent.com/mbradds/HighchartsData/master/crude_by_rail_wcs.json';
var githubData = JSON.parse(JSON.stringify(JSON.parse(getData(url))));

function getData(Url){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",Url,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
};

var dataMap = [{'x':'Date','y':'Volume'},{'x':'Date','y':'WCS Differential'}];

function filterData(jsdata,map,filter_value='bbl per day'){
    jsdata = jsdata.filter(row => row['Units'] === filter_value);
    jsdata = jsdata.filter(row => delete row['Units']);
    for (var key of Object.keys(map)){
        jsdata = jsdata.filter(row => row[key] = row[map[key]]);
        jsdata = jsdata.filter(row => delete row[map[key]]);
    }
    
    //TODO: remove extra json columns here
    jsdata = jsdata.map(function(elt) {return (({ x, y }) => ({ x, y }))(elt);});

    jsdata = {'name':map['y'],
              'data':jsdata}

    return jsdata
}

function mapData(filter_value){

    var json_obj = [];
    for (i=0;i<dataMap.length;i++){
        var data = JSON.parse(JSON.stringify(githubData)); //deep copy so that only one github request is made
        json_obj.push(filterData(data,dataMap[i],filter_value));
    }

    return json_obj
}

json_obj = mapData('bbl per day')
console.log(json_obj[1]['data'])

var chart = new Highcharts.chart('container', {
 
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
            enabled: false
        },
    
        title:{text:'Crude by Rail Exports'},
    
        colors:['#054169','#FFBE4B','#5FBEE6','#559B37','#FF821E','#871455','#FFFFFF','#8c8c96','#42464B'],
    
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
                text: 'Rail Exports - bbl per day',
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
        

var select = document.getElementById('select');
select.addEventListener('change', (select) => {

    var units = select.target.value;
    json_obj = mapData(units)
            
    Highcharts.charts.forEach((graph) => {
    
        graph.update({
            series: [{
                type: 'area',
                name: json_obj[0]['name'],
                data: json_obj[0]['data'],
                color: '#054169'
           },
           {
               type: 'line',
               name: json_obj[1]['name'],
               data: json_obj[1]['data'],
               color: '#FFBE4B'
           }],

           yAxis: {
            title:{text: 'Rail Exports - '+units}
        }
            
        })
                
        graph.redraw(true);
                
    });
        
});
