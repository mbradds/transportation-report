import {
  cerPalette,
  prepareSeriesTidy,
  getUnique,
  fillDropUpdate,
} from "../../modules/util.js";

import creditData from "./CreditTables.json";
import scaleData from "./Scale.json";

export const jenniferRatingsMulti = () => {

  fillDropUpdate(
    "select_company_credit_multi",
    getUnique(creditData, "Corporate Entity"),
    false,
    "NOVA Gas Transmission Ltd."
  );

  const yRange = (creditData) => {
    const creditRange = getUnique(creditData,'Level')
    return [Math.min(...creditRange),26]
  }
  const [minY,maxY] = yRange(creditData)
 


  const createCreditSeries = (creditData) => {
    var creditSeriesTidy = prepareSeriesTidy(
      creditData,
      false,
      false,
      "series",
      "Year",
      "Level",
      false
    );

    creditSeriesTidy.map((series, seriesNum) => {
      series.type = "line";
      if (series.name.includes('Alliance')){
        series.color = cerPalette['Night Sky']
      } else if (series.name.includes('NOVA Gas')){
        series.color = cerPalette['Sun']
      } else if (series.name.includes('Emera Inc')){
        series.color = cerPalette['Aubergine']
      } else if (series.name.includes('Enbridge Pipelines Inc.')){
        series.color = cerPalette['Flame']
      } else if (series.name.includes('Enbridge Inc.')){
        series.color = cerPalette['Dim Grey']
      } else if (series.name.includes('Kinder Morgan Canada')){
        series.color = cerPalette['Cool Grey']
      } else if (series.name.includes('Maritimes & Northeast')){
        series.color = cerPalette["Forest"]
      } else if (series.name.includes('NOVA Chemicals')){
        series.color = cerPalette["Ocean"]
      } else if (series.name.includes('Trans Quebec')){
        series.color = cerPalette["Flame"]
      } else if (series.name.includes('TransCanada Pipelines')){
        series.color = cerPalette["Ocean"]
      } else if (series.name.includes('Westcoast Energy')){
        series.color = cerPalette["Night Sky"]
      }
      if (series.name.includes('DBRS')){
        series.marker = {symbol:'triangle'}
      } else if (series.name.includes("Moody's")){
        series.marker = {symbol:'circle'}
      } else if (series.name.includes("S&P")){
        series.marker = {symbol:'square'}
      }

    });
    return creditSeriesTidy;
  };

  var creditSeries = createCreditSeries(
    creditData,
  );

  var creditSeriesSubset = (creditSeries,defaultSelect) => {
    return creditSeries.filter(series => series.name.includes(defaultSelect))
  }

  var seriesSubset = creditSeriesSubset(creditSeries,'NOVA Gas Transmission Ltd.')

  const createCreditChart = (series, scaleData,minY,maxY) => {

    return Highcharts.chart("container_ratings_multi", {
      chart: {
        type: "line",
        borderWidth: 1,
      },

      plotOptions: {
        line: {
          marker: {
            enabled: true,
          },
        },
      },

      credits: {
        text: "Source: S&P, DBRS, Moody's",
      },


      legend: {
        enabled: true,
      },

      yAxis: {
        title: { text: "Standardized Credit Rating" },
        gridLineWidth: 3,
        gridZIndex: 1,
        categories: true,
        max:maxY,
        min:minY-1,
        labels: {
          formatter: function () {
            return scaleData[this.value].creditQuality;
          },
        },
        plotBands: {
          borderColor: cerPalette['Ocean'],
          borderWidth: 2,
          from: 1, 
          to: 17,
          zIndex: 2,
          label: { 
            text: 'Non-Investment Grade Level', 
            align: 'center', 
          },
        },
      },
      xAxis: {
        categories: true,
      },
      tooltip: {
        formatter: function () {
          var selectedYear = this.x
          var selectedRatings = this.y
          var selectedScale = scaleData[this.y].creditQuality
          var overlaps = {}
          this.series.chart.series.map((seriesi,i)=>{
            seriesi.data.map((row,rowNum) => {
              if (row.category == selectedYear && row.y == selectedRatings) {
                overlaps[seriesi.name] = row.y
              }
            })
          })
          var toolText = '<br><b>'+selectedYear+'</b>'+
          '<br>'+'Credit Quality: '+selectedScale
          for (var agency in overlaps) {
            var agencyName = agency.split(" - ").slice(-1)[0]
            toolText = toolText+'<br>'+agency+': '+scaleData[overlaps[agency]][agencyName]
          }
          return toolText
        },
      },
      lang: {
        noData: "Select a pipeline to view credit ratings",
      },
      series: series,
    });
  };

  const getChartSeriesName = (chart) => {
    var inChart = chart.series.map((series)=> {
      return series.name.split(" - ")[0]
    })
    return Array.from(new Set(inChart))
  }

  const addCreditSeries = (chart,companyName) => {
    var toAdd = creditSeriesSubset(creditSeries,companyName)
    toAdd.map((series)=>{
      chart.addSeries(series)
    })
    chart.redraw()
  }

  const removeCreditSeries = (chart,companyName) => {
    var removeList = []
    chart.series.map((seriesRemove,seriesNum)=>{
      if (seriesRemove.name.includes(companyName)){
        removeList.push(seriesNum)
      } 
    })
    removeList.sort(function(a, b){return b-a})
    removeList.map((removeSeries)=>{chart.series[removeSeries].remove(false)})
    chart.redraw()
  }

  var creditChart = createCreditChart(seriesSubset, scaleData,minY,maxY);
  $("#select_company_credit_multi").on('change',function() {
    var selectedCompanies = $(this).val();
    var chartCompanies = getChartSeriesName(creditChart)
    selectedCompanies.map((sCompany) => {
      if (!chartCompanies.includes(sCompany)) {
        addCreditSeries(creditChart,sCompany)
      }
    })
    chartCompanies.map((cCompany) => {
      if (!selectedCompanies.includes(cCompany)){
        removeCreditSeries(creditChart,cCompany)
      } 
    })

  });

};
