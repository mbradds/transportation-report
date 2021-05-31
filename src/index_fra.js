import { generalTheme, frenchTheme } from "./modules/themes";
import { translateFra } from "./modules/translateSeries.js";
import { instructionsChart } from "./modules/charts";
import { kevinCrudeProduction } from "./Kevin/crude_production/crude_production";
import { kevinCrudeExports } from "./Kevin/crude_exports/crude_exports";
import { kevinUsImports } from "./Kevin/us_imports/us_imports";
import { kevinCrudePrices } from "./Kevin/crude_prices/crude_prices";
import { coletteCrudeMode } from "./Colette/crude_export_mode/crude_export_mode";
import { coletteCrudeByRail } from "./Colette/crude_by_rail/crude_by_rail";
import { coletteMarine } from "./Colette/marine_exports/marine_exports";
import { coletteCrudeTakeaway } from "./Colette/crude_takeaway/crude_takeaway";
import { rebeccaGasProd } from "./Rebecca/gas_production/gas_production";
import { rebeccaGasTrade } from "./Rebecca/gas_trade/gas_trade";
import { rebeccaGasPrices } from "./Rebecca/gas_prices/gas_prices";
import { saraGasTraffic } from "./Sara/gas_traffic/gas_traffic";
import { saraMnp } from "./Sara/st_stephen/st_stephen";
import { sara2019 } from "./Sara/gas_2019/gas_2019";
import { ryanNglProduction } from "./Ryan/ngl_production/ngl_production";
import { ryanNglExports } from "./Ryan/ngl_exports/ngl_exports";
import { ryanNglDestination } from "./Ryan/ngl_exports/ngl_destination";
import { cassandraSettlements } from "./Cassandra/negotiated_settlements/settlements";
import { cassandraTolls } from "./Cassandra/tolls/tolls";
import { jenniferFinResources } from "./Jennifer/financial_instruments/fin_resource";
import { jenniferAbandonment } from "./Jennifer/abandonment_funding/abandonment";
import { cassandraAllPipes } from "./Cassandra/all_pipes/pipeline_metrics";
import { jenniferRatingsCross } from "./Jennifer/credit_ratings_cross_section/credit_ratings_cross";
import { jenniferRatingsMulti } from "./Jennifer/credit_ratings/creditRatingsMultiple";
import fra from "./modules/fra.json";
import justWhy from "ie-gang";
try {
  let warningParams = {
    message: fra.ieWarnMessage,
    type: "alert",
    title: fra.ieWarnTitle,
    applyIE: false,
  };
  justWhy.ieWarn(warningParams);
} catch (err) {
  console.log("ieWarn error");
}
generalTheme();
frenchTheme();

async function loadAllCharts(fra) {
  console.time(`chart loading`);
  let arrayOfCharts = [
    instructionsChart(fra.instructionsChart),
    kevinCrudeProduction(
      fra.crudeProduction,
      fra.shared,
      fra.units,
      translateFra
    ),
    kevinCrudeExports(fra.crudeExports, fra.units, translateFra),
    kevinCrudePrices(fra.crudePrices, fra.units),
    kevinUsImports(fra.crudeImports, fra.units, translateFra),
    coletteCrudeMode(fra.crudeMode, fra.units),
    coletteCrudeByRail(fra.crudeByRail, fra.units, translateFra),
    coletteMarine(fra.marineCrudeExports, fra.units),
    coletteCrudeTakeaway(fra.crudeTakeaway, fra.units, translateFra),
    rebeccaGasProd(fra.gasProduction, fra.shared, fra.units, translateFra),
    rebeccaGasTrade(fra.gasTrade, fra.units, translateFra),
    rebeccaGasPrices(fra.gasPrices),
    saraGasTraffic(fra.gasTraffic, fra.units, translateFra),
    saraMnp(fra.gasMnp, fra.units, translateFra),
    sara2019(fra.gas2019, fra.units, translateFra),
    ryanNglProduction(fra.nglProduction, fra.shared, fra.units, translateFra),
    ryanNglExports(fra.nglExports, fra.units, translateFra),
    ryanNglDestination(fra.nglDestination, fra.units, translateFra),
    cassandraSettlements(fra.settlements, fra.pipeline_name),
    cassandraTolls(fra.tolls),
    jenniferFinResources(fra.finResource, translateFra),
    jenniferAbandonment(fra.abandon, fra.company_name, translateFra),
    cassandraAllPipes(fra.finance, translateFra),
    jenniferRatingsCross(fra.ratingsCross, fra.ratingsLevel),
    jenniferRatingsMulti(fra.ratingsMultiple, fra.ratingsLevel),
  ];
  Promise.allSettled(arrayOfCharts).then((value) => {
    translateFra();
    console.timeEnd(`chart loading`);
  });
}
loadAllCharts(fra);
