import {
  getUnique,
  checkIfValid,
  y,
  fillDropUpdate,
} from "../../modules/util.js";

const getData = (Url) => {
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET", Url, false);
  Httpreq.send(null);
  return Httpreq.responseText;
};

const groupBy = (itter, column, colorsCapacity, yC, filters) => {
  //get the appropriate color
  var capColor = colorsCapacity[itter[0]["Corporate Entity"]];
  const result = {};
  const grouped = itter.reduce((result, current) => {
    result[current[column]] = result[current[column]] || [];
    result[current[column]].push(current[yC]);
    return result;
  });
  const arrAvg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const hcGroup = [];

  if (filters.CurrentUnits == filters.BaseUnits) {
    for (const [key, value] of Object.entries(grouped)) {
      if (Array.isArray(value)) {
        hcGroup.push({
          x: parseInt(key), //TODO: why doesnt this default to an integer value?
          y: arrAvg(grouped[key]),
        });
      } else {
        delete grouped[key];
      }
    }
  } else {
    for (const [key, value] of Object.entries(grouped)) {
      if (Array.isArray(value)) {
        hcGroup.push({
          x: parseInt(key), //TODO: why doesnt this default to an integer value?
          y: arrAvg(grouped[key]) * 0.0000353,
        });
      } else {
        delete grouped[key];
      }
    }
  }

  var completedMetric = {
    name: yC,
    data: hcGroup,
    type: "line",
    color: capColor,
  };

  return completedMetric;
};

const filterDataSeries = (
  data,
  filters,
  colorsCapacity,
  colorsThroughput,
  yT,
  yC
) => {
  //get the specific pipeline

  Object.keys(filters).map((v, i) => {
    if (v !== "BaseUnits" && v !== "CurrentUnits") {
      data = data.filter((row) => row[v] == filters[v]);
    }
  });

  const capacity = groupBy(
    JSON.parse(JSON.stringify(data)),
    "Date",
    colorsCapacity,
    yC,
    filters
  );
  const products = getUnique(data, "Product");
  var throughput = [];
  for (var product in products) {
    var color = colorsThroughput[products[product]];
    var dataProduct = data.filter((row) => row.Product == products[product]);

    if (filters.CurrentUnits == filters.BaseUnits) {
      dataProduct = dataProduct.map((v, i) => {
        const hcRow = {
          x: v["Date"],
          y: v[yT],
        };
        return hcRow;
      });
    } else {
      dataProduct = dataProduct.map((v, i) => {
        const hcRow = {
          x: v["Date"],
          y: y("*", v, yT, 0.0000353),
        };
        return hcRow;
      });
    }

    var completedMetric = {
      name: products[product],
      data: dataProduct,
      type: "area",
      color: color,
    };

    throughput.push(completedMetric);
  }

  var showCap = checkIfValid(capacity.data);
  if (showCap) {
    var data = throughput.concat(capacity);
  } else {
    var data = throughput;
  }
  return data;
  //return [throughput, capacity];
};

const filterDataPoints = (data, colors) => {
  const nameChange = [
    ["Longitude", "lon"],
    ["Latitude", "lat"],
    ["Key Point", "name"],
  ];
  data = data.map((v, i) => {
    for (var name in nameChange) {
      const newName = nameChange[name];
      v[newName.slice(-1)[0]] = v[newName.slice(0)[0]];
      delete v[newName.slice(0)[0]];
    }
    v["color"] = colors[v["Corporate Entity"]];
    return v;
  });
  return data;
};

const blankChart = () => {
  Highcharts.setOptions({ lang: { noData: "Click on a Pipeline Key Point" } });
  var chart = Highcharts.chart("container_chart", {
    chart: {
      renderTo: "container_chart",
    },
    title: {
      text: "",
    },

    credits: {
      enabled: false,
    },

    yAxis: {
      title: {
        text: "",
      },
    },

    xAxis: {
      type: "datetime",
    },

    legend: {
      enabled: false,
    },

    series: [
      {
        data: [],
      },
    ],
  });

  return chart;
};

const createThroughcapChart = (
  seriesData,
  filterMap,
  colorsCapacity,
  colorsThroughput,
  yT,
  yC
) => {
  //creates the throughput and capacity graph. Called in create point map
  if (filterMap["Corporate Entity"] == null && filterMap["Key Point"] == null) {
    const chart = blankChart();
    return chart;
  } else {
    const data = filterDataSeries(
      seriesData,
      filterMap,
      colorsCapacity,
      colorsThroughput,
      yT,
      yC
    );

    const chart = new Highcharts.chart("container_chart", {
      chart: {
        renderTo: "container_chart",
        //type: 'area', //line,bar,scatter,area,areaspline
        zoomType: "x", //allows the user to focus in on the x or y (x,y,xy)
        //borderColor: 'black',
        //borderWidth: 1,
        animation: true,
        events: {
          load: function () {
            this.credits.element.onclick = function () {
              window.open(
                "https://www.cer-rec.gc.ca/index-eng.html",
                "_blank" // <- This is what makes it open in a new window.
              );
            };
          },
        },
      },

      credits: {
        //enabled:false //gets rid of the "Highcharts logo in the bottom right"
        text: "Canada Energy Regulator",
        href: "https://www.cer-rec.gc.ca/index-eng.html",
      },

      plotOptions: {
        area: {
          stacking: "normal",
        },
        series: {
          turboThreshold: 10000,
          //stickyTracking: false,
          connectNulls: false,
          states: {
            inactive: {
              opacity: 1,
            },
            // hover: {
            //     enabled: false
            // }
          },
        },
      },

      tooltip: {
        xDateFormat: "%Y-%m-%d",
        formatter: function () {
          return this.points.reduce(function (s, point) {
            return s + "<br/>" + point.series.name + ": " + point.y;
          }, "<b>" + Highcharts.dateFormat("%e - %b - %Y", this.x) + "</b>");
        },
        animation: true,
        shared: true,
      },

      title: {
        text: `${filterMap["Corporate Entity"]} ${filterMap["Key Point"]}`,
      },

      colors: [
        "#054169",
        "#FFBE4B",
        "#5FBEE6",
        "#559B37",
        "#FF821E",
        "#871455",
        "#8c8c96",
        "#42464B",
      ],

      yAxis: {
        title: {
          text: `Throughput ${filterMap.CurrentUnits}`,
        },
      },

      xAxis: {
        type: "datetime",
      },

      series: data,
    });
    return chart;
  }
};

const createPointMap = (
  pointsData,
  filters,
  seriesData,
  colorsCapacity,
  colorsThroughput,
  yT,
  yC
) => {
  const chartMap = Highcharts.mapChart("container_map", {
    credits: {
      //enabled:false //gets rid of the "Highcharts logo in the bottom right"
      text: "",
    },

    plotOptions: {
      series: {
        stickyTracking: false,
        point: {
          events: {
            click: function () {
              var text = `<b> ${this["Corporate Entity"]} ${this.name} </b> <br>Direction of flow: ${this["Direction of Flow"]}`;
              const chart = this.series.chart;
              if (!chart.clickLabel) {
                chart.clickLabel = chart.renderer
                  .label(text, 550, 100)
                  .css({
                    width: "180px",
                  })
                  .add();
              } else {
                chart.clickLabel.attr({
                  text: text,
                });
              }
              filters["Corporate Entity"] = this["Corporate Entity"];
              filters["Key Point"] = this.name;
              const chartTraffic = createThroughcapChart(
                seriesData,
                filters,
                colorsCapacity,
                colorsThroughput,
                yT,
                yC
              );
            },
          },
        },
      },
    },

    mapNavigation: {
      enabled: true,
    },

    chart: {
      map: "countries/ca/ca-all",
      renderTo: "container_map",
    },

    title: {
      text: "",
    },

    legend: {
      enabled: false,
    },

    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: "bottom",
      },
    },

    tooltip: {
      snap: 0,
      formatter: function () {
        return `<b> ${this.point["Corporate Entity"]} - ${this.point.name} key point </b><br>
                Click point to view throughput & capacity`;
      },
    },

    series: [
      {
        name: "Basemap",
        borderColor: "#606060",
        nullColor: "rgba(200, 200, 200, 0.2)",
        showInLegend: false,
      },
      {
        type: "mappoint",
        name: "Key Points",
        data: pointsData,
        dataLabels: {
          enabled: true,
          borderRadius: 7,
          padding: 4,
          format: "{point.name}",
          allowOverlap: false,
        },
      },
    ],
  });

  return chartMap;
};

class TrafficDashboard {
  constructor(commodity) {
    this.commodity = commodity;
    this.params = {};
  }

  properties() {
    //TODO: add filters object to this object
    if (this.commodity == "Crude Oil") {
      this.params.urlPoints = "/src/Jennifer/throughcap/keyPointsOil.json";
      this.params.urlSeries = "/src/Jennifer/throughcap/oil_throughcap.json";
      this.params.titleText = "Crude oil Throughput and Capacity";
      this.params.colorsCapacity = {
        "Trans Mountain Pipeline ULC": "#FFBE4B",
        "Enbridge Pipelines (NW) Inc.": "#054169",
        "Enbridge Pipelines Inc.": "#5FBEE6",
        "PKM Cochin ULC": "#559B37",
        "TransCanada Keystone Pipeline GP Ltd.": "#FF821E",
      };
      this.params.colorsThroughput = {
        "refined petroleum products": "#5FBEE6",
        "foreign light": "#FF821E",
        "domestic heavy": "#871455",
        "domestic light / ngl": "#8c8c96",
        "domestic light": "#8c8c96",
      };
      this.params.yT = "Throughput (1000 m3/d)";
      this.params.yC = "Available Capacity (1000 m3/d)";
      this.params.filters = {
        "Corporate Entity": null,
        "Key Point": null,
        CurrentUnits: "1000 m3/d",
        BaseUnits: "1000 m3/d",
      };
      this.params.units = ["1000 m3/d", "1000 b/d"];
    } else if (this.commodity == "Natural Gas") {
      this.params.urlPoints = "/src/Jennifer/throughcap/keyPointsGas.json";
      this.params.urlSeries = "/src/Jennifer/throughcap/gas_throughcap.json";
      this.params.titleText = "Natural gas Throughput and Capacity";
      this.params.colorsCapacity = {
        "Westcoast Energy Inc.": "#5FBEE6",
        "TransCanada PipeLines Limited": "#559B37",
        "NOVA Gas Transmission Ltd. (NGTL)": "#054169",
        "Alliance Pipeline Limited Partnership": "#FFBE4B",
        "Foothills Pipe Lines Ltd. (Foothills)": "#FF821E",
        "Emera Brunswick Pipeline Company Ltd.": "#8c8c96",
        "Maritimes & Northeast Pipeline": "#42464B",
        "Trans Québec & Maritimes Pipeline Inc": "#871455",
      };
      this.params.colorsThroughput = {
        "Natural Gas": "#42464B",
      };
      this.params.yT = "Throughput (1000 m3/d)";
      this.params.yC = "Capacity (1000 m3/d)";
      this.params.filters = {
        "Corporate Entity": null,
        "Key Point": null,
        CurrentUnits: "1000 m3/d",
        BaseUnits: "1000 m3/d",
      };
      this.params.units = ["1000 m3/d", "BCF/d"];
    } else {
      console.log("Enter a valid commodity");
    }

    return this.params;
  }

  //methods
  setTitle(id) {
    document.getElementById(id).innerText = this.params.titleText;
  }

  fillDropsThroughcap(data) {
    var pipes = getUnique(data, "Pipeline Name");
    pipes.unshift("All");
    fillDropUpdate(
      document.getElementById("select_pipelines"),
      pipes,
      true,
      "All"
    );
    fillDropUpdate(
      document.getElementById("select_units"),
      this.params.units,
      true,
      this.params.units[0]
    );
  }

  get graphStructure() {
    return this.properties();
  }
}

const commodityGraph = (commodity) => {
  var dash = new TrafficDashboard(commodity);
  var graphParams = dash.graphStructure;

  const pointsData = JSON.parse(getData(graphParams.urlPoints));
  const seriesData = JSON.parse(getData(graphParams.urlSeries));
  dash.setTitle("traffic_title");
  dash.fillDropsThroughcap(seriesData);

  const pointData = filterDataPoints(pointsData, graphParams.colorsCapacity);
  const blank = createThroughcapChart(
    seriesData,
    graphParams.filters,
    graphParams.colorsCapacity,
    graphParams.colorsThroughput,
    graphParams.yT,
    graphParams.yC
  );
  const chartMap = createPointMap(
    pointsData,
    graphParams.filters,
    seriesData,
    graphParams.colorsCapacity,
    graphParams.colorsThroughput,
    graphParams.yT,
    graphParams.yC
  );
  return [chartMap, pointData, seriesData, graphParams];
};

const unitsListener = (graphParams, seriesData) => {
  var select_units = document.getElementById("select_units");
  select_units.addEventListener("change", (select_units) => {
    var units = select_units.target.value;
    graphParams.filters.CurrentUnits = units;
    const chartTraffic = createThroughcapChart(
      seriesData,
      graphParams.filters,
      graphParams.colorsCapacity,
      graphParams.colorsThroughput,
      graphParams.yT,
      graphParams.yC
    );
  });
};

const pipesListener = (pointData, chartMap) => {
  var select_pipelines = document.getElementById("select_pipelines");
  select_pipelines.addEventListener("change", (select_pipelines) => {
    var pipeLine = select_pipelines.target.value;
    if (pipeLine !== "All") {
      var pointDataPipe = pointData.filter(
        (row) => row["Pipeline Name"] == pipeLine
      );
    } else {
      var pointDataPipe = pointData;
    }

    chartMap.update({
      series: [
        {
          name: "Basemap",
          borderColor: "#606060",
          nullColor: "rgba(200, 200, 200, 0.2)",
          showInLegend: false,
        },
        {
          type: "mappoint",
          name: "Key Points",
          data: pointDataPipe,
          dataLabels: {
            enabled: true,
            borderRadius: 7,
            padding: 4,
            format: "{point.name}",
            allowOverlap: false,
          },
        },
      ],
    });
  });
};

export const mainThroughcap = () => {
  var [chartMap, pointData, seriesData, graphParams] = commodityGraph(
    "Natural Gas"
  );

  $(document).ready(function () {
    $('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
      var commodity = $(e.target).text(); // get current tab
      [chartMap, pointData, seriesData, graphParams] = commodityGraph(
        commodity
      );
      unitsListener(graphParams, seriesData);
      pipesListener(pointData, chartMap);
    });
  });
};
mainThroughcap();
