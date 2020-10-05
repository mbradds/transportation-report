//takes in a json object and checks if the column has data
const checkIfValid = (data) => {
  let valid = false;
  for (t = 0; t < data.length; t++) {
    if (data[t]["y"] != null && data[t]["y"] != 0) {
      valid = true;
      break;
    }
  }
  return valid;
};

const getData = (Url) => {
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET", Url, false);
  Httpreq.send(null);
  return Httpreq.responseText;
};

function dynamicDropDown(id, optionsArray) {
  function addOption(id, text, select) {
    select.options[select.options.length] = new Option(text);
  }

  var select = document.getElementById(id);
  //select.options.length = 0;

  for (var i = 0; i < optionsArray.length; i++) {
    addOption(id, optionsArray[i], select);
  }
}

//gets the unique regions to populate the dropdown
const getUnique = (items, filterColumns) => {
  if (Array.isArray(filterColumns)) {
    var lookup = [];
    var result = {};

    for (var f in filterColumns) {
      lookup.push({});
      result[filterColumns[f]] = [];
    }

    for (var item, i = 0; (item = items[i++]); ) {
      for (f in filterColumns) {
        var name = item[filterColumns[f]];
        if (!(name in lookup[f])) {
          lookup[f][name] = 1;
          result[filterColumns[f]].push(name);
        }
      }
    }

    return result;
  } else {
    var lookup = {};
    var result = [];
    for (var item, i = 0; (item = items[i++]); ) {
      var name = item[filterColumns];
      if (!(name in lookup)) {
        lookup[name] = 1;
        result.push(name);
      }
    }
    return result;
  }
};

const groupBy = (itter, column, colorsCapacity, yC) => {
  //get the appropriate color
  var capColor = colorsCapacity[itter[0]["Corporate Entity"]];
  result = {};
  grouped = itter.reduce((result, current) => {
    result[current[column]] = result[current[column]] || [];
    result[current[column]].push(current[yC]);
    return result;
  });
  const arrAvg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  hcGroup = [];

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
  fm,
  colorsCapacity,
  colorsThroughput,
  yT,
  yC
) => {
  //get the specific pipeline
  Object.keys(fm).map((v, i) => {
    data = data.filter((row) => row[v] == fm[v]["Value"]);
  });
  var capacity = JSON.parse(JSON.stringify(data)); //deep copy so changes dont get applied to throughput
  capacity = groupBy(capacity, "Date", colorsCapacity, yC);
  var products = getUnique(data, "Product");
  var throughput = [];
  for (var product in products) {
    var color = colorsThroughput[products[product]];
    dataProduct = data.filter((row) => row.Product == products[product]);
    dataProduct = dataProduct.map((v, i) => {
      hcRow = {
        x: v["Date"],
        y: v[yT],
      };
      return hcRow;
    });

    var completedMetric = {
      name: products[product],
      data: dataProduct,
      type: "area",
      color: color,
    };

    throughput.push(completedMetric);
  }
  return [throughput, capacity];
};

const filterDataPoints = (data, colors) => {
  const nameChange = [
    ["Longitude", "lon"],
    ["Latitude", "lat"],
    ["Key Point", "name"],
  ];
  data = data.map((v, i) => {
    for (var name in nameChange) {
      newName = nameChange[name];
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

const throughCapMap = (
  pointsData,
  seriesData,
  colorsCapacity,
  colorsThroughput,
  yT,
  yC
) => {
  var filterMap = {
    "Corporate Entity": { Value: "" },
    "Key Point": { Value: "" },
  };

  const pointMap = Highcharts.mapChart("container_map", {
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
              chart = this.series.chart;
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
              filterMap["Corporate Entity"].Value = this["Corporate Entity"];
              filterMap["Key Point"].Value = this.name;
              createChart(
                seriesData,
                filterMap,
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

    // subtitle: {
    //     text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-all.js">Canada</a>'
    // },

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

  return pointMap;
};

const createChart = (
  githubData,
  filterMap,
  colorsCapacity,
  colorsThroughput,
  yT,
  yC
) => {
  var throughcap = filterDataSeries(
    githubData,
    filterMap,
    colorsCapacity,
    colorsThroughput,
    yT,
    yC
  );
  var throughput = throughcap.slice(0)[0];
  var capacity = throughcap.slice(-1)[0];
  var showCap = checkIfValid(capacity.data);
  if (showCap) {
    var data = throughput.concat(capacity);
  } else {
    var data = throughput;
  }

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
      text: `${filterMap["Corporate Entity"]["Value"]} ${filterMap["Key Point"]["Value"]}`,
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
        text: yT,
      },
    },

    xAxis: {
      type: "datetime",
    },

    series: data,
  });

  return chart;
};

const fillDrop = (column, dropName, value, data) => {
  const drop = getUnique(data, (filterColumns = column));
  dynamicDropDown(dropName, drop);
  document.getElementById(dropName).value = value;
};

class TrafficDashboard {
  constructor(commodity) {
    this.commodity = commodity;
    this.params = {};
  }

  properties() {
    if (this.commodity == "oil") {
      this.params.urlPoints = "/keyPointsOil.json";
      this.params.urlSeries = "/oil_throughcap.json";
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
    } else if (this.commodity == "gas") {
      this.params.urlPoints =
        "https://raw.githubusercontent.com/mbradds/HighchartsData/master/keyPointsGas.json";
      this.params.urlSeries =
        "https://raw.githubusercontent.com/mbradds/HighchartsData/master/gas_throughcap.json";
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
    } else {
      console.log("Enter a valid commodity");
    }

    return this.params;
  }

  setTitle(titleText, id) {
    document.getElementById(id).innerText = titleText;
  }

  get graphStructure() {
    return this.properties();
  }
}

const commodityGraph = (commodity) => {
  const dash = new TrafficDashboard(commodity);
  const graphParams = dash.graphStructure;
  dash.setTitle(graphParams.titleText, "traffic_title");

  var githubPoints = JSON.parse(
    JSON.stringify(JSON.parse(getData(graphParams.urlPoints)))
  );
  var githubSeries = JSON.parse(
    JSON.stringify(JSON.parse(getData(graphParams.urlSeries)))
  );
  fillDrop(
    (column = "Pipeline Name"),
    (dropName = "select_pipelines"),
    (value = "All"),
    (data = githubSeries)
  );

  var pointData = filterDataPoints(githubPoints, graphParams.colorsCapacity);
  var blank = blankChart();
  var pointMap = throughCapMap(
    pointData,
    githubSeries,
    graphParams.colorsCapacity,
    graphParams.colorsThroughput,
    graphParams.yT,
    graphParams.yC
  );
  return [pointMap, pointData];
};
