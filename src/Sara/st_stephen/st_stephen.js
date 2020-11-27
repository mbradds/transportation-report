import {
  cerPalette,
  prepareSeriesNonTidy,
  tooltipPoint,
  conversions,
} from "../../modules/util.js";

import mnpData from "./st_stephen.json";
import offshoreData from "./ns_offshore.json";

export const saraMnp = () => {
  const mnpColors = {
    Exports: cerPalette["Night Sky"],
    Imports: cerPalette["Sun"],
    Capacity: cerPalette["Dim Grey"],
  };

  var units = conversions("Million m3/d to Bcf/d", "Bcf/d", "Million m3/d");

  const ticks = (units) => {
    if (units.unitsCurrent == "Bcf/d") {
      return 0.5;
    } else {
      return 5;
    }
  };

  const offshoreColors = {
    "Deep Panuke": cerPalette["Ocean"],
    "Sable Island": cerPalette["Night Sky"],
  };

  const createMnpSeries = (mnpData, units) => {
    const mnpSeries = prepareSeriesNonTidy(
      mnpData,
      false,
      units,
      ["Exports", "Imports", "Capacity"],
      "Date",
      mnpColors,
      3
    );
    return mnpSeries.map((series) => {
      if (series.name == "Capacity") {
        series.type = "line";
      } else {
        series.type = "area";
      }
      return series;
    });
  };

  const createOffshoreSeries = (offshoreData, units) => {
    const offshoreSeries = prepareSeriesNonTidy(
      offshoreData,
      false,
      units,
      ["Deep Panuke", "Sable Island"],
      "Date",
      offshoreColors,
      3
    );
    return offshoreSeries;
  };

  const createChartMnp = (seriesData, div, units) => {
    if (div == "container_mnp") {
      var titleText = "M&NP Pipeline Traffic";
      var sourceText = "";
    } else {
      var titleText = "N.S. Offshore Natural Gas Production";
      var sourceText = "Source: CER, CNSOPB";
    }
    return new Highcharts.chart(div, {
      chart: {
        type: "area",
        zoomType: "x",
        //height: "45%",
      },

      credits: {
        text: sourceText,
      },

      title: {
        text: titleText,
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
        tickInterval: ticks(units),
      },

      series: seriesData,
    });
  };

  const chartObj = {};
  chartObj.mnp = { series: createMnpSeries(mnpData, units) };
  chartObj.offshore = { series: createOffshoreSeries(offshoreData, units) };
  chartObj.mnp.chart = createChartMnp(
    chartObj.mnp.series,
    "container_mnp",
    units
  );
  chartObj.offshore.chart = createChartMnp(
    chartObj.offshore.series,
    "container_offshore",
    units
  );

  var selectUnitsGasInsert = document.getElementById("select_units_gas_insert");
  selectUnitsGasInsert.addEventListener("change", (selectUnitsGasInsert) => {
    units.unitsCurrent = selectUnitsGasInsert.target.value;
    chartObj.mnp.series = createMnpSeries(mnpData, units);
    chartObj.offshore.series = createOffshoreSeries(offshoreData, units);
    for (const [key, value] of Object.entries(chartObj)) {
      value.chart.update({
        series: value.series,
        yAxis: {
          title: { text: units.unitsCurrent },
          tickInterval: ticks(units),
        },
        tooltip: {
          pointFormat: tooltipPoint(units.unitsCurrent),
        },
      });
    }
  });

  chartObj.offshore.chart.update({
    xAxis: {
      plotLines: [
        {
          color: cerPalette["Ocean"],
          value: Date.UTC(2018, 5, 7),
          width: 2,
          zIndex: 5,
          label: {
            text: "Production ceases",
            align: "left",
          },
        },
        {
          color: cerPalette["Night Sky"],
          value: Date.UTC(2018, 12, 1),
          width: 2,
          zIndex: 5,
          label: {
            text: "Production ceases",
            align: "left",
          },
        },
      ],
    },
  });
};
