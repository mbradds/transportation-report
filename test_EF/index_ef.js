document.addEventListener('DOMContentLoaded',()=>{
    const chart = Highcharts.chart('container', {

        chart:{
            type:'line', //line,bar,scatter,area,areaspline
            zoomType: 'x' //allows the user to focus in on the x or y (x,y,xy)
        },

        credits:{
            //enabled:false //gets rid of the "Highcharts logo in the bottom right"
            text:'Canada Energy Regulator',
            href:'https://www.cer-rec.gc.ca/index-eng.html'
        },

        title:{text:'first chart'},

        //data: {
        //    csvURL: 'https://github.com/mbradds/HighchartsData/blob/master/oil_price.csv'
        //},

        data: {
            //googleSpreadsheetKey: '1uAxEUIUmxmuLzkQYdAI8nVxQhMTR7TZOxCuzywXEerQ'
            googleSpreadsheetKey:'2PACX-1vQGpduJtsnGK7VnWJNG328lxTVyumz88IuJ2xv9pzyPuKm7Rvh4o4C_-q5WoA_sQ_n2w_AMr6LWuW7D'
        },

        colors:['#054169','#FFBE4B','#5FBEE6','#559B37','#FF821E','#871455','#FFFFFF','#8c8c96','#42464B'],

        tooltip:{
            //animation:false //tooltip jumps around
            //backgroundColor: #111111 
            //style:{
            //    color:'#ffffff' //changes the text color
            //}
            formatter() {
                return `x value- <strong>${this.x}</strong>. Y value - <strong>${this.y}</strong>`;
            },
            //shared: true
        },

        yAxis: {
            title:{text:'Crude Oil Prices'}
        }
    });

});