import { cerPalette } from "../modules/util.js";
import { errorChart } from "../modules/charts.js";
import aurora from "./prototype_output/oil/AuroraPipeline.json";
import enbridgeNW from "./prototype_output/oil/NormanWellsPipeline.json";
import enbridgeML from "./prototype_output/oil/EnbridgeCanadianMainline.json";
import enbridgeSL from "./prototype_output/oil/SouthernLightsPipeline.json";
import express from "./prototype_output/oil/ExpressPipeline.json";
import cochin from "./prototype_output/oil/CochinPipeline.json";
import montreal from "./prototype_output/oil/MontrealPipeline.json";
import teml from "./prototype_output/oil/WestspurPipeline.json";
import tm from "./prototype_output/oil/TransMountainPipeline.json";
import tn from "./prototype_output/oil/Trans-NorthernPipeline.json";
import keystone from "./prototype_output/oil/KeystonePipeline.json";

import alliance from "./prototype_output/gas/AlliancePipeline.json";
import foothills from "./prototype_output/gas/FoothillsSystem.json";
import mnp from "./prototype_output/gas/MNPPipeline.json";
import nova from "./prototype_output/gas/NGTLSystem.json";
import tqm from "./prototype_output/gas/TQMPipeline.json";
import tcpl from "./prototype_output/gas/TCCanadianMainline.json";
import vector from "./prototype_output/gas/VectorPipeline.json";
import westcoast from "./prototype_output/gas/EnbridgeBCPipeline.json";
import canadaMap from "./map_output/base_map.json";

export const systemMaps = () => {
  const oilFileNames = {
    "Aurora Pipeline": {
      color: cerPalette["Aubergine"],
      zIndex: 9,
      data: aurora,
    },
    "Enbridge Canadian Mainline": {
      color: cerPalette["Sun"],
      zIndex: 2,
      data: enbridgeML,
    },
    "Norman Wells Pipeline": {
      color: cerPalette["Cool Grey"],
      zIndex: 9,
      data: enbridgeNW,
    },
    "Southern Lights Pipeline": {
      color: cerPalette["Forest"],
      zIndex: 8,
      data: enbridgeSL,
    },
    "Express Pipeline": {
      color: cerPalette["Night Sky"],
      zIndex: 7,
      data: express,
    },
    "Montreal Pipeline": {
      color: cerPalette["hcBlue"],
      zIndex: 9,
      data: montreal,
    },
    "Westpur Pipeline": {
      color: cerPalette["hcGreen"],
      zIndex: 9,
      data: teml,
    },
    "Cochin Pipeline": {
      color: cerPalette["hcLightBlue"],
      zIndex: 8,
      data: cochin,
    },
    "Trans Mountain Pipeline": {
      color: cerPalette["Ocean"],
      zIndex: 6,
      data: tm,
    },
    "Trans-Northern Pipeline": {
      color: cerPalette["Flame"],
      zIndex: 9,
      data: tn,
    },
    "Keystone Pipeline": {
      color: cerPalette["hcRed"],
      zIndex: 6,
      data: keystone,
    },
  };

  const gasFileNames = {
    "Alliance Pipeline": {
      color: cerPalette["Flame"],
      zIndex: 9,
      data: alliance,
    },
    "Foothills System": {
      color: cerPalette["Sun"],
      zIndex: 7,
      data: foothills,
    },
    "M&NP Pipeline": {
      color: cerPalette["hcRed"],
      zIndex: 6,
      data: mnp,
    },
    "NGTL System": {
      color: cerPalette["Night Sky"],
      zIndex: 1,
      data: nova,
    },
    "TQM Pipeline": {
      color: cerPalette["hcPurple"],
      zIndex: 5,
      data: tqm,
    },
    "TC Canadian Mainline": {
      color: cerPalette["Forest"],
      zIndex: 4,
      data: tcpl,
    },
    "Vector Pipeline": {
      color: cerPalette["Aubergine"],
      zIndex: 3,
      data: vector,
    },
    "Enbridge BC Pipeline": {
      color: cerPalette["Ocean"],
      zIndex: 2,
      data: westcoast,
    },
  };

  const importPipes = (fileNames) => {
    const shapes = [
      {
        name: "Pipeline Map",
        data: Highcharts.geojson(canadaMap),
        type: "map",
        color: "#F0F0F0",
        borderWidth: 0.5,
        borderColor: "black",
        zIndex: 0,
        showInLegend: false,
        enableMouseTracking: false,
      },
    ];
    for (const [key, value] of Object.entries(fileNames)) {
      shapes.push({
        name: key,
        data: Highcharts.geojson(value.data),
        color: value.color,
        type: "map",
        borderWidth: 0.2,
        borderColor: "black",
        zIndex: value.zIndex,
      });
    }
    return shapes;
  };

  const mapTooltip = (e) => {
    var hasProperties = false;
    if (e.point.properties.hasOwnProperty("Key Point")) {
      var hasProperties = true;
    }
    if (hasProperties) {
      var toolText = `<b> ${e.point.properties.Company} - ${e.point.properties["Corporate Entity"]}<b><br>`;
      return toolText;
    } else {
      var toolText = `<b> ${e.point.properties["Pipeline_S"]} <b><br>`;
      return toolText;
    }
  };

  const mapPopUp = (e, container) => {
    var properties = {};

    var propertiesList = [
      "Year",
      "Pipeline Name",
      "Corporate Entity",
      "throughput",
      "Shape_Leng",
      "availableCapacity",
      "Direction of Flow",
      "product",
      "tradeType",
      "Capacity Utilization",
      "Key Point",
    ];
    if (container == "container_map_oil") {
      var units = "(1000 b/d)";
    } else {
      var units = "(1000 m3/d)";
    }
    propertiesList.map((prop) => {
      if (e.properties.hasOwnProperty(prop)) {
        properties[prop] = e.properties[prop];
      } else {
        properties[prop] = "n/a";
      }
    });

    var hasProperties = false;
    if (e.properties.hasOwnProperty("Key Point")) {
      var hasProperties = true;
    }

    if (hasProperties) {
      var toolText = `<span style="color:${e.color};font-size:14px;font-weight:bold">${properties["Corporate Entity"]}</span><br>`;
      toolText += `<i>System Information</i>`;
      toolText += `<table><tr><td><li> Estimated Length: &nbsp</td><td style="padding:0"><b>Coming soon!</b></li></td></tr>`;
      toolText += `<tr><td><li> Direction of Flow: &nbsp</td><td style="padding:0"><b>${properties["Direction of Flow"]}</b></li></td></tr>`;
      toolText += `<tr><td><li> Products: &nbsp</td><td style="padding:0"><b>${properties.product}</b></li></td></tr>`;
      toolText += `<tr><td><li>Pipeline Trade Type: &nbsp</td><td style="padding:0"><b>${properties.tradeType}</b></li></td></tr>`;
      toolText += `</table><br>`;
      toolText += `<i>System Info at ${properties["Key Point"]} Key Point<i>`;
      toolText += `<table><tr><td><li>${properties.Year} Average Throughput: &nbsp</td><td style="padding:0"><b>${properties.throughput} ${units}</b></li></td></tr>`;
      toolText += `<tr><td><li>${properties.Year} Average Capacity: &nbsp</td><td style="padding:0"><b>${properties.availableCapacity} ${units}</b></li></td></tr>`;
      toolText += `<tr><td><li>${
        properties.Year
      } Capacity Utilization: &nbsp</td><td style="padding:0"><b>${
        properties["Capacity Utilization"] * 100
      } %</b></li></td></tr>`;
      toolText += `</table>`;
      return toolText;
    } else {
      var toolText = `<span style="color:${e.color};font-size:14px;font-weight:bold">${e.properties["Pipeline_S"]}</span><br>`;
      toolText += `<b>CER Group:</b>Group 2<br>`;
      return toolText;
    }
  };

  const destroyInsert = (chart) => {
    chart.customTooltip.destroy();
    chart.customTooltip = undefined;
  };

  const createPointMap = (shapes, container) => {
    return new Highcharts.mapChart(container, {
      chart: {
        type: "map",
        borderColor: "black",
        borderWidth: 1,
        marginTop: 3,
        panning: {
          enabled: true,
          type: "xy",
        },
        events: {
          load: function () {
            const chart = this;
            var text = `<b>Hover over a pipeline to view system info</b>`;
            text += `<i><li>Click legend item to add/remove pipelines</i></li>`;
            text += `<i><li>Scroll in chart area to zoom</i></li>`;
            text += `<br><b>Disclaimer:</b>`;
            text += `<i>Pipeline location data is derived from public sources and is for information purposes only.</i>`;
            var label = chart.renderer
              .label(text, null, null, null, null, null, true)
              .css({
                width: "240px",
              })
              .attr({
                zIndex: 8,
                padding: 8,
                r: 3,
                fill: "white",
              })
              .add(chart.rGroup);
            label.align(
              Highcharts.extend(label.getBBox(), {
                align: "left",
                x: 0, // offset
                verticalAlign: "top",
                y: 0, // offset
              }),
              null,
              "spacingBox"
            );
          },
        },
      },

      credits: {
        text: "",
      },

      title: {
        text: "",
      },

      legend: {
        borderColor: cerPalette["Dim Grey"],
        margin: 5,
        y: 5,
        borderWidth: 3,
        itemDistance: 5,
      },

      tooltip: {
        enabled: true,
        formatter: function () {
          return mapTooltip(this);
        },
      },

      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: "bottom",
        },
      },

      plotOptions: {
        series: {
          point: {
            events: {
              mouseOver: function () {
                const chart = this.series.chart;
                var text = mapPopUp(this, container);
                if (chart.customTooltip) {
                  destroyInsert(chart);
                }
                var label = chart.renderer
                  .label(text, null, null, null, null, null, true)
                  .css({
                    width: "500px",
                  })
                  .attr({
                    "stroke-width": 3,
                    zIndex: 8,
                    padding: 8,
                    r: 3,
                    fill: "white",
                    stroke: this.color,
                  })
                  .add(chart.rGroup);
                chart.customTooltip = label;
                label.align(
                  Highcharts.extend(label.getBBox(), {
                    align: "right",
                    x: 0, // offset
                    verticalAlign: "top",
                    overflow: "scroll",
                    y: 0, // offset
                  }),
                  null,
                  "spacingBox"
                );
              },
            },
          },
        },
      },
      series: shapes,
    });
  };

  const oilMap = () => {
    try {
      const oilShapes = importPipes(oilFileNames);
      var crudePipeMap = createPointMap(oilShapes, "container_map_oil");
    } catch (err) {
      console.log(err);
      errorChart("container_map_oil");
    }
  };

  const gasMap = () => {
    try {
      const gasShapes = importPipes(gasFileNames);
      const gasPipeMap = createPointMap(gasShapes, "container_map_gas");
    } catch (err) {
      errorChart("container_map_gas");
    }
  };

  const mainCharts = () => {
    oilMap();
    gasMap();
  };
  mainCharts();
};
