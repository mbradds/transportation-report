import {
  cerPalette,
  creditsClick,
  prepareSeriesPie,
  setTitle,
} from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";
import crudeModeData from "./crude_mode.json";

const createChart = (lang, langUnits) => {
  const crudeModeFilters = { Year: 2020 };
  const crudeModeColors = {
    Pipeline: cerPalette["Night Sky"],
    Marine: cerPalette["Ocean"],
    Rail: cerPalette["Sun"],
  };

  const createCrudeModeChart = (seriesData, filters) => {
    return new Highcharts.chart("container_crude_mode", {
      chart: {
        // borderWidth: 1,
        type: "pie",
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
      tooltip: {
        useHTML: true,
        formatter: function () {
          var toolText = `<table><b>${this.key} - ${filters.Year}</b>`;
          toolText += `<tr><td>${
            lang.pctOfTotal
          }</td><td style="padding:0"><b>${this.point.percentage.toFixed(
            0
          )} %</b></td></tr>`;
          toolText += `<tr><td>${
            lang.exportVolume
          }</td><td style="padding:0"><b>${Highcharts.numberFormat(
            this.y.toFixed(1),
            1
          )} ${langUnits["b/d"]}</b></td></tr>`;
          toolText += `<tr><td></td><td style="padding:0"><b><i>${Highcharts.numberFormat(
            (this.y / 6.2898).toFixed(1),
            1
          )} ${langUnits["m3/d"]}</b></i></td></tr>`;
          toolText += `</table>`;
          return toolText;
        },
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          cursor: "pointer",
          size: "80%",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %",
          },
          showInLegend: true,
        },
      },
      series: seriesData,
    });
  };
  try {
    var figure_title = document.getElementById("crude_mode_title");
    setTitle(figure_title, "10", crudeModeFilters.Year, lang.title);

    const seriesData = prepareSeriesPie(
      crudeModeData,
      crudeModeFilters,
      "Crude Exports by Mode",
      "Mode",
      "Volume (bbl/d)",
      crudeModeColors,
      lang.series
    );

    const crudeModePie = createCrudeModeChart(seriesData, crudeModeFilters);

    $("#crude-exp-mode button").on("click", function () {
      $(".btn-crude-mode > .btn").removeClass("active");
      $(this).addClass("active");
      var thisBtn = $(this);
      var btnValue = thisBtn.val();
      $("#selectedVal").text(btnValue);
      crudeModeFilters.Year = parseInt(btnValue);
      setTitle(figure_title, "10", crudeModeFilters.Year, lang.title);
      crudeModePie.update({
        series: prepareSeriesPie(
          crudeModeData,
          crudeModeFilters,
          "Crude Exports by Mode",
          "Mode",
          "Volume (bbl/d)",
          crudeModeColors,
          lang.series
        ),
      });
    });
    return crudeModePie;
  } catch (err) {
    errorChart("container_crude_mode");
    return;
  }
};

export function coletteCrudeMode(lang, langUnits) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(createChart(lang, langUnits)), 0);
  });
}
