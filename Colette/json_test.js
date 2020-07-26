const xhr = new XMLHttpRequest();
const url = 'https://raw.githubusercontent.com/mbradds/HighchartsData/master/crude_by_rail.json';

function getData(Url){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",Url,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
};

function filterData(jsdata){
    jsdata = jsdata.filter(row => row['Units'] === "bbl per day");
    jsdata = jsdata.filter(row => delete row['Units']);
    jsdata = jsdata.filter(row => row['x'] = row['Date']);
    jsdata = jsdata.filter(row => row['y'] = row['Volume']);
    jsdata = jsdata.filter(row => delete row['Date']);
    jsdata = jsdata.filter(row => delete row['Volume']);
    return jsdata
}

var json_obj = filterData(JSON.parse(getData(url)));

console.log(json_obj)

document.addEventListener('DOMContentLoaded',()=>{
    Highcharts.chart('container', {
 
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
                data: json_obj
            }],
    
            // xAxis: {
            //     type: 'datetime',
            //     dateTimeLabelFormats: {
            //         day: '%e of %b'
            //     }
            // },
    
            yAxis: {
                title:{text: 'bbl per day'}
            }
            
        });
        
    });



//console.log(Highcharts.charts)
