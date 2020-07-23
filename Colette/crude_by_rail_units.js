document.addEventListener('DOMContentLoaded',()=>{
    Highcharts.chart('container', {
 
            chart:{
                type:'area', //line,bar,scatter,area,areaspline
                zoomType: 'x', //allows the user to focus in on the x or y (x,y,xy)
                borderColor: 'black',
                borderWidth: 1,
                animation: false
            },
    
            credits:{
                //enabled:false //gets rid of the "Highcharts logo in the bottom right"
                text:'Canada Energy Regulator',
                href:'https://www.cer-rec.gc.ca/index-eng.html'
            },
    
            title:{text:'Crude by Rail Exports'},
    
            data: {
                csvURL: 'https://raw.githubusercontent.com/mbradds/HighchartsData/master/crude_by_rail_units.csv',
                units_: 'bbl per day',
                
                complete: function(options,unit_select='bbl per day') {
                    options.series = options.series.filter(data => data.name === unit_select)
                }
            },
    
    
            colors:['#054169','#FFBE4B','#5FBEE6','#559B37','#FF821E','#871455','#FFFFFF','#8c8c96','#42464B'],
            
            //series: [{
            //    data: graph.data
            //}],
            
            plotOptions: {
                series: {
                    stickyTracking:false,
                    marker: {
                        enabled: false
                    },
                    states: {
                        inactive: {
                          opacity: 1
                        }
                      }
                    
                }
            },
    
            tooltip:{
                shared:true
            },
    
            xAxis: {
                type: 'datetime'
            },
    
            yAxis: {
                title:{text:'Crude by Rail Exports'+'('+')'}
            }
    
        });

    });


var select = document.getElementById('select');
select.addEventListener('change', (select) => {

    var units = select.target.value;
    
    Highcharts.charts.forEach((graph) => {
        //console.log(units);
        graph.update({
            data: {
                complete: function(options) {
                    options.series = options.series.filter(data => data.name === units)
                }
            }
        })
        
        graph.redraw();
        
    });

});




