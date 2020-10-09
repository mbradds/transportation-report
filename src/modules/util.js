//TODO: add parameter into series creating methods that defines what "x" should be called. For column graphs it needs to be called "name"
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

export const formatMoney = (
  amount,
  decimalCount = 2,
  decimal = ".",
  thousands = ","
) => {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  } catch (e) {
    return amount;
  }
};

//TODO: change these dropdown methods to accept a DOM object itentified in outside code
export const dynamicDropDown = (select, optionsArray) => {
  function addOption(text, select) {
    select.options[select.options.length] = new Option(text);
  }
  //select.options.length = 0;

  for (var i = 0; i < optionsArray.length; i++) {
    addOption(optionsArray[i], select);
  }
};

export const fillDrop = (column, dropName, value, data) => {
  const drop = getUnique(data, column);
  var select = document.getElementById(dropName);
  dynamicDropDown(select, drop.sort());
  select.value = value;
};

//TODO: use this method instead of the ones above
export const fillDropUpdate = (select,options,refresh=false,defaultSelect=false) => {
  function addOption(text, select) {
    select.options[select.options.length] = new Option(text);
  }
  if (refresh){
    select.options.length = 0;  
  }
  options.map((option,i)=>{
    addOption(option, select);
  })
  if (refresh){
    $(select).selectpicker('refresh');
  }
  if (defaultSelect !== false){
    $(select).selectpicker('val',defaultSelect)
  }

}


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

export const prepareSeriesNonTidy = (
  dataRaw,
  filters,
  valueVars,
  xCol,
  colors,
  xName = "x" //can be changed to "name" when the x data is non numeric
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
        [xName]: row[xCol],
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

export const y = (convType, row, col, conversion) => {
  return convType === "*"
    ? +(row[col] * conversion).toFixed(2)
    : +(row[col] / conversion).toFixed(2);
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
  colors,
  xName = "x"
) => {
  const seriesData = [];
  const dataFiltered = filterData(dataRaw, filters);
  const variableColumn = getUnique(dataFiltered, variableCol);

  variableColumn.map((v, iVar) => {
    const hcData = [];
    const variableSeries = dataFiltered.filter((row) => row[variableCol] == v);
    variableSeries.map((r, i) => {
      const hcRow = {
        [xName]: r[xCol],
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
