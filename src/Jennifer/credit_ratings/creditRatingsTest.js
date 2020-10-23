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

  const defaultCompany = "Enbridge Inc.";
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
        //plotBorderWidth: 1,
      },

      plotOptions: {
        line: {
          marker: {
            enabled: true,
          },
        },
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
          //color: cerPalette['Ocean'],
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
          // this.series.chart.series.map((seriesi,i)=>{
          //   console.log(seriesi.data)
          // })
          return (
            "<b>" +
            this.series.name +
            " - " +
            this.x +
            " - " +
            creditFilters["Corporate Entity"] +
            "</b>" +
            "<br>" +
            "Credit Rating: " +
            scaleData[this.y][this.series.name] +
            "<br>" +
            "Credit Quality: " +
            scaleData[this.y].creditQuality +
            "<br>" +
            "Investment Grade?: " +
            scaleData[this.y].investmentGrade
          );
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
