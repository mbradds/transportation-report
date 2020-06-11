document.addEventListener('DOMContentLoaded',()=>{
    Highcharts.chart('container',{

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
            title:{text:'Fruit'}
        },

        xAxis: {
            categories:['Apples','Bananas','Oranges'],
            alternateGridColor: '#5FBEE6'
        },

        series: [
            {
                name: 'John',
                data: [1,2,-5],
                negativeColor: 'red'
            },
            {
                name: 'Gerry',
                data: [2,2,2]
            }
    ]
    });
});