import { cerPalette } from "../modules/util.js";
import aurora from "./pipeline_output/oil/AURORA PIPELINE COMPANY LTD.json";
import enbridgeNW from "./pipeline_output/oil/ENBRIDGE PIPELINES (NW) INC.json";
import enbridgeML from "./pipeline_output/oil/ENBRIDGE PIPELINES INC.json";
import enbridgeSL from "./pipeline_output/oil/ENBRIDGE SOUTHERN LIGHTS GP INC ON BEHALF OF ENBRIDGE SOUTHERN LIGHTS LP.json";
import express from "./pipeline_output/oil/EXPRESS PIPELINE LTD.json";
import cochin from "./pipeline_output/oil/KINDER MORGAN COCHIN ULC.json";
import montreal from "./pipeline_output/oil/MONTREAL PIPE LINE LIMITED.json";
import teml from "./pipeline_output/oil/TEML WESTSPUR PIPELINES LIMITED.json";
import tm from "./pipeline_output/oil/TRANS MOUNTAIN PIPELINE ULC.json";
import tn from "./pipeline_output/oil/TRANS-NORTHERN PIPELINES INC.json";
import keystone from "./pipeline_output/oil/TRANSCANADA KEYSTONE PIPELINE GP LTD.json";

import alliance from "./pipeline_output/gas/ALLIANCE PIPELINE LTD.json";
import emera from "./pipeline_output/gas/EMERA BRUNSWICK PIPELINE COMPANY LTD.json";
import foothills from "./pipeline_output/gas/FOOTHILLS PIPE LINES LTD.json";
import mnp from "./pipeline_output/gas/MARITIMES & NORTHEAST PIPELINE MANAGEMENT LTD.json";
import nova from "./pipeline_output/gas/NOVA GAS TRANSMISSION LTD.json";
import tqm from "./pipeline_output/gas/TRANS QUEBEC AND MARITIMES PIPELINE INC.json";
import tcpl from "./pipeline_output/gas/TRANSCANADA PIPELINES LIMITED.json";
import vector from "./pipeline_output/gas/VECTOR PIPELINE LIMITED PARTNERSHIP.json";
import westcoast from "./pipeline_output/gas/WESTCOAST ENERGY INC, CARRYING ON BUSINESS AS SPECTRA ENERGY TRANSMISSION.json";

import canadaMap from "./map_output/statsCanFormat.json";

export const systemMaps = () => {

  const oilFileNames = {
    "AURORA PIPE LINE COMPANY LTD": {
      color: cerPalette["Aubergine"],
      zIndex: 9,
      data: aurora,
    },
    "ENBRIDGE PIPELINES INC": {
      color: cerPalette["Sun"],
      zIndex: 2,
      data: enbridgeML,
    },
    "ENBRIDGE PIPELINES (NW) INC": {
      color: cerPalette["Cool Grey"],
      zIndex: 9,
      data: enbridgeNW,
    },
    "ENBRIDGE SOUTHERN LIGHTS GP INC ON BEHALF OF ENBRIDGE SOUTHERN LIGHTS LP": {
      color: cerPalette["Forest"],
      zIndex: 8,
      data: enbridgeSL,
    },
    "EXPRESS PIPELINE LTD": {
      color: cerPalette["Night Sky"],
      zIndex: 7,
      data: express,
    },
    "MONTREAL PIPE LINE LIMITED": {
      color: cerPalette["hcBlue"],
      zIndex: 9,
      data: montreal,
    },
    "TEML WESTSPUR PIPELINES LIMITED": {
      color: cerPalette["hcGreen"],
      zIndex: 9,
      data: teml,
    },
    "KINDER MORGAN COCHIN ULC": {
      color: cerPalette["hcLightBlue"],
      zIndex: 8,
      data: cochin,
    },
    "TRANS MOUNTAIN PIPELINE ULC": {
      color: cerPalette["Ocean"],
      zIndex: 6,
      data: tm,
    },
    "TRANS-NORTHERN PIPELINES INC": {
      color: cerPalette["Flame"],
      zIndex: 9,
      data: tn,
    },
    "TRANSCANADA KEYSTONE PIPELINE GP LTD": {
      color: cerPalette["hcRed"],
      zIndex: 6,
      data: keystone,
    },
  };

  const gasFileNames = {
    "ALLIANCE PIPELINE LTD": {
      color: cerPalette["Flame"],
      zIndex: 9,
      data: alliance,
    },
    "EMERA BRUNSWICK PIPELINE COMPANY LTD": {
      color: cerPalette["hcAqua"],
      zIndex: 8,
      data: emera,
    },
    "FOOTHILLS PIPE LINES LTD": {
      color: cerPalette["Sun"],
      zIndex: 7,
      data: foothills,
    },
    "MARITIMES & NORTHEAST PIPELINE MANAGEMENT LTD": {
      color: cerPalette["hcRed"],
      zIndex: 6,
      data: mnp,
    },
    "NOVA GAS TRANSMISSION LTD": {
      color: cerPalette["Night Sky"],
      zIndex: 1,
      data: nova,
    },
    "TRANS QUEBEC AND MARITIMES PIPELINE INC": {
      color: cerPalette["hcPurple"],
      zIndex: 5,
      data: tqm,
    },
    "TRANSCANADA PIPELINES LIMITED": {
      color: cerPalette["Forest"],
      zIndex: 4,
      data: tcpl,
    },
    "VECTOR PIPELINE LIMITED PARTNERSHIP": {
      color: cerPalette["Aubergine"],
      zIndex: 3,
      data: vector,
    },
    "WESTCOAST ENERGY INC, CARRYING ON BUSINESS AS SPECTRA ENERGY TRANSMISSION": {
      color: cerPalette["Ocean"],
      zIndex: 2,
      data: westcoast,
    },
  };

  const importPipes = (fileNames) => {
    const shapes = [];

    for (const [key, value] of Object.entries(fileNames)) {
      shapes.push({
        name: key,
        data: Highcharts.geojson(value.data),
        color: value.color,
        type: "map",
        borderWidth: 0.2,
        borderColor: "black",
        zIndex: value.zIndex,
        dataLabels: {
          enabled: true,
          format: "{point.name}",
          style: {
            width: "80px", // force line-wrap
          },
        },
      });
    }

    const baseMap = {
      name: "Pipeline Map",
      data: Highcharts.geojson(canadaMap),
      type: "map",
      color: "#F0F0F0",
      borderWidth: 0.5,
      borderColor: "black",
      zIndex: 0,
      showInLegend: false,
      enableMouseTracking: false,
    };
    shapes.push(baseMap);

    return shapes;
  };

  const oilShapes = importPipes(oilFileNames);
  const gasShapes = importPipes(gasFileNames);

  const mapTooltip = (e) => {
    var properties = {};
    var hasProperties = false;
    var propertiesList = [
      "Year",
      "Pipeline Name",
      "throughput",
      "availableCapacity",
      "Direction of Flow",
      "product",
      "tradeType",
      "Capacity Utilization",
      "Key Point",
    ];
    propertiesList.map((prop) => {
      if (e.point.properties.hasOwnProperty(prop)) {
        properties[prop] = e.point.properties[prop];
        hasProperties = e;
      } else {
        properties[prop] = "n/a";
      }
    });

    if (hasProperties) {
      var toolText = `<b> ${e.point.properties.OPERATOR} - ${properties["Pipeline Name"]} ( ${properties["Key Point"]} key point) <b><br>`;
      return toolText;
    } else {
      var toolText = `<b> ${e.point.properties.OPERATOR} <b><br>`;
      return toolText;
    }
  };

  const mapPopUp = (e, container) => {
    var properties = {};
    var hasProperties = false;
    var propertiesList = [
      "Year",
      "Pipeline Name",
      "throughput",
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
        hasProperties = e;
      } else {
        properties[prop] = "n/a";
      }
    });

    if (hasProperties) {
      var toolText = `<span style="color:${e.color};font-size:14px;font-weight:bold">${properties["Pipeline Name"]}  (${properties["Key Point"]} key point) </span><br>`;
      toolText += `<b>Direction of Flow:</b> ${properties["Direction of Flow"]} <br>`;
      toolText += `<b>Products on Pipeline:</b> ${properties.product} <br>`;
      toolText += `<b>Pipeline Trade Type:</b> ${properties.tradeType} <br>`;
      toolText += `<b>${properties.Year} Average Throughput:</b> ${properties.throughput} ${units} <br>`;
      toolText += `<b>${properties.Year} Average Capacity:</b> ${properties.availableCapacity} ${units} <br>`;
      toolText += `<b>${properties.Year} Capacity Utilization:</b> ${
        properties["Capacity Utilization"] * 100
      } %`;
      return toolText;
    } else {
      var toolText = `<span style="color:${e.color};font-size:14px;font-weight:bold">${e.properties["OPERATOR"]}</span><br>`;
      toolText += `<b>CER Group:</b> ${e.properties["NEBGROUP"]}<br>`;
      toolText += `<b>Pipeline Type:</b> ${e.properties["TYPE"]}`;
      return toolText;
    }
  };

  const createPointMap = (shapes, container) => {
    return new Highcharts.mapChart(container, {
      chart: {
        borderColor: "black",
        borderWidth: 1,
        animation: true,
      },

      credits: {
        text: "Source: CER",
      },

      mapNavigation: {
        enabled: true,
      },

      title: {
        text: "",
      },

      legend: {
        title: { text: "Click on a legend item to add/remove from map" },
        borderColor: cerPalette["Dim Grey"],
        borderWidth: 3,
        itemWidth: 400,
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
              // click: function () {
              //   var text = mapPopUp(this, container);
              //   const chart = this.series.chart;
              //   if (!chart.clickLabel) {
              //     chart.clickLabel = chart.renderer
              //       .text(text, 725, 75, [, true])
              //       .css({
              //         width: "350px",
              //       })
              //       .add();
              //   } else {
              //     chart.clickLabel.attr({
              //       text: text,
              //     });
              //   }
              // },
              mouseOver: function () {
                var text = mapPopUp(this, container);
                const chart = this.series.chart;
                if (!chart.mouseOver) {
                  chart.mouseOver = chart.renderer
                    .text(text, 725, 75, [, true])
                    .css({
                      width: "350px",
                    })
                    .add();
                } else {
                  chart.mouseOver.attr({
                    text: text,
                  });
                }
              },
            },
          },
        },
      },
      series: shapes,
    });
  };
  const crudePipeMap = createPointMap(oilShapes, "container_map_oil");
  const gasPipeMap = createPointMap(gasShapes, "container_map_gas");
};
