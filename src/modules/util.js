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

export const getData = (Url) => {
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET", Url, false);
  Httpreq.send(null);
  return Httpreq.responseText;
};

export const dynamicDropDown = (id, optionsArray) => {
  function addOption(id, text, select) {
    select.options[select.options.length] = new Option(text);
  }

  var select = document.getElementById(id);
  //select.options.length = 0;

  for (var i = 0; i < optionsArray.length; i++) {
    addOption(id, optionsArray[i], select);
  }
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

export const fillDrop = (column, dropName, value, data) => {
  const drop = getUnique(data, column);
  dynamicDropDown(dropName, drop.sort());
  document.getElementById(dropName).value = value;
};

export const filterData = (data, filters) => {
  if (filters !== false) {
    for (const [key, value] of Object.entries(filters)) {
      data = data.filter((row) => row[key] == value);
    }
  }
  return data;
};

export const prepareSeriesNonTidy = (
  dataRaw,
  filters,
  valueVars,
  xCol,
  colors
) => {
  const seriesData = {};
  const colTotals = {};

  const dataFiltered = filterData(dataRaw, filters);

  //initialize each series with an empty list
  valueVars.map((col, colNum) => {
    seriesData[col] = [];
    colTotals[col] = 0;
  });

  dataFiltered.map((row, rowNum) => {
    valueVars.map((col, colNum) => {
      seriesData[col].push({
        x: row[xCol],
        y: row[col],
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

export const prepareSeriesNonTidyUnits = (
  dataRaw,
  filters,
  unitsCurrent,
  baseUnits,
  conversion,
  convType,
  valueVars,
  xCol,
  colors
) => {
  const seriesData = {};
  const colTotals = {};

  const dataFiltered = filterData(dataRaw, filters);

  //initialize each series with an empty list
  valueVars.map((col, colNum) => {
    seriesData[col] = [];
    colTotals[col] = 0;
  });

  const y = (convType, row, col, conversion) => {
    return convType === "*"
      ? +(row[col] * conversion).toFixed(1)
      : +(row[col] / conversion).toFixed(1);
  };

  if (unitsCurrent == baseUnits) {
    dataFiltered.map((row, rowNum) => {
      valueVars.map((col, colNum) => {
        seriesData[col].push({
          x: row[xCol],
          y: row[col],
        });
        colTotals[col] = colTotals[col] + row[col];
      });
    });
  } else {
    dataFiltered.map((row, rowNum) => {
      valueVars.map((col, colNum) => {
        seriesData[col].push({
          x: row[xCol],
          y: y(convType, row, col, conversion),
        });
        colTotals[col] = colTotals[col] + row[col];
      });
    });
  }

  const seriesResult = [];

  for (const [key, value] of Object.entries(seriesData)) {
    if (colTotals[key] > 0) {
      seriesResult.push({
        name: key,
        data: value,
        color: colors[key],
      });
    }
  }

  return seriesResult;
};

export const prepareSeriesTidy = (
  dataRaw,
  filters,
  variableCol,
  xCol,
  yCol,
  colors
) => {
  const seriesData = [];

  const dataFiltered = filterData(dataRaw, filters);
  const variableColumn = getUnique(dataFiltered, variableCol);

  variableColumn.map((v, iVar) => {
    const hcData = [];
    const variableSeries = dataFiltered.filter((row) => row[variableCol] == v);
    variableSeries.map((r, i) => {
      const hcRow = {
        x: r[xCol],
        y: r[yCol],
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
