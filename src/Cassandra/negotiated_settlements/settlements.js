import { cerPalette, creditsClick } from "../../modules/util.js";

import settlementsData from "./settlements.json";

export const cassandraSettlements = () => {
  const currentDate = () => {
    var today = new Date(),
      day = 1000 * 60 * 60 * 24;
    today.setUTCHours(0);
    today.setUTCMinutes(0);
    today.setUTCSeconds(0);
    today.setUTCMilliseconds(0);
    return today.getTime();
  };

  var today = currentDate();

  const getEndDate = (date) => {
    if (date === null) {
      return [today, cerPalette["Aubergine"]];
    } else {
      return [date, cerPalette["Ocean"]];
    }
  };

  const settlementSeries = (data) => {
    var seriesTracker = {};
    var seriesSettle = [];
    var dates = [];

    data.map((row, rowNum) => {
      dates.push(row["Start Date"]);
      dates.push(row["End Date"]);
      var [endDate, seriesColor] = getEndDate(row["End Date"]);

      if (seriesTracker.hasOwnProperty(row.Company)) {
        //the parent company is already in the series
        seriesTracker[row.Company].startDate.push(row["Start Date"]);
        seriesTracker[row.Company].endDate.push(endDate);
        seriesSettle.push({
          name: row["Settlement Name"],
          id: row["Settlement Name"],
          parent: row.Company,
          color: seriesColor,
          start: row["Start Date"],
          end: endDate,
        });
      } else {
        //A new company is added to the series as the parent, and the current settlement is also added
        seriesTracker[row.Company] = {
          startDate: [row["Start Date"]],
          endDate: [endDate],
        };
        seriesSettle.push({
          name: row.Company,
          collapsed: true,
          color: cerPalette["Night Sky"],
          id: row.Company,
          start: row["Start Date"],
          end: endDate,
        });
        seriesSettle.push({
          name: row["Settlement Name"],
          id: row["Settlement Name"],
          parent: row.Company,
          color: seriesColor,
          start: row["Start Date"],
          end: endDate,
        });
      }
    });

    //get the start and end date for each company across all settlements
    for (const company in seriesTracker) {
      seriesTracker[company].startDate = Math.min(
        ...seriesTracker[company].startDate
      );
      seriesTracker[company].endDate = Math.max(
        ...seriesTracker[company].endDate
      );
    }

    seriesSettle.map((s, seriesNum) => {
      if (seriesTracker.hasOwnProperty(s.name)) {
        s.start = seriesTracker[s.name].startDate;
        s.end = seriesTracker[s.name].endDate;
      }
    });

    dates = dates.filter((row) => row !== null);

    return [seriesSettle, seriesTracker, dates];
  };
  var [seriesSettle, seriesTracker, dates] = settlementSeries(settlementsData);

  const legendNames = {
    company: {
      name: "Company Negotiated Settlement",
      color: cerPalette["Night Sky"],
    },
    end: {
      name: "Negotiated Settlement (fixed end date)",
      color: cerPalette["Ocean"],
    },
    noEnd: {
      name: "Negotiated Settlement (no fixed end date)",
      color: cerPalette["Aubergine"],
    },
  };
  const legendColors = {
    "Company Negotiated Settlement": cerPalette["Night Sky"],
    "Negotiated Settlement (fixed end date)": cerPalette["Ocean"],
    "Negotiated Settlement (no fixed end date)": cerPalette["Aubergine"],
  };

  const createSettlements = (seriesSettle) => {
    return Highcharts.ganttChart("container_settlements", {
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
          return (
            '<span style="font-weight:bold; color:' +
            legendColors[this.name] +
            '">' +
            this.name +
            "</span>"
          );
        },
      },
      xAxis: [
        {
          min: Math.min(...dates),
          max: Math.max(...dates),
          currentDateIndicator: {
            width: 2,
            color: "black",
            label: {
              format: "%Y-%m-%d",
            },
          },
        },
      ],

      tooltip: {
        xDateFormat: "%Y-%m-%d",
      },
      series: [
        {
          showInLegend: true,
          color: legendNames["company"].color,
          name: legendNames["company"].name,
          data: seriesSettle,
        },
        {
          name: legendNames["end"].name,
          data: null,
          color: legendNames["end"].color,
          showInLegend: true,
        },
        {
          name: legendNames["noEnd"].name,
          data: null,
          color: legendNames["noEnd"].color,
          showInLegend: true,
        },
      ],
    });
  };
  createSettlements(seriesSettle);
};
