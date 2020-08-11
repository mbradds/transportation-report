//var select = document.getElementById('select');

function crudeByRail(data_units = 'm3 per day'){

    document.addEventListener('DOMContentLoaded',()=>{
        var hc = Highcharts.chart('container',{
    
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
        
                data: {
                    csvURL: 'https://raw.githubusercontent.com/mbradds/HighchartsData/master/crude_by_rail_units.csv',
                    
                    complete: function(options,unit_select=data_units) {
                        options.series = options.series.filter(data => data.name === unit_select)
                        
                    },

                
                },
        
                colors:['#054169','#FFBE4B','#5FBEE6','#559B37','#FF821E','#871455','#FFFFFF','#8c8c96','#42464B'],
        
                tooltip:{
                    shared:true,
                },
        
                xAxis: {
                    type: 'datetime'
                },
        
                yAxis: {
                    title:{text: data_units}
                }
                
            });
            

        });

    return hc
};






//var units = select.target.value;
crudeByRail(data_units='bbl per day');

//select.addEventListener('change', (select) => {

    //var units = select.target.value;
    
    
/*     Highcharts.charts.forEach((graph) => {
        //console.log(units);
        graph.update({
            data: {
                complete: function(options) {
                    options.series = options.series.filter(data => data.name === units)
                },
                name : units
            },
            yAxis: {title: {text: units}}
        }) */
        
//        chart.redraw();
        
//    });





