export const cerPalette = {
  "Night Sky": "#054169",
  Sun: "#FFBE4B",
  Ocean: "#5FBEE6",
  Forest: "#559B37",
  Flame: "#FF821E",
  Aubergine: "#871455",
  "Dim Grey": "#8c8c96",
  "Cool Grey": "#42464B",
  hcBlue: "#7cb5ec",
  hcGreen: "#90ed7d",
  hcPink: "#f15c80",
  hcRed: "#f45b5b",
  hcAqua: "#2b908f",
  hcPurple: "#8085e9",
  hcLightBlue: "#91e8e1",
  Forecast: "#F0F8FF",
};

export const numberFormat = (value) => {
  return Highcharts.numberFormat(value, 0, ".", ",");
};

export const dateFormat = (value, format = "%b %d, %Y") => {
  return Highcharts.dateFormat(format, value);
};

export const conversions = (conv, current, base) => {
  const cerConversions = {
    "m3/d to b/d": { conversion: 6.2898, type: "*" },
    "b/d to m3/d": { conversion: 0.159, type: "*" },
    "Mb/d to m3/d": { conversion: 159, type: "*" },
    "MMb/d to Mm3/d": { conversion: 0.0062898, type: "/" },
    "Bcf/d to Mm3/d": { conversion: 0.0000353, type: "*" },
    "Bcf/d to Million m3/d": { conversion: 28.32, type: "*" },
    "Million m3/d to Bcf/d": { conversion: 1 / 28.32, type: "*" },
  };
  const units = cerConversions[conv];
  units.unitsCurrent = current;
  units.unitsBase = base;
  return units;
};

export const sortJson = (obj, colName = "value") => {
  return obj.slice().sort((a, b) => b[colName] - a[colName]);
};

export const sortObj = (obj) => {
  return Object.fromEntries(Object.entries(obj).sort(([, a], [, b]) => b - a));
};

//takes in a json object and checks if the column has data
export const checkIfValid = (data) => {
  let valid = false;
  for (var t = 0; t < data.length; t++) {
    if (data[t]["y"] != null && data[t]["y"] != 0) {
      valid = true;
      break;
    }
  }
  return valid;
};

//gets the unique regions to populate the dropdown
export const getUnique = (items, filterColumns) => {
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
};

export const filterData = (data, filters) => {
  if (filters !== false) {
    for (const [key, value] of Object.entries(filters)) {
      if (!Array.isArray(value)) {
        data = data.filter((row) => row[key] == value);
      } else {
        value.map((filterValue) => {
          data = data.filter((row) => row[key] == filterValue);
        });
      }
    }
  }
  return data;
};

export const prepareSeriesPie = (
  dataRaw,
  filters,
  seriesName,
  nameCol,
  yCol,
  colors,
  langSeries,
  colorByPoint = true
) => {
  const data = filterData(dataRaw, filters);
  const series = { name: seriesName, colorByPoint: colorByPoint, data: [] };
  series.data = data.map((row) => {
    return {
      name: langSeries[row[nameCol]],
      y: row[yCol],
      color: colors[row[nameCol]],
    };
  });
  return [series];
};

export const creditsClick = (chart, link) => {
  chart.credits.element.onclick = function () {
    window.open(link, "_blank");
  };
};

export const mouseOverFunction = (
  itter,
  currentSelection,
  newColor = false
) => {
  itter.forEach(function (s) {
    if (newColor && s.name == currentSelection) {
      s.update({
        color: newColor,
      });
    } else if (newColor == false) {
      if (s.name != currentSelection) {
        s.setState("inactive");
      } else {
        s.setState("hover");
      }
    }
  });
};

export const mouseOutFunction = (itter, oldColor = false) => {
  itter.forEach(function (s) {
    s.setState("");
    if (oldColor) {
      s.update({
        color: oldColor,
      });
    }
  });
};

const symbolHTML = (symbolName) => {
  var symbols = {
    circle: "&#9679",
    diamond: "&#9670",
    square: "&#9632",
    triangle: "&#9650",
    "triangle-down": "&#9660",
  };

  return symbols[symbolName];
};

export const tooltipPoint = (unitsCurrent) => {
  return `<tr><td> <span style="color: {series.color}">&#9679</span> {series.name}: </td><td style="padding:0"><b>&nbsp{point.y} ${unitsCurrent}</b></td></tr>`;
};

export const tooltipSymbol = (
  event,
  unitsCurrent,
  shared = true,
  showY = true
) => {
  if (showY) {
    var y = event.point.y;
  } else {
    var y = "";
  }
  if (shared) {
    return `<tr><td> <span style="color: ${event.series.color}">${symbolHTML(
      event.point.graphic.symbolName
    )}</span> ${
      event.series.name
    }: </td><td style="padding:0"><b>${y} ${unitsCurrent}</b></td></tr>`;
  }
};

export const tooltipSorted = (
  points,
  title,
  units,
  transform = false,
  text = ""
) => {
  const yCalc = (transform) => {
    if (transform) {
      return (y) => y / transform[0]; //TODO: add more options like multiply/add if needed
    } else {
      return (y) => y;
    }
  };
  let yVal = yCalc(transform);
  var sortedPoints = sortJson(points, "y");
  let toolText = `<b>${title}</b>`;
  if (text) {
    toolText = `<b>${title}</b> - <i> ${text}</i>`;
  }
  toolText += `<table>`;
  sortedPoints.map((point) => {
    toolText += `<tr><td> <span style="color: ${point.color}">&#9679</span> ${
      point.series.name
    }:</td><td style="padding:0">&nbsp<b>${Highcharts.numberFormat(
      yVal(point.y)
    )} ${units}</b></td></tr>`;
  });
  toolText += `</table>`;
  return toolText;
};

export const setTitle = (
  figure_title,
  figure_number,
  filter_value,
  title_text
) => {
  figure_title.innerText = `Figure ${figure_number}: ${String(
    filter_value
  ).trim()} ${title_text}`;
};

export const bands = (
  f,
  t,
  text,
  y = 10,
  zIndex = 3,
  color = cerPalette["Forecast"]
) => {
  return {
    color: color,
    from: f,
    to: t,
    zIndex: zIndex,
    label: {
      text: text,
      y: y,
      align: "center",
      style: {
        fontWeight: "bold",
        color: cerPalette["Cool Grey"],
      },
    },
  };
};

export const lines = (color, dashStyle, value, text, rotation) => {
  return {
    color: color,
    dashStyle: dashStyle,
    value: value,
    width: 3,
    zIndex: 5,
    label: {
      text: text,
      rotation: rotation,
      style: {
        fontWeight: "bold",
        color: cerPalette["Cool Grey"],
      },
    },
  };
};

export const annotation = (x, y, bdColor, text) => {
  return {
    labels: [
      {
        point: { x: x, y: y },
        style: {
          fontWeight: "bold",
          color: (Highcharts.theme && Highcharts.theme.textColor) || "grey",
        },
        shape: "rect",
        backgroundColor: "white",
        borderColor: bdColor,
        text: text,
      },
    ],
    draggable: "",
  };
};

export const labeler = (chart, text, strokeColor, x = -30, y = 0) => {
  const label = chart.renderer
    .label(text, null, null, null, null, null, true)
    .attr({
      fill: "white",
      stroke: strokeColor,
      "stroke-width": 1,
      padding: 5,
      r: 2,
    })
    .css({
      margin: 0,
      fontWeight: "bold",
      color: (Highcharts.theme && Highcharts.theme.textColor) || "grey",
    })
    .add(chart.rGroup);

  label.align(
    Highcharts.extend(label.getBBox(), {
      align: "right",
      x: x, // offset
      verticalAlign: "top",
      y: y, // offset
    }),
    null,
    "spacingBox"
  );
  chart.customLabel = label;
};

export const frenchAxis = (ax, names) => {
  if (names) {
    if (names.hasOwnProperty(ax.value)) {
      return names[ax.value];
    } else {
      return ax.value;
    }
  } else {
    return ax.value;
  }
};
