async function chart1(chart_2) {
    var chart = {
        type: 'chart1'
    }
    return chart
}

async function chart2(chart_1) {
    var chart = {
        type: 'chart2'
    }
    return chart
}


//chart_1 = chart1(chart_2)
//chart_2 = chart2(chart_1)
var [chart_1, chart_2] = await Promise.all([chart1(chart_2),chart2(chart_1)])