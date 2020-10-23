import { cerPalette } from "../../modules/util.js";

// import settlementsData from "./settlements.json";

const getData = (Url) => {
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET", Url, false);
  Httpreq.send(null);
  return Httpreq.responseText;
};

const settlementsData = JSON.parse(
  getData("/src/Cassandra/negotiated_settlements/settlements.json")
);

const legendNames = {
  company: {
    name: "Active settlement(s)",
    color: cerPalette["Night Sky"],
  },
  end: {
    name: "Settlements with fixed end date",
    color: cerPalette["Ocean"],
  },
  noEnd: {
    name: "Settlements without fixed end date",
    color: cerPalette["Cool Grey"],
  },
};

const legendColors = {
  "Active settlement(s)": cerPalette["Night Sky"],
  "Settlements with fixed end date": cerPalette["Ocean"],
  "Settlements without fixed end date": cerPalette["Cool Grey"],
};

const filters = { Commodity: "All" };

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
    return [today, cerPalette["Cool Grey"]];
  } else {
    return [date, cerPalette["Ocean"]];
  }
};

const settlementSeries = (data, filters) => {
  var seriesTracker = {};
  var seriesSettle = [];
  var dates = [];

  if (filters.Commodity !== "All") {
    data = data.filter((row) => row.Commodity == filters.Commodity);
  }

  data.map((row, rowNum) => {
    dates.push(row["Start Date"]);
    dates.push(row["End Date"]);
    var [endDate, seriesColor] = getEndDate(row["End Date"]);

    if (seriesTracker.hasOwnProperty(row.Company)) {
      //the parent company is already in the series, add the sub settlement
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
        name: row["Settlement Name"],
        id: row["Settlement Name"],
        parent: row.Company,
        color: seriesColor,
        start: row["Start Date"],
        end: endDate,
      });
    }
  });

  const companySettles = [];

  for (const company in seriesTracker) {
    var companyStartDates = seriesTracker[company].startDate;
    var companyEndDates = seriesTracker[company].endDate;
    var currentStart = companyStartDates[0];
    var currentValid = 0
    companyEndDates.map((endDate, endNum) => {
      if (companyStartDates[endNum + 1] - endDate > 86400000) {
        //console.log(companyStartDates[endNum + 1] - endDate)
        companySettles.push({
          name: company,
          collapsed: true,
          color: cerPalette["Night Sky"],
          id: company,
          start: currentStart,
          end: companyEndDates[endNum],
        });
        currentStart = companyStartDates[endNum + 1];
      } else {
          if (endNum == companyEndDates.length-1){
            companySettles.push({
                name: company,
                collapsed: true,
                color: cerPalette["Night Sky"],
                id: company,
                start: currentStart,
                end: companyEndDates[endNum],
              });
          }
      }
    });
  }
  
  dates = dates.filter((row) => row !== null);

  return [[...seriesSettle, ...companySettles],dates];
};

const [seriesData,dates] = settlementSeries(
    settlementsData,
    filters
  );

//console.log(seriesData)

const createSettlements = (seriesData) => {

  return Highcharts.ganttChart("container_settlements", {
    chart: {
      type: "gantt",
      borderWidth: 1,
    },
    yAxis: {
    	uniqueNames:true
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
        name: legendNames["company"].name,
        data: seriesData,
        color: legendNames["company"].color,
      },
    ],
  });
};

const settlementChart = createSettlements(seriesData);


