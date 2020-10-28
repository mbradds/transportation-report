//TODO: add colors to the tooltip company names
//https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/column-basic
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
    false
  );

  var ratingAgencies = ["S&P", "Moody's", "DBRS"];

  fillDropUpdate("select_rating_agency", ratingAgencies, false, false);

  var onLoadCompanies = ["Enbridge Inc.", "TransCanada PipeLines Limited"];
  $("#select_company_credit_multi").selectpicker("val", onLoadCompanies);
  $("#select_rating_agency").selectpicker("val", ratingAgencies);

  const yRange = (creditData) => {
    const creditRange = getUnique(creditData, "Level");
    return [Math.min(...creditRange), 26];
  };
  const [minY, maxY] = yRange(creditData);

  const seriesColors = {
    "Maritimes & Northeast Pipeline Limited Partnership":
      cerPalette["Aubergine"],
    "Westcoast Energy Inc.": cerPalette["Cool Grey"],
    "Kinder Morgan Canada Limited and Kinder Morgan Cochin ULC": "#8bbc21",
    "NOVA Chemicals Corp.": "#2f7ed8",
    "TransCanada PipeLines Limited": cerPalette["Sun"],
    "NOVA Gas Transmission Ltd.": cerPalette["Flame"],
    "Trans Quebec & Maritimes Pipeline Inc.": cerPalette["Ocean"],
    "Alliance Pipeline Limited Partnership": cerPalette["Forest"],
    "Enbridge Inc.": cerPalette["Night Sky"],
    "Emera Inc.": "#0d233a",
    "Enbridge Pipelines Inc.": cerPalette["Dim Grey"],
  };

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

    creditSeriesTidy.map((series) => {
      series.type = "line";
      series.color = seriesColors[series.name.split(" - ")[0]];
      if (series.name.includes("DBRS")) {
        series.marker = { symbol: "triangle" };
      } else if (series.name.includes("Moody's")) {
        series.marker = { symbol: "circle" };
      } else if (series.name.includes("S&P")) {
        series.marker = { symbol: "square" };
      }
    });
    return creditSeriesTidy;
  };

  var creditSeries = createCreditSeries(creditData);

  const creditSeriesSubset = (creditSeries, defaultSelect, agencies) => {
    if (agencies) {
      creditSeries = agencies.map((agency) => {
        return creditSeries.filter((series) => series.name.includes(agency));
      });
      creditSeries = creditSeries.flat();
      if (!defaultSelect) {
        return creditSeries;
      }
    }

    if (!Array.isArray(defaultSelect)) {
      return creditSeries.filter((series) =>
        series.name.includes(defaultSelect)
      );
    } else {
      var subset = defaultSelect.map((company) => {
        return creditSeries.filter((series) => series.name.includes(company));
      });
      return subset.flat();
    }
  };

  var seriesSubset = creditSeriesSubset(
    creditSeries,
    onLoadCompanies,
    false
  );

  const createCreditChart = (series, scaleData, minY, maxY) => {
    return Highcharts.chart("container_ratings_multi", {
      chart: {
        type: "line",
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
        enabled: false,
      },

      yAxis: {
        title: { text: "Standardized Credit Rating" },
        gridLineWidth: 3,
        gridZIndex: 1,
        categories: true,
        max: maxY,
        min: minY - 1,
        labels: {
          formatter: function () {
            return (
              scaleData[this.value].creditQuality +
              " (" +
              scaleData[this.value]["S&P"] +
              ", " +
              scaleData[this.value]["Moody's"] +
              ", " +
              scaleData[this.value]["DBRS"] +
              ")"
            );
          },
        },
        plotBands: {
          borderColor: cerPalette["Ocean"],
          borderWidth: 2,
          from: 1,
          to: 17,
          zIndex: 2,
          label: {
            text: "Non-Investment Grade Level",
            align: "center",
          },
        },
      },
      xAxis: {
        categories: true,
      },
      tooltip: {
        formatter: function () {
          var selectedYear = this.x;
          var selectedRatings = this.y;
          var selectedScale = scaleData[this.y].creditQuality;
          var overlaps = {};
          this.series.chart.series.map((seriesi, i) => {
            seriesi.data.map((row, rowNum) => {
              if (row.category == selectedYear && row.y == selectedRatings) {
                overlaps[seriesi.name] = row.y;
              }
            });
          });
          var toolText =
            "<br><b>" +
            selectedYear +
            "</b>" +
            "<br>" +
            "Credit Quality: " +
            selectedScale;
          for (var agency in overlaps) {
            var agencyName = agency.split(" - ").slice(-1)[0];
            toolText =
              toolText +
              "<br>" +
              agency +
              ": " +
              scaleData[overlaps[agency]][agencyName];
          }
          return toolText;
        },
      },
      lang: {
        noData: "Select a pipeline to view credit ratings",
      },
      series: series,
    });
  };

  const getChartSeriesName = (chart) => {
    var [companyNames, agencyNames] = [[], []];
    chart.series.map((series) => {
      companyNames.push(series.name.split(" - ")[0]);
      agencyNames.push(series.name.split(" - ").slice(-1)[0]);
    });
    return [
      Array.from(new Set(companyNames)),
      Array.from(new Set(agencyNames)),
    ];
  };

  const addCreditSeries = (chart, companyName, agencies) => {
    var toAdd = creditSeriesSubset(creditSeries, companyName, agencies);
    toAdd.map((series) => {
      chart.addSeries(series);
    });
    chart.redraw();
  };

  const removeCreditSeries = (chart, companyName) => {
    var removeList = [];
    chart.series.map((seriesRemove, seriesNum) => {
      if (seriesRemove.name.includes(companyName)) {
        removeList.push(seriesNum);
      }
    });
    removeList.sort(function (a, b) {
      return b - a;
    });
    removeList.map((removeSeries) => {
      chart.series[removeSeries].remove(false);
    });
    chart.redraw();
  };

  const addLegend = (legendItems, legendCompany, legendSymbol) => {
    var [companyNames, agencyNames] = legendItems;
    var legendHTML = "";
    companyNames.map((company) => {
      legendHTML =
        legendHTML +
        '<span style="font-weight:bold; color:' +
        seriesColors[company] +
        '">' +
        company +
        "&nbsp &nbsp &nbsp" +
        "</span>";
    });

    var symbols = { DBRS: "&#9650", "Moody's": "&#11044", "S&P": "&#9632" };
    var symbolHTML = "";
    agencyNames.map((agency) => {
      symbolHTML =
        symbolHTML + symbols[agency] + " " + agency + "&nbsp &nbsp &nbsp";
    });
    legendCompany.innerHTML = legendHTML;
    legendSymbol.innerHTML = symbolHTML;
  };
  var pipeLegend = document.getElementById("container_pipeline_legend");
  var symbolLegend = document.getElementById("container_symbol_legend");
  var creditChart = createCreditChart(seriesSubset, scaleData, minY, maxY);

  addLegend(getChartSeriesName(creditChart), pipeLegend, symbolLegend);
  $("#select_company_credit_multi").on("change", function () {
    onLoadCompanies = $(this).val();
    var [chartCompanies, chartAgencies] = getChartSeriesName(creditChart);
    onLoadCompanies.map((sCompany) => {
      if (!chartCompanies.includes(sCompany)) {
        addCreditSeries(creditChart, sCompany, ratingAgencies);
      }
    });
    chartCompanies.map((cCompany) => {
      if (!onLoadCompanies.includes(cCompany)) {
        removeCreditSeries(creditChart, cCompany);
      }
    });
    addLegend(getChartSeriesName(creditChart), pipeLegend, symbolLegend);
  });

  $("#select_rating_agency").on("change", function () {
    ratingAgencies = $(this).val();
    var [chartCompanies, chartAgencies] = getChartSeriesName(creditChart);
    ratingAgencies.map((sAgency) => {
      if (!chartAgencies.includes(sAgency)) {
        addCreditSeries(creditChart, onLoadCompanies, [sAgency]);
      }
    });
    chartAgencies.map((cAgency) => {
      if (!ratingAgencies.includes(cAgency)) {
        removeCreditSeries(creditChart, cAgency);
      }
    });
    addLegend(getChartSeriesName(creditChart), pipeLegend, symbolLegend);
  });
};
