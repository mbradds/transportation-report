import { cerPalette, creditsClick, dateFormat } from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";
import settlementsData from "./settlements.json";
import inService from "./in_service.json";

export const cassandraSettlements = () => {
  const currentDate = () => {
    var today = new Date();
    today.setUTCHours(0);
    today.setUTCMinutes(0);
    today.setUTCSeconds(0);
    today.setUTCMilliseconds(0);
    return today.getTime();
  };

  const oneDay = 86400000;
  const today = currentDate();

  const legendNames = {
    company: {
      name: "Active settlement(s)",
      color: cerPalette["Night Sky"],
    },
  };

  const legendColors = {
    "Active settlement(s)": cerPalette["Night Sky"],
    "Settlements with fixed end date": cerPalette["Ocean"],
    "Settlements without fixed end date": cerPalette["Cool Grey"],
  };

  const dateColors = {
    "Pipeline in-service": cerPalette["Sun"],
    "Pipeline enters CER/NEB Jurisdiction": cerPalette["hcRed"],
  };

  const createInServiceSeries = (data, dates) => {
    const series = data.map((row) => {
      if (row.commodity == "Oil") {
        dates.oil.push(row["End Date"]);
      } else {
        dates.gas.push(row["End Date"]);
      }
      const determineColor = (row) => {
        if (row["Settlement Name"] == "Not in Service") {
          return dateColors["Pipeline in-service"];
        } else {
          return dateColors["Pipeline enters CER/NEB Jurisdiction"];
        }
      };
      return {
        name: row.Company,
        dateType: row["Settlement Name"],
        collapsed: true,
        color: determineColor(row),
        id: row.Company + "_inService",
        start: row["End Date"],
        end: row["End Date"] + oneDay * 70,
        commodity: row.Commodity,
        zIndex: 50,
      };
    });
    return [series, dates];
  };

  const getEndDate = (date) => {
    if (date === null) {
      return [today, cerPalette["Cool Grey"]];
    } else {
      return [date, cerPalette["Ocean"]];
    }
  };

  function sortByProperty(property) {
    return function (a, b) {
      if (a[property] > b[property]) return 1;
      else if (a[property] < b[property]) return -1;
      else return 0;
    };
  }

  const applyEndDateColors = (data) => {
    return data.map((row) => {
      var [endDate, seriesColor] = getEndDate(row["End Date"]);
      row.color = seriesColor;
      row.end = endDate;
      //row.end = endDate + oneDay * 900;
      return row;
    });
  };

  const settlementSeries = (data) => {
    const addRow = (row) => {
      return {
        name: row["Settlement Name"],
        id: row["Settlement Name"],
        parent: row.Company,
        color: row.color,
        start: row["Start Date"],
        end: row.end,
        commodity: row.Commodity,
      };
    };

    var seriesTracker = {};
    data = applyEndDateColors(data).sort(sortByProperty("start"));

    var dates = { oil: [], gas: [] };
    var seriesSettle = data.map((row) => {
      if (row.Commodity == "Oil") {
        dates.oil.push(...[row["Start Date"], row["End Date"]]);
      } else {
        dates.gas.push(...[row["Start Date"], row["End Date"]]);
      }
      if (seriesTracker.hasOwnProperty(row.Company)) {
        //the parent company is already in the series, add the sub settlement
        seriesTracker[row.Company].startDate.push(row["Start Date"]);
        seriesTracker[row.Company].endDate.push(row.end);
        return addRow(row);
      } else {
        //A new company is added to the series as the parent, and the current settlement is also added
        seriesTracker[row.Company] = {
          startDate: [row["Start Date"]],
          endDate: [row.end],
          commodity: row.Commodity,
        };
        return addRow(row);
      }
    });

    const companyCounter = (companyTracker, company) => {
      if (companyTracker.hasOwnProperty(company)) {
        companyTracker[company]++;
      } else {
        companyTracker[company] = 1;
      }
      return companyTracker;
    };

    const companyId = (companyTracker, company) => {
      if (companyTracker.hasOwnProperty(company)) {
        return company + "_" + companyTracker[company];
      } else {
        return company;
      }
    };

    const companySettles = [];
    var companyTracker = {}; //checks if a company has already been added so that the ID can be changed for other bars

    for (var [company, companyInfo] of Object.entries(seriesTracker)) {
      var [companyStartDates, companyEndDates] = [
        companyInfo.startDate,
        companyInfo.endDate,
      ];
      var [currentStart, currentEnd] = [
        companyStartDates[0],
        companyEndDates[0],
      ];
      //this map creates the timeline for each company
      companyEndDates.map((endDate, endNum) => {
        if (endDate > currentEnd) {
          currentEnd = endDate;
        }
        if (companyStartDates[endNum + 1] - endDate > oneDay) {
          companySettles.push({
            name: company,
            collapsed: true,
            color: cerPalette["Night Sky"],
            id: companyId(companyTracker, company),
            start: currentStart,
            end: currentEnd,
            commodity: companyInfo.commodity,
          });
          companyTracker = companyCounter(companyTracker, company);
          currentStart = companyStartDates[endNum + 1];
        } else {
          if (endNum == companyEndDates.length - 1) {
            companySettles.push({
              name: company,
              collapsed: true,
              color: cerPalette["Night Sky"],
              id: companyId(companyTracker, company),
              start: currentStart,
              end: currentEnd,
              commodity: companyInfo.commodity,
            });
            companyTracker = companyCounter(companyTracker, company);
          }
        }
      });
    }

    companySettles.sort(sortByProperty("start"));
    var [serviceSeries, dates] = createInServiceSeries(inService, dates);
    const commoditySeries = splitSeries([
      ...seriesSettle,
      ...companySettles,
      ...serviceSeries,
    ]);
    commoditySeries.oil.dates = dates.oil.filter((row) => row !== null);
    commoditySeries.gas.dates = dates.gas.filter((row) => row !== null);
    return commoditySeries;
  };

  const splitSeries = (series) => {
    var [oilData, gasData] = [[], []];
    series.map((row) => {
      if (row.commodity == "Oil") {
        oilData.push(row);
      } else if (row.commodity == "Gas") {
        gasData.push(row);
      }
    });
    return { oil: { data: oilData }, gas: { data: gasData } };
  };

  const inServiceLegend = (chartData, legendItem) => {
    let legendText = "";
    for (var i = 0; i < chartData.length; i++) {
      if (chartData[i].color == dateColors[legendItem]) {
        legendText = `<span style="font-weight:bold; color: ${dateColors[legendItem]}">&#9679 ${legendItem} date &nbsp &nbsp</span>`;
        break;
      }
    }
    return legendText;
  };

  const createSettlements = (seriesData, dates, div) => {
    return new Highcharts.ganttChart(div, {
      chart: {
        type: "gantt",
        borderWidth: 1,
        events: {
          load: function () {
            creditsClick(this, "https://www.cer-rec.gc.ca/en/index.html");
          },
        },
      },
      credits: {
        text: "Source: CER",
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          shadow: false,
          states: {
            hover: {
              enabled: false,
            },
          },
          events: {
            legendItemClick: function (e) {
              e.preventDefault();
            },
          },
        },
      },
      legend: {
        enabled: true,
        symbolPadding: 0,
        symbolWidth: 0,
        symbolHeight: 0,
        squareSymbol: false,
        useHTML: true,
        labelFormatter: function () {
          var legendText = "";
          for (const legendName in legendColors) {
            legendText += `<span style="font-weight:bold; color: ${legendColors[legendName]}">&#9679 ${legendName} &nbsp &nbsp</span>`;
          }
          legendText += `<br>`;
          const chartData = this.data;
          legendText += inServiceLegend(chartData, "Pipeline in-service");
          legendText += inServiceLegend(
            chartData,
            "Pipeline enters CER/NEB Jurisdiction"
          );
          return legendText;
        },
      },
      xAxis: [
        {
          min: Math.min(...dates),
          max: Math.max(...dates),
          currentDateIndicator: {
            width: 2,
            zIndex: 2,
            color: "black",
            label: {
              align: "right",
              x: -5,
              formatter: function () {
                return dateFormat(this.options.value) + " (today, UTC)";
              },
            },
          },
        },
      ],

      yAxis: {
        uniqueNames: true,
        labels: {
          formatter: function () {
            return this.value;
          },
        },
      },

      annotations: [
        {
          labelOptions: {
            verticalAlign: "top",
            overflow: "none",
          },
          labels: [
            {
              point: { x: -92, y: -30 },
              style: {
                fontWeight: "bold",
                fontSize: 11,
                color:
                  (Highcharts.theme && Highcharts.theme.textColor) || "grey",
              },
              backgroundColor: "white",
              borderColor: "white",
              text:
                "Click on a pipeline name<br>to view individual settlements",
            },
          ],
          draggable: "",
        },
      ],

      tooltip: {
        xDateFormat: "%Y-%m-%d",
        formatter: function () {
          var point = this.point,
            years = 1000 * 60 * 60 * 24 * 365,
            number = (point.x2 - point.x) / years;
          var years = Math.round(number * 100) / 100;
          if (this.color == cerPalette["Cool Grey"]) {
            var endText = "No set end date";
          } else {
            var endText = dateFormat(point.end);
          }
          if (point.parent == null && point.dateType == null) {
            return (
              `<b>${
                this.key
              }</b><table><tr><td>Active settlement(s) start:</td><td style="padding:0"><b>${dateFormat(
                point.start
              )}</b></td></tr>` +
              `<tr><td>Active settlement(s) end:</td><td style="padding:0"><b>${dateFormat(
                point.end
              )}</b></td></tr>` +
              `<tr><td> Active settlement(s) duration:</td><td style="padding:0"><b>${years} years</b></table>`
            );
          } else if (point.parent == null && point.dateType != null) {
            let dateTypeText = "";
            if (point.dateType == "Not in Service") {
              dateTypeText = "in-service date";
            } else {
              dateTypeText = "enter CER/NEB Jurisdiction date";
            }
            return `<b> ${point.name} - ${dateTypeText} </b><br> ${dateFormat(
              point.start
            )}`;
          } else {
            return (
              `<b>${point.parent} - ${this.key} </b><table>` +
              `<tr><td>Start:</td><td style="padding:0"><b> ${dateFormat(
                point.start
              )}</b>` +
              `<tr><td>End:</td><td style="padding:0"><b> ${endText}</b>` +
              `<tr><td>Duration:</td><td style="padding:0"><b> ${years} years</b>`
            );
          }
        },
      },
      series: [
        {
          name: legendNames["company"].name,
          data: seriesData,
          color: legendNames["company"].color,
        },
      ],
    });
  };

  const mainSettlements = () => {
    const getSeries = () => {
      try {
        return settlementSeries(settlementsData);
      } catch (err) {
        errorChart("container_settlements_oil");
        errorChart("container_settlements_gas");
      }
    };
    const seriesData = getSeries();
    try {
      const settlementChartOil = createSettlements(
        seriesData.oil.data,
        seriesData.oil.dates,
        "container_settlements_oil"
      );
      settlementChartOil.redraw();
    } catch (err) {
      errorChart("container_settlements_oil");
    }
    try {
      const settlementChartGas = createSettlements(
        seriesData.gas.data,
        seriesData.gas.dates,
        "container_settlements_gas"
      );
      settlementChartGas.redraw();
    } catch (err) {
      errorChart("container_settlements_gas");
    }
  };
  mainSettlements();
};
