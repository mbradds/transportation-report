import {
  cerPalette,
  prepareSeriesTidy,
  getUnique,
  fillDropUpdate,
} from "../../modules/util.js";

import creditData from "../credit_ratings/CreditTables.json";
import scaleData from "../credit_ratings/Scale.json";

export const jenniferRatingsCross = () => {
  const ratingsColors = {
    DBRS: cerPalette["Sun"],
    "S&P": cerPalette["Dim Grey"],
    "Moody's": cerPalette["Forest"],
  };

  const ratingsFilter = { Year: "2019" };

  const setTitle = (figure_title, filters) => {
    figure_title.innerText = `Figure 22: Company Credit Ratings, ${filters.Year}`;
  };

  var creditSeries = prepareSeriesTidy(
    creditData,
    ratingsFilter,
    false,
    "Type",
    "Corporate Entity",
    "Level",
    ratingsColors,
    1,
    "name"
  );

  const yRange = (creditData) => {
    const creditRange = getUnique(creditData, "Level");
    return [Math.min(...creditRange), 26];
  };
  const [minY, maxY] = yRange(creditData);

  const createSortedSeries = (series) => {
    let average = (array) => array.reduce((a, b) => a + b) / array.length;
    var category = {};
    series.map((s, seriesNum) => {
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

  var sortedSeries = createSortedSeries(creditSeries);

  const createChartCross = (series) => {
    return Highcharts.chart("container_ratings_cross", {
      chart: {
        borderWidth: 1,
        type: "column",
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

      xAxis: {
        categories: true,
        crosshair: true,
        title: {
          text:
            "CER Regulated Companies (higher average credit rating to the left)",
        },
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
        useHTML: true,
        formatter: function () {
          var bodyHTML = "";
          const selectedCompany = this.key;
          this.series.chart.series.map((series) => {
            var agency = series.name;
            series.data.map((row) => {
              if (row.name == selectedCompany && row.y !== null) {
                var rating = row.y;
                bodyHTML =
                  bodyHTML + "<br>" + agency + ": " + scaleData[rating][agency];
              }
            });
          });
          const headerHTML = "<b>" + selectedCompany + "</b>";
          return headerHTML + bodyHTML;
        },
      },
      series: series,
    });
  };

  const mainCreditYear = () => {
    var yearChart = createChartCross(sortedSeries);
    var figure_title = document.getElementById("ratings_year_title");
    setTitle(figure_title, ratingsFilter);

    $("#credit_years button").on("click", function () {
      var thisBtn = $(this);
      thisBtn.addClass("active").siblings().removeClass("active");
      var btnText = thisBtn.text();
      var btnValue = thisBtn.val();
      $("#selectedVal").text(btnValue);
      ratingsFilter.Year = btnText;
      setTitle(figure_title, ratingsFilter);
      var creditSeries = prepareSeriesTidy(
        creditData,
        ratingsFilter,
        false,
        "Type",
        "Corporate Entity",
        "Level",
        ratingsColors,
        1,
        "name"
      );
      sortedSeries = createSortedSeries(creditSeries);
      yearChart.update({
        series: sortedSeries,
      });
    });

    // You can use this to set default value
    $('#credit_years button[value="2019"]').click();
  };
  mainCreditYear();
};
