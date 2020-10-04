import {getData,prepareSeriesNonTidy,prepareSeriesNonTidyUnits,prepareSeriesTidy} from '../modules/util.js'

const nonTidy = "natural-gas-liquids-exports-monthly.json";
const nonTidyBbl = "natural-gas-liquids-exports-monthly_bbl.json";
const tidy = "natural-gas-liquids-exports-monthly_flat.json";
const nglColors = {
  Pipeline: "#054169",
  Marine: "#FFBE4B",
  Railway: "#5FBEE6",
  Truck: "#559B37",
};


var nglFilter = { Product: "Propane", Units: "bbl", Region: "Canada" };

var t0Tidy = performance.now();
const data1 = JSON.parse(getData(tidy));
const seriesTidy = prepareSeriesTidy(
  data1,
  nglFilter,
  "variable",
  "Period",
  "value",
  nglColors
);
var t1Tidy = performance.now();
console.log("Tidy processing: " + (t1Tidy - t0Tidy) + " milliseconds.");
console.log(seriesTidy);

// var t0Tidy1Pass = performance.now();
// const data11 = getData(tidy);
// const seriesTidy1Pass = prepareSeriesTidy1Pass(
//   data11,
//   nglFilter,
//   (variableCol = "variable"),
//   (xCol = "Period"),
//   (yCol = "value"),
//   nglColors
// );
// var t1Tidy1Pass = performance.now();
// console.log(
//   "Tidy processing 1 pass: " + (t1Tidy1Pass - t0Tidy1Pass) + " milliseconds."
// );
// console.log(seriesTidy1Pass);

var t0NonTidy = performance.now();
const data2 = JSON.parse(getData(nonTidy));
const seriesNonTidy = prepareSeriesNonTidy(
  data2,
  nglFilter,
  ["Pipeline", "Marine", "Railway", "Truck"],
  "Period",
  nglColors
);
var t1NonTidy = performance.now();
console.log(
  "Non Tidy processing: " + (t1NonTidy - t0NonTidy) + " milliseconds."
);
console.log(seriesNonTidy);

var t0NonTidyUnits = performance.now();
var units = "m3";
const data3 = JSON.parse(getData(nonTidyBbl));
const seriesNonTidyUnits = prepareSeriesNonTidyUnits(
  data3,
  nglFilter,
  units,
  "bbl",
  6.2898,
  "/",
  ["Pipeline", "Marine", "Railway", "Truck"],
  'Period',
  nglColors
);
var t1NonTidyUnits = performance.now();
console.log(
  "Non Tidy processing with one unit: " +
    (t1NonTidyUnits - t0NonTidyUnits) +
    " milliseconds."
);
console.log(seriesNonTidy);
