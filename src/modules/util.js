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

export const conversions = {
  "m3/d to b/d": { number: 6.2898, type: "*" },
  "b/d to m3/d": { number: 0.159, type: "*" },
  "Mb/d to m3/d": { number: 159, type: "*" },
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

const y = (row, col, convType = false, conversion = false, decimals = 1) => {
  if (!convType && !conversion) {
    return row[col];
  } else {
    return convType === "*"
      ? +(row[col] * conversion).toFixed(decimals)
      : +(row[col] / conversion).toFixed(decimals);
  }
};

const tidyOperation = (
  dataRaw,
  filters,
  variableCol,
  xCol,
  yCol,
  colors,
  xName,
  conversion = false,
  convType = false
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
        y: y(r, yCol, convType, conversion),
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
  valueVars,
  xCol,
  colors,
  xName,
  conversion = false,
  convType = false
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
        y: y(row, col, convType, conversion),
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
  valueVars,
  xCol,
  colors,
  xName = "x" //can be changed to "name" when the x data is non numeric
) => {
  return nonTidyOperation(dataRaw, filters, valueVars, xCol, colors, xName);
};

export const prepareSeriesNonTidyUnits = (
  dataRaw,
  filters,
  unitsCurrent,
  baseUnits,
  conversion,
  convType,
  valueVars,
  xCol,
  colors,
  xName = "x"
) => {
  if (unitsCurrent == baseUnits) {
    return nonTidyOperation(dataRaw, filters, valueVars, xCol, colors, xName);
  } else {
    return nonTidyOperation(
      dataRaw,
      filters,
      valueVars,
      xCol,
      colors,
      xName,
      conversion,
      convType
    );
  }
};

export const prepareSeriesTidy = (
  dataRaw,
  filters,
  variableCol,
  xCol,
  yCol,
  colors,
  xName = "x"
) => {
  return tidyOperation(
    dataRaw,
    filters,
    variableCol,
    xCol,
    yCol,
    colors,
    xName
  );
};

export const prepareSeriesTidyUnits = (
  dataRaw,
  filters,
  unitsCurrent,
  baseUnits,
  conversion,
  convType,
  variableCol,
  xCol,
  yCol,
  colors,
  xName = "x"
) => {
  if (unitsCurrent == baseUnits) {
    return tidyOperation(
      dataRaw,
      filters,
      variableCol,
      xCol,
      yCol,
      colors,
      xName
    );
  } else {
    return tidyOperation(
      dataRaw,
      filters,
      variableCol,
      xCol,
      yCol,
      colors,
      xName,
      conversion,
      convType
    );
  }
};

export const creditsClick = (chart, link) => {
  chart.credits.element.onclick = function () {
    window.open(link, "_blank");
  };
};
