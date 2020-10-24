import {
  cerPalette,
  prepareSeriesTidy,
  getUnique,
  fillDropUpdate,
  creditsClick,
} from "../../modules/util.js";

import creditData from "./CreditTables.json";
import scaleData from "./Scale.json";

export const jenniferRatings = () => {

  const defaultCompany = "NOVA Gas Transmission Ltd.";
  fillDropUpdate(
    "select_company_credit",
    getUnique(creditData, "Corporate Entity"),
    false,
    defaultCompany
  );

  const yRange = (creditData) => {
    const creditRange = getUnique(creditData,'Level')
    return [Math.min(...creditRange),26]
  }
  const [minY,maxY] = yRange(creditData)
 
  const creditFilters = { "Corporate Entity": defaultCompany };
  const creditColors = {
    "S&P": cerPalette["Night Sky"],
    DBRS: cerPalette["Sun"],
    "Moody's": cerPalette["Forest"],
  };

  const createCreditSeries = (creditData, creditFilters, creditColors) => {
    var creditSeriesTidy = prepareSeriesTidy(
      creditData,
      creditFilters,
      false,
      "Type",
      "Year",
      "Level",
      creditColors
    );

    creditSeriesTidy.map((series, seriesNum) => {
      series.type = "line";
      if (series.name == "S&P") {
        series.zIndex = 3;
      } else if (series.name == "Moody's") {
        series.zIndex = 2;
      } else {
        series.zIndex = 1;
      }
    });
    return creditSeriesTidy;
  };

  var creditSeries = createCreditSeries(
    creditData,
    creditFilters,
    creditColors
  );

  const createCreditChart = (creditSeries, scaleData,minY,maxY) => {

    return Highcharts.chart("container_ratings", {
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
        categories: true,
        max:maxY,
        min:minY-1,
        gridLineWidth: 1,
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
          
          var toolText = '<br><b>'+selectedYear+' - '+creditFilters["Corporate Entity"]+'</b>'+
          '<br>'+'Credit Quality: '+selectedScale
          for (const agency in overlaps) {
            toolText = toolText+'<br>'+agency+': '+scaleData[overlaps[agency]][agency]
          }
          return toolText
        },
      },
      series: creditSeries,
    });
  };
  var creditChart = createCreditChart(creditSeries, scaleData,minY,maxY);

  var selectCompanyCredit = document.getElementById("select_company_credit");
  selectCompanyCredit.addEventListener("change", (selectCompanyCredit) => {
    creditFilters["Corporate Entity"] = selectCompanyCredit.target.value;
    creditSeries = createCreditSeries(creditData, creditFilters, creditColors);
    creditChart = createCreditChart(creditSeries, scaleData,minY,maxY);
  });
};
