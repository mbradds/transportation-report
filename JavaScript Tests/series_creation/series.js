const getData = (Url) => {
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", Url, false);
    Httpreq.send(null);
    return JSON.parse(JSON.stringify(JSON.parse(Httpreq.responseText)));
};

//gets the unique regions to populate the dropdown
const getUnique = (items, filterColumns) => {
    if (Array.isArray(filterColumns)) {
        var lookup = [];
        var result = {};

        for (f in filterColumns) {
            lookup.push({})
            result[filterColumns[f]] = []
        }

        for (var item, i = 0; item = items[i++];) {
            for (f in filterColumns) {
                var name = item[filterColumns[f]];
                if (!(name in lookup[f])) {
                    lookup[f][name] = 1;
                    result[filterColumns[f]].push(name);
                }
            }
        }
        return result

    } else {
        var lookup = {};
        var result = [];
        for (var item, i = 0; item = items[i++];) {
            var name = item[filterColumns];
            if (!(name in lookup)) {
                lookup[name] = 1;
                result.push(name);
            }
        }
        return result
    }
}


const prepareSeriesTidy = (data,filters,variableCol,xCol,yCol,colors) => {

    seriesData = []

    for (const [key, value] of Object.entries(filters)) {
        data = data.filter(row => row[key] == value )
    }

    const variableColumn = getUnique(data,variableCol)
    
    variableColumn.map((v,iVar) => {
        hcData = []
        const variableSeries = data.filter(row => row[variableCol] == v)
        variableSeries.map((r,i) => {
            hcRow = {
                x: r[xCol],
                y: r[yCol]
            }
            hcData.push(hcRow)
        })
        
        seriesData.push({
            name: v,
            data: hcData,
            color: colors[v]
        })

    })

    return seriesData

}


const prepareSeriesTidy1Pass = (data,filters,variableCol,xCol,yCol,colors) => {

    seriesData = {}
    colTotals = {}

    for (const [key, value] of Object.entries(filters)) {
        data = data.filter(row => row[key] == value )
    }

    const valueVars = getUnique(data,variableCol)

    valueVars.map((col,colNum) => {
        seriesData[col] = []
        colTotals[col] = 0
    })

    data.map((row,rowNum) => {
        seriesData[row[variableCol]].push({
            x: row[xCol],
            y: row[yCol]
        })
    })

    var seriesResult = []

    for (const [key, value] of Object.entries(seriesData)) {
      
        seriesResult.push({
            name: key,
            data: value,
            color: colors[key]
        })
        
    }
    
    return seriesResult

}


const prepareSeriesNonTidy = (data,filters,valueVars,xCol,colors) => {
    
    seriesData = {}
    colTotals = {}

    for (const [key, value] of Object.entries(filters)) {
        data = data.filter(row => row[key] == value )
    }

    //initialize each series with an empty list
    valueVars.map((col,colNum) => {
        seriesData[col] = []
        colTotals[col] = 0
    })

    data.map((row,rowNum) => {
        valueVars.map((col,colNum) => {
            seriesData[col].push({
                x: row[xCol],
                y: row[col]
            })
            colTotals[col] = colTotals[col]+row[col]
        })
    })

    var seriesResult = []

    for (const [key, value] of Object.entries(seriesData)) {
        if (colTotals[key]>0) {
            seriesResult.push({
                name: key,
                data: value,
                color: colors[key]
            })
        }
    }

    return seriesResult
}


const prepareSeriesNonTidyUnits = (data,filters,unitsCurrent,baseUnits,conversion,convType,valueVars,colors) => {

    seriesData = {}
    colTotals = {}

    for (const [key, value] of Object.entries(filters)) {
        data = data.filter(row => row[key] == value )
    }

    //initialize each series with an empty list
    valueVars.map((col,colNum) => {
        seriesData[col] = []
        colTotals[col] = 0
    })

    if (unitsCurrent == baseUnits) {

        data.map((row,rowNum) => {
            valueVars.map((col,colNum) => {
                seriesData[col].push({
                    x: row.Period,
                    y: row[col]
                })
                colTotals[col] = colTotals[col]+row[col]
            })
        })

    } else if (unitsCurrent !== baseUnits && convType == '/') {

        data.map((row,rowNum) => {
            valueVars.map((col,colNum) => {
                seriesData[col].push({
                    x: row.Period,
                    y: (row[col]/conversion).toFixed(1)
                })
                colTotals[col] = colTotals[col]+row[col]
            })
        })

    } else if (unitsCurrent !== baseUnits && convType == '*') {

        data.map((row,rowNum) => {
            valueVars.map((col,colNum) => {
                seriesData[col].push({
                    x: row.Period,
                    y: (row[col]*conversion).toFixed(1)
                })
                colTotals[col] = colTotals[col]+row[col]
            })
        })
        
    }

    seriesResult = []

    for (const [key, value] of Object.entries(seriesData)) {
        if (colTotals[key]>0) {
            seriesResult.push({
                name: key,
                data: value,
                color: colors[key]
            })
        }
    }


    return seriesResult
}


const nonTidy = '/natural-gas-liquids-exports-monthly.json'
const nonTidyBbl = '/natural-gas-liquids-exports-monthly_bbl.json'
const tidy = 'natural-gas-liquids-exports-monthly_flat.json'
const nglColors = {'Pipeline':'#054169',
'Marine':'#FFBE4B',
'Railway':'#5FBEE6',
'Truck':'#559B37'}

nglFilter = {'Product':'Propane','Units':'bbl','Region':'Canada'}


var t0Tidy = performance.now()
const data1 = getData(tidy)
const seriesTidy = prepareSeriesTidy(data1,nglFilter,variableCol='variable',xCol='Period',yCol='value',nglColors)
var t1Tidy = performance.now()
console.log("Tidy processing: " + (t1Tidy - t0Tidy) + " milliseconds.")
console.log(seriesTidy)

var t0Tidy1Pass = performance.now()
const data11 = getData(tidy)
const seriesTidy1Pass = prepareSeriesTidy1Pass(data11,nglFilter,variableCol='variable',xCol='Period',yCol='value',nglColors)
var t1Tidy1Pass = performance.now()
console.log("Tidy processing 1 pass: " + (t1Tidy1Pass - t0Tidy1Pass) + " milliseconds.")
console.log(seriesTidy1Pass)

var t0NonTidy = performance.now()
const data2 = getData(nonTidy)
const seriesNonTidy = prepareSeriesNonTidy(data2,nglFilter,valueVars=['Pipeline','Marine','Railway','Truck'],xCol='Period',nglColors)
var t1NonTidy = performance.now()
console.log("Non Tidy processing: " + (t1NonTidy - t0NonTidy) + " milliseconds.")
console.log(seriesNonTidy)

var t0NonTidyUnits = performance.now()
var units = 'm3'
const data3 = getData(nonTidyBbl)
const seriesNonTidyUnits = prepareSeriesNonTidyUnits(data3,nglFilter,unitsCurrent=units,baseUnit='bbl',conversion=6.2898,convType='/',valueVars=['Pipeline','Marine','Railway','Truck'],nglColors)
var t1NonTidyUnits = performance.now()
console.log("Non Tidy processing with one unit: " + (t1NonTidyUnits - t0NonTidyUnits) + " milliseconds.")
console.log(seriesNonTidy)



