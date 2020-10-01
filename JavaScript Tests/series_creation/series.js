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


const prepareSeriesTidy = (data,filters) => {

    const colors = ['#054169', '#FFBE4B', '#5FBEE6', '#559B37', '#FF821E', '#871455', '#8c8c96', '#42464B']
    seriesData = []

    for (const [key, value] of Object.entries(filters)) {
        data = data.filter(row => row[key] == value )
    }

    const variableColumn = getUnique(data,'variable')
    
    variableColumn.map((v,iVar) => {
        hcData = []
        const variableSeries = data.filter(row => row.variable == v)
        variableSeries.map((r,i) => {
            hcRow = {
                x: r.Period,
                y: r.value
            }
            hcData.push(hcRow)
        })

        seriesData.push({
            name: v,
            data: hcData,
            color: colors[iVar]
        })

    })

    return seriesData

}


const prepareSeriesNonTidy = (data,filters,valueVars,colors) => {

    seriesData = {}

    for (const [key, value] of Object.entries(filters)) {
        data = data.filter(row => row[key] == value )
    }

    //initialize each series with an empty list
    valueVars.map((col,colNum) => {
        seriesData[col] = []
    })

    data.map((row,rowNum) => {
        valueVars.map((col,colNum) => {
            seriesData[col].push({
                x: row.Period,
                y: row[col]
            })
        })
    })

    seriesResult = []

    for (const [key, value] of Object.entries(seriesData)) {
        seriesResult.push({
            name: key,
            data: value,
            color: colors[key]
        })
    }


    return seriesResult
}


const nonTidy = '/natural-gas-liquids-exports-monthly.json'
const tidy = 'natural-gas-liquids-exports-monthly_flat.json'
const region = 'Canada'
const units = 'bbl'
const product = 'Propane'
const nglColors = {'Pipeline':'#054169',
'Marine':'#FFBE4B',
'Railway':'#5FBEE6',
'Truck':'#559B37'}

nglFilter = {'Product':'Propane','Units':'bbl','Product':'Propane'}


var t0Tidy = performance.now()
const data1 = getData(tidy)
const seriesTidy = prepareSeriesTidy(data1,nglFilter)
var t1Tidy = performance.now()
console.log("Tidy processing: " + (t1Tidy - t0Tidy) + " milliseconds.")
console.log(seriesTidy)

var t0NonTidy = performance.now()
const data2 = getData(nonTidy)
const seriesNonTidy = prepareSeriesNonTidy(data2,nglFilter,valueVars=['Pipeline','Marine','Railway','Truck'],nglColors)
var t1NonTidy = performance.now()
console.log("Non Tidy processing: " + (t1NonTidy - t0NonTidy) + " milliseconds.")
console.log(seriesNonTidy)

