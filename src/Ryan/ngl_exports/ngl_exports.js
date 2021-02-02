import {
  cerPalette,
  creditsClick,
  conversions,
  tooltipPoint,
} from "../../modules/util.js";
import Series from "highseries";
import { errorChart } from "../../modules/charts.js";
import nglData from "./origin.json";

const createChart = (lang) => {
  var units = conversions("Mb/d to m3/d", "Mb/d", "Mb/d");
  const nglFilters = {
    Product: "p",
    Origin: "ca",
  };
  const setTitle = (figure_title, filters) => {
    let fullProducts = { p: "Propane", b: "Butane" };
    let fullOrigin = {
      qc: "Quebec",
      nb: "New Brunswick",
      sk: "Saskatchewan",
      on: "Ontario",
      ca: "Canada",
      ab: "Alberta",
      mb: "Manitoba",
      bc: "British Columbia",
    };
    figure_title.innerText = `${lang.figureNum} ${fullOrigin[filters.Origin]} ${
      fullProducts[filters.Product]
    } ${lang.exports}`;
  };
  const nglColors = {
    Pipeline: cerPalette["Sun"],
    Railway: cerPalette["Night Sky"],
    Truck: cerPalette["Forest"],
    Marine: cerPalette["Ocean"],
  };

  const createNglChart = (seriesData, units) => {
    return new Highcharts.chart("container_ngl", {
      chart: {
        type: "line",
        zoomType: "x",
        borderWidth: 1,
        events: {
          load: function () {
            creditsClick(
              this,
              "https://apps.cer-rec.gc.ca/CommodityStatistics/Statistics.aspx?language=english"
            );
          },
        },
      },

      credits: {
        text: lang.source,
      },

      plotOptions: {
        series: {
          connectNulls: false,
          states: {
            inactive: {
              opacity: 1,
            },
            hover: {
              enabled: false,
            },
          },
        },
      },

      tooltip: {
        shared: true,
        pointFormat: tooltipPoint(units.unitsCurrent),
      },

      xAxis: {
        type: "datetime",
        crosshair: true,
      },

      yAxis: {
        title: { text: units.unitsCurrent },
        endOnTick: false,
      },

      lang: {
        noData: lang.noData,
      },

      series: seriesData,
    });
  };

  const mainNglExports = () => {
    let series = new Series({
      data: nglData,
      xCol: "Period",
      yCols: ["Pipeline", "Railway", "Truck", "Marine"],
      colors: nglColors,
      filters: nglFilters,
    });

    var figure_title = document.getElementById("ngl_title");
    setTitle(figure_title, nglFilters);
    var nglChart = createNglChart(series.hcSeries, units);

    var selectProductNgl = document.getElementById("select_product_ngl");
    selectProductNgl.addEventListener("change", (selectProductNgl) => {
      nglFilters.Product = selectProductNgl.target.value;
      setTitle(figure_title, nglFilters);
      series.update({ data: nglData, filters: nglFilters });
      nglChart = createNglChart(series.hcSeries, units);
    });

    var selectRegionNgl = document.getElementById("select_region_ngl");
    selectRegionNgl.addEventListener("change", (selectRegionNgl) => {
      nglFilters.Origin = selectRegionNgl.target.value;
      setTitle(figure_title, nglFilters);
      series.update({ data: nglData, filters: nglFilters });
      nglChart = createNglChart(series.hcSeries, units);
    });

    var selectUnitsNgl = document.getElementById("select_units_ngl");
    selectUnitsNgl.addEventListener("change", (selectUnitsNgl) => {
      units.unitsCurrent = selectUnitsNgl.target.value;
      if (units.unitsCurrent !== units.unitsBase) {
        series.update({
          data: nglData,
          transform: {
            conv: [units.conversion, units.type],
            decimals: 2,
          },
        });
      } else {
        series.update({
          data: nglData,
          transform: {
            conv: undefined,
            decimals: undefined,
          },
        });
      }
      nglChart.update({
        series: series.hcSeries,
        yAxis: {
          title: { text: units.unitsCurrent },
        },
        tooltip: {
          pointFormat: tooltipPoint(units.unitsCurrent),
        },
      });
    });
  };
  try {
    return mainNglExports();
  } catch (err) {
    return errorChart("container_ngl");
  }
};

export function ryanNglExports(lang) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(createChart(lang)), 0);
  });
}
