import { cerPalette, getUnique } from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";
import creditData from "./CreditTables.json";
import scaleData from "./Scale.json";
import Series from "highseries";

const createChart = (lang) => {
  var ratingAgencies = ["S&P", "Moody's", "DBRS"];

  const selectDefaultMultiple = (select_name, optionsToSelect) => {
    var select = document.getElementById(select_name);
    for (var i = 0, l = select.options.length, o; i < l; i++) {
      o = select.options[i];
      if (optionsToSelect.indexOf(o.text) != -1) {
        o.selected = true;
      }
    }
  };

  var symbols = { DBRS: "&#9650", "Moody's": "&#9679", "S&P": "&#9632" };
  var onLoadCompanies = ["Enbridge Inc.", "TransCanada PipeLines Limited"];
  selectDefaultMultiple("select_company_credit_multi", onLoadCompanies);
  selectDefaultMultiple("select_rating_agency", ratingAgencies);

  const yRange = (creditData) => {
    const creditRange = getUnique(creditData, "Level");
    return [Math.min(...creditRange), 26];
  };
  const [minY, maxY] = yRange(creditData);

  const seriesColors = {
    "Maritimes & Northeast Pipeline Limited Partnership":
      cerPalette["Aubergine"],
    "Westcoast Energy Inc.": cerPalette["Cool Grey"],
    "Kinder Morgan Canada Limited": cerPalette["hcGreen"],
    "NOVA Chemicals Corp.": cerPalette["hcPurple"],
    "TransCanada PipeLines Limited": cerPalette["Sun"],
    "NOVA Gas Transmission Ltd.": cerPalette["Flame"],
    "Trans Quebec & Maritimes Pipeline Inc.": cerPalette["Ocean"],
    "Alliance Pipeline Ltd.": cerPalette["Forest"],
    "Enbridge Inc.": cerPalette["Night Sky"],
    "Emera Inc.": cerPalette["hcRed"],
    "Enbridge Pipelines Inc.": cerPalette["Dim Grey"],
    "TC Energy Corporation": cerPalette["hcLightBlue"],
  };

  const createCreditSeries = (creditSeriesTidy) => {
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

      legend: {
        enabled: false,
      },

      yAxis: {
        title: { text: lang.yAxis },
        gridLineWidth: 3,
        gridZIndex: 1,
        categories: true,
        max: maxY,
        min: minY - 1,
        labels: {
          formatter: function () {
            return `${scaleData[this.value].creditQuality}<b> - ${
              scaleData[this.value]["S&P"]
            },
              ${scaleData[this.value]["Moody's"]},
              ${scaleData[this.value]["DBRS"]}</b>`;
          },
        },
        plotBands: {
          borderColor: cerPalette["Ocean"],
          borderWidth: 2,
          from: 1,
          to: 16,
          zIndex: 2,
          label: {
            text: "Non-Investment Grade",
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
          this.series.chart.series.map((s) => {
            s.data.map((row) => {
              if (row.category == selectedYear && row.y == selectedRatings) {
                overlaps[s.name] = { y: row.y, color: s.color };
              }
            });
          });
          var toolText = `<b>${selectedYear}</b><table>`;
          toolText += `<tr><td>${lang.tooltip}</td><td style="padding:0"><b> ${selectedScale} </b></td></tr>`;
          for (var agency in overlaps) {
            var agencyName = agency.split(" - ").slice(-1)[0];
            toolText += `<tr><td> <span style="color: ${
              overlaps[agency].color
            }">${
              symbols[agencyName]
            }</span> ${agency}: </td><td style="padding:0"><b>${
              scaleData[overlaps[agency].y][agencyName]
            }</b></td></tr>`;
          }
          return toolText + "</table>";
        },
      },
      lang: {
        noData: lang.noData,
      },
      series: series,
    });
  };

  const mainRatingsMultiple = () => {
    let series = new Series({
      data: creditData,
      xCol: "Year",
      yCols: "series",
      valuesCol: "Level",
      colors: seriesColors,
    });
    var creditSeries = createCreditSeries(series.hcSeries);
    var seriesSubset = creditSeriesSubset(creditSeries, onLoadCompanies, false);
    const getChartSeriesName = (chart) => {
      var [companyNames, agencyNames] = [[], []];
      chart.series.map((series) => {
        if (series.name.includes("-")) {
          companyNames.push(series.name.split(" - ")[0]);
          agencyNames.push(series.name.split(" - ").slice(-1)[0]);
        }
      });
      return [
        Array.from(new Set(companyNames)),
        Array.from(new Set(agencyNames)),
      ];
    };

    const addCreditSeries = (chart, companyName, agencies) => {
      creditSeriesSubset(creditSeries, companyName, agencies).map((series) => {
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
        legendHTML +=
          '<span style="font-weight:bold; color:' +
          seriesColors[company] +
          '">' +
          company +
          "&nbsp &nbsp &nbsp" +
          "</span>";
      });

      var symbolHTML = "";
      agencyNames.map((agency) => {
        symbolHTML += symbols[agency] + " " + agency + "&nbsp &nbsp &nbsp";
      });
      legendCompany.innerHTML = legendHTML;
      legendSymbol.innerHTML = symbolHTML;
    };

    var pipeLegend = document.getElementById("container_pipeline_legend");
    var symbolLegend = document.getElementById("container_symbol_legend");
    var creditChart = createCreditChart(seriesSubset, scaleData, minY, maxY);

    addLegend(
      getChartSeriesName(creditChart),
      pipeLegend,
      symbolLegend,
      symbols
    );
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
  try {
    return mainRatingsMultiple();
  } catch (err) {
    return errorChart("container_ratings_multi");
  }
};

export function jenniferRatingsMulti(lang) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(createChart(lang)), 0);
  });
}
