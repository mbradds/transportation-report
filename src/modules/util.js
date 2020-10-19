export const cerPalette = {
  "Night Sky": "#054169",
  Sun: "#FFBE4B",
  Ocean: "#5FBEE6",
  Forest: "#559B37",
  Flame: "#FF821E",
  Aubergine: "#871455",
  "Dim Grey": "#8c8c96",
  "Cool Grey": "#42464B",
  White: "#FFFFFF",
};

export const conversions = (conv, current, base) => {
  var cerConversions = {
    "m3/d to b/d": { conversion: 6.2898, type: "*" },
    "b/d to m3/d": { conversion: 0.159, type: "*" },
    "Mb/d to m3/d": { conversion: 159, type: "*" },
    "MMb/d to Mm3/d": { conversion: 0.0062898, type: "/" },
    "Bcf/d to Mm3/d": { conversion: 0.0000353, type: "*" },
    "Bcf/d to Million m3/d": { conversion: 28.32, type: "*" },
  };
  var units = cerConversions[conv];
  units.unitsCurrent = current;
  units.unitsBase = base;
  return units;
};

export const fillDropUpdate = (
  select_name,
  options,
  refresh = false,
  defaultSelect = false
) => {
  var select = document.getElementById(select_name);
  function addOption(text, select) {
    select.options[select.options.length] = new Option(text);
  }
  if (refresh) {
    select.options.length = 0;
  }
  options.map((option, i) => {
    addOption(option, select);
  });
  if (refresh) {
    $(select).selectpicker("refresh");
  }
  if (defaultSelect !== false) {
    $(select).selectpicker("val", defaultSelect);
  }
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
      data = data.filter((row) => row[key] == value);
    }
  }
  return data;
};

const y = (row, col, units, decimals = 1) => {
  if (row[col] == null) {
    return null;
  } else {
    if (!units || units.unitsCurrent == units.unitsBase) {
      return row[col];
    } else {
      if (units.type == "*") {
        return +(row[col] * units.conversion).toFixed(decimals);
      } else {
        return +(row[col] / units.conversion).toFixed(decimals);
      }
    }
  }
};

const tidyOperation = (
  dataRaw,
  filters,
  units,
  variableCol,
  xCol,
  yCol,
  colors,
  xName
) => {
  const dataFiltered = filterData(dataRaw, filters);
  const variableColumn = getUnique(dataFiltered, variableCol);
  const seriesData = [];
  variableColumn.map((v, iVar) => {
    const hcData = [];
    const variableSeries = dataFiltered.filter((row) => row[variableCol] == v);
    variableSeries.map((r, i) => {
      const hcRow = {
        [xName]: r[xCol],
        y: y(r, yCol, units),
      };
      hcData.push(hcRow);
    });

    seriesData.push({
      name: v,
      data: hcData,
      color: colors[v],
    });
  });

  return seriesData;
};

const nonTidyOperation = (
  dataRaw,
  filters,
  units,
  valueVars,
  xCol,
  colors,
  xName
) => {
  const seriesData = {};
  const colTotals = {};
  const dataFiltered = filterData(dataRaw, filters);

  valueVars.map((col, colNum) => {
    seriesData[col] = [];
    colTotals[col] = 0;
  });

  dataFiltered.map((row, rowNum) => {
    valueVars.map((col, colNum) => {
      seriesData[col].push({
        [xName]: row[xCol],
        y: y(row, col, units),
      });
      colTotals[col] = colTotals[col] + row[col];
    });
  });

  const seriesResult = [];

  for (const [key, value] of Object.entries(seriesData)) {
    if (colTotals[key] !== 0) {
      seriesResult.push({
        name: key,
        data: value,
        color: colors[key],
      });
    }
  }

  return seriesResult;
};

export const prepareSeriesNonTidy = (
  dataRaw,
  filters,
  units,
  valueVars,
  xCol,
  colors,
  xName = "x"
) => {
  return nonTidyOperation(
    dataRaw,
    filters,
    units,
    valueVars,
    xCol,
    colors,
    xName
  );
};

export const prepareSeriesTidy = (
  dataRaw,
  filters,
  units,
  variableCol,
  xCol,
  yCol,
  colors,
  xName = "x"
) => {
  return tidyOperation(
    dataRaw,
    filters,
    units,
    variableCol,
    xCol,
    yCol,
    colors,
    xName
  );
};

export const prepareSeriesPie = (data, seriesName, nameCol,yCol,colors) => {
  const series = { name: seriesName, colorByPoint: true };
  series.data = data.map((row) => {
    return {
      name: row[nameCol],
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

export const mouseOverFunction = (itter, currentSelection) => {
  itter.forEach(function (s) {
    if (s.name != currentSelection) {
      s.setState("inactive");
    } else {
      s.setState("hover");
    }
  });
};

export const mouseOutFunction = (itter) => {
  itter.forEach(function (s) {
    s.setState("");
  });
};
