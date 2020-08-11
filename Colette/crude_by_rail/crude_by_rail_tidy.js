function csvFormat(columns,filter_column='Units',filter_row='bbl per day'){
                    
    for (i=0;i<columns.length;i++){
        var filter_index = 0;
        if (filter_column === columns[i][0]){
            filter_index = i
        }
    };
    
    for (c=0;c<columns.length;c++){
    
        for (r=1;r<columns[c].length;r++){
            if (columns[filter_index][r] !== filter_row){
                delete columns[c][r];
            }
        }
    
    };
    
    for (c=0;c<columns.length;c++){
        columns[c] = columns[c].filter(function (el) {
            return el != null;
          });
    };
    
    delete columns[filter_index]
    columns = columns.filter(function (el) {
        return el != null;
    });

return columns

}

var select = document.getElementById('select');

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

                parsed: function(columns,filter_column='Units',filter_row='bbl per day'){
                    this.columns = csvFormat(columns=columns,filter_column=filter_column,filter_row=filter_row)
                },

                complete: function(options) {
                    options.xAxis.type = 'datetime';
                }

            },
    
            colors:['#054169','#FFBE4B','#5FBEE6','#559B37','#FF821E','#871455','#FFFFFF','#8c8c96','#42464B'],
    
            tooltip:{
                shared:true,
            },
    
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    day: '%e of %b'
                }
            },
    
            yAxis: {
                title:{text: 'bbl per day'}
            }
            
        });
        
    });


select.addEventListener('change', (select) => {

    var units = select.target.value;
        
    Highcharts.charts.forEach((graph) => {

        graph.update({

            data: {
                parsed: function(columns,filter_column='Units',filter_row=units){
                    this.columns = csvFormat(columns=this.columns,filter_column=filter_column,filter_row=filter_row)
                }
            },

            yAxis: {title: {text: units}}
        })
            
        graph.redraw(true);
            
    });
    
});


