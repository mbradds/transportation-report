import {
  cerPalette,
  prepareSeriesTidy,
  getUnique,
  setTitle,
} from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";
import creditData from "../credit_ratings/CreditTables.json";
import scaleData from "../credit_ratings/Scale.json";

export const jenniferRatingsCross = () => {
  const ratingsColors = {
    DBRS: cerPalette["Sun"],
    "S&P": cerPalette["Night Sky"],
    "Moody's": cerPalette["Forest"],
  };

  var ratingsFilter = { Year: "2019" };

  const addColumns = (data) => {
    return data.map((row) => {
      row["Corporate Entity"] = row.series.split(" - ")[0];
      row["Type"] = row.series.split(" - ").slice(-1)[0];
      return row;
    });
  };

  const createCreditSeries = (creditData, ratingsFilter, ratingsColors) => {
    return prepareSeriesTidy(
      addColumns(creditData),
      ratingsFilter,
      false,
      "Type",
      "Corporate Entity",
      "Level",
      ratingsColors,
      1,
      "name"
    );
  };

  const yRange = (creditData) => {
    const creditRange = getUnique(creditData, "Level");
    return [Math.min(...creditRange), 26];
  };

  const createSortedSeries = (series) => {
    let average = (array) => array.reduce((a, b) => a + b) / array.length;
    var category = {};
    series.map((s) => {
      s.data.map((row) => {
        if (category.hasOwnProperty(row.name)) {
          category[row.name].push(row.y);
        } else {
          category[row.name] = [row.y];
        }
      });
    });

    for (const company in category) {
      category[company] = average(category[company]);
    }
    var sortableCategories = Object.keys(category).sort(function (a, b) {
      return category[b] - category[a];
    });

    var sortedSeries = series.map((s) => {
      var newSeries = [];
      var oldSeries = {};
      s.data.map((row) => {
        oldSeries[row.name] = row.y;
      });
      sortableCategories.map((ranked) => {
        if (oldSeries.hasOwnProperty(ranked)) {
          newSeries.push({ name: ranked, y: oldSeries[ranked] });
        } else {
          newSeries.push({ name: ranked, y: null });
        }
      });
      return { name: s.name, data: newSeries, color: s.color };
    });

    return sortedSeries;
  };

  const createChartCross = (series, minY, maxY) => {
    return Highcharts.chart("container_ratings_cross", {
      chart: {
        borderWidth: 1,
        type: "column",
      },

      credits: {
        text: "Source: S&P, DBRS, Moody's",
        enabled: false,
      },

      plotOptions: {
        series: {
          states: {
            inactive: {
              opacity: 1,
            },
          },
        },
        column: {
          stacking: null,
        },
      },

      legend: {
        align: "right",
        verticalAlign: "top",
        backgroundColor: "white",
        borderColor: cerPalette["Dim Grey"],
        borderWidth: 3,
        x: -15,
        y: 55,
        floating: true,
        title: {
          text: "Higher average rating to the left",
        },
      },

      xAxis: {
        categories: true,
        crosshair: true,
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
              "<br><b>" +
              scaleData[this.value]["S&P"] +
              ", " +
              scaleData[this.value]["Moody's"] +
              ", " +
              scaleData[this.value]["DBRS"] +
              "</b>"
            );
          },
        },
        plotLines: [
          {
            color: cerPalette["Ocean"],
            value: 17,
            width: 2,
            zIndex: 7,
            label: {
              text: "Non-Investment Grade Level",
              align: "right",
            },
          },
        ],
      },
      tooltip: {
        shared: true,
        formatter: function () {
          var toolText = `<b> ${this.points[0].key} </b><table>`;
          this.points.map((p) => {
            toolText += `<tr><td> <span style="color: ${
              p.color
            }">\u25CF</span> ${p.series.name}: </td><td style="padding:0"><b>${
              scaleData[p.y][p.series.name]
            }</b></td></tr>`;
          });
          return toolText + "</table>";
        },
      },
      series: series,
    });
  };

  const mainCreditYear = () => {
    const [minY, maxY] = yRange(creditData);
    var creditSeries = createCreditSeries(
      creditData,
      ratingsFilter,
      ratingsColors
    );
    var sortedSeries = createSortedSeries(creditSeries);
    var yearChart = createChartCross(sortedSeries, minY, maxY);
    var figure_title = document.getElementById("ratings_year_title");
    setTitle(figure_title, "22", ratingsFilter.Year, "Company Credit Ratings");

    $("#credit_years button").on("click", function () {
      $(".btn-credit > .btn").removeClass("active");
      $(this).addClass("active");
      var thisBtn = $(this);
      var btnText = thisBtn.text();
      var btnValue = thisBtn.val();
      $("#selectedVal").text(btnValue);
      ratingsFilter.Year = btnText;
      setTitle(
        figure_title,
        "22",
        ratingsFilter.Year,
        "Company Credit Ratings"
      );
      var creditSeries = createCreditSeries(
        creditData,
        ratingsFilter,
        ratingsColors
      );
      sortedSeries = createSortedSeries(creditSeries);
      yearChart.update({
        series: sortedSeries,
      });
    });
  };
  try {
    mainCreditYear();
  } catch (err) {
    console.log(err);
    errorChart("container_ratings_cross");
  }
};
