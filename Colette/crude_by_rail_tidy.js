
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
    
            data: {
                csvURL: 'https://raw.githubusercontent.com/mbradds/HighchartsData/master/crude_by_rail_tidy.csv',

                parsed: function(csv,filter_col='Units'){
      
                    // for (i=0;i<csv.length;i++){
                    //     var filter_index = 0;
                    //     if (filter_col === csv[i][0]){
                    //         filter_index = i
                    //     }
                    // }
                    // console.log(filter_index);

                    //for (i=0;i<csv.length;i++){
                    //    console.log(csv[i][1]);
                    //}
                    console.log(csv);

                },

                complete: function(options) {
                    options.series = options.series.filter(data => data.name === 'Volume');
                }

            },
    
            colors:['#054169','#FFBE4B','#5FBEE6','#559B37','#FF821E','#871455','#FFFFFF','#8c8c96','#42464B'],
    
            tooltip:{
                shared:true,
            },
    
            xAxis: {
                type: 'datetime'
            },
    
            yAxis: {
                title:{text: 'bbl per day'}
            }
            
        });
        
    });





