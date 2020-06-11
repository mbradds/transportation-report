document.addEventListener('DOMContentLoaded',()=>{
    const chart = Highcharts.chart('container', {

        chart:{
            type:'line', //line,bar,scatter,area,areaspline
            zoomType: 'x', //allows the user to focus in on the x or y (x,y,xy)
            borderColor: 'black',
            borderWidth: 1,
        },

        credits:{
            //enabled:false //gets rid of the "Highcharts logo in the bottom right"
            text:'Canada Energy Regulator',
            href:'https://www.cer-rec.gc.ca/index-eng.html'
        },

        title:{text:'Global Crude Prices'},

        //data: {
        //    csvURL: 'https://github.com/mbradds/HighchartsData/blob/master/oil_price.csv'
        //},

        data: {
            //googleSpreadsheetKey: '1uAxEUIUmxmuLzkQYdAI8nVxQhMTR7TZOxCuzywXEerQ'
            csv: document.getElementById('csv').innerHTML
        },

        colors:['#054169','#FFBE4B','#5FBEE6','#559B37','#FF821E','#871455','#FFFFFF','#8c8c96','#42464B'],

        plotOptions: {
            series: {
                stickyTracking:false
            //    marker: {
            //        enabled: true
            //    }
            }
        },

        tooltip:{
            //animation:false //tooltip jumps around
            //backgroundColor: #111111 
            //style:{
            //    color:'#ffffff' //changes the text color
            //}
            formatter() {
                return `x value- <strong>${this.x}</strong>. Y value - <strong>${this.y}</strong>`;
            }
            //shared: true
        },

        yAxis: {
            title:{text:'Crude Oil Prices'}
        }

    });

});