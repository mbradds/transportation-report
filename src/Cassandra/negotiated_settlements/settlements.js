import { cerPalette, creditsClick, dateFormat } from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";
import settleJson from "./settleJson.json";

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

  const createInServiceSeries = (data) => {
    const series = data.map((row) => {
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
        zIndex: 50,
      };
    });
    return series;
  };

  const getEndDate = (date, maxDate) => {
    if (date === null) {
      return [
        maxDate + oneDay * 365,
        legendColors["Settlements without fixed end date"],
      ];
    } else {
      return [date, legendColors["Settlements with fixed end date"]];
    }
  };

  function sortByProperty(property) {
    return function (a, b) {
      if (a[property] > b[property]) return 1;
      else if (a[property] < b[property]) return -1;
      else return 0;
    };
  }

  const applyEndDateColors = (data, maxDate) => {
    return data.map((row) => {
      var [endDate, seriesColor] = getEndDate(row["End Date"], maxDate);
      row.color = seriesColor;
      row.end = endDate;
      return row;
    });
  };

  const settlementSeries = (dataJson) => {
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

    const minDate = JSON.parse(dataJson["minDate"])[0]["date"];
    const maxDate = JSON.parse(dataJson["maxDate"])[0]["date"];

    var seriesTracker = {};
    var data = applyEndDateColors(
      JSON.parse(dataJson["dataSeries"]),
      maxDate
    ).sort(sortByProperty("start"));

    var seriesSettle = data.map((row) => {
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
    var serviceSeries = createInServiceSeries(
      JSON.parse(dataJson["dateSeries"])
    );
    const commoditySeries = [
      ...seriesSettle,
      ...companySettles,
      ...serviceSeries,
    ];
    return [commoditySeries, minDate, maxDate];
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

  const createSettlements = (seriesData, minDate, maxDate, div) => {
    return new Highcharts.ganttChart(div, {
      chart: {
        type: "gantt",
        marginRight: 0,
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
        symbolPadding: 1,
        symbolWidth: 1,
        symbolHeight: 1,
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
          min: minDate,
          max: maxDate + oneDay * 365,
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
          if (
            this.color == legendColors["Settlements without fixed end date"]
          ) {
            var endText = `No set end date <i>(Chart end date/duration is projected into the future, <br> 
                and does not necessarily terminate at the date indicated.)</i>`;
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
    try {
      const [seriesData, minDate, maxDate] = settlementSeries(
        settleJson["oil"]
      );
      const settlementChartOil = createSettlements(
        seriesData,
        minDate,
        maxDate,
        "container_settlements_oil"
      );
      settlementChartOil.redraw();
    } catch (err) {
      errorChart("container_settlements_oil");
    }
    try {
      const [seriesData, minDate, maxDate] = settlementSeries(
        settleJson["gas"]
      );
      const settlementChartGas = createSettlements(
        seriesData,
        minDate,
        maxDate,
        "container_settlements_gas"
      );
      settlementChartGas.redraw();
    } catch (err) {
      errorChart("container_settlements_gas");
    }
  };
  mainSettlements();
};
