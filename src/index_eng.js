import { generalTheme } from "./modules/themes";
import { translateEng } from "./modules/translateSeries.js";
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
import eng from "./modules/eng.json";
import justWhy from "ie-gang";
try {
  let warningParams = {
    message: eng.ieWarnMessage,
    type: "alert",
    title: eng.ieWarnTitle,
    applyIE: false,
  };
  justWhy.ieWarn(warningParams);
} catch (err) {
  console.log("ieWarn error");
}

generalTheme();

async function loadAllCharts(eng) {
  console.time(`chart loading`);
  let arrayOfCharts = [
    instructionsChart(eng.instructionsChart),
    kevinCrudeProduction(
      eng.crudeProduction,
      eng.shared,
      eng.units,
      translateEng
    ),
    kevinCrudeExports(eng.crudeExports, eng.units, translateEng),
    kevinCrudePrices(eng.crudePrices, eng.units),
    kevinUsImports(eng.crudeImports, eng.units, translateEng),
    coletteCrudeMode(eng.crudeMode, eng.units),
    coletteCrudeByRail(eng.crudeByRail, eng.units, translateEng),
    coletteMarine(eng.marineCrudeExports, eng.units),
    coletteCrudeTakeaway(eng.crudeTakeaway, eng.units, translateEng),
    rebeccaGasProd(eng.gasProduction, eng.shared, eng.units, translateEng),
    rebeccaGasTrade(eng.gasTrade, eng.units, translateEng),
    rebeccaGasPrices(eng.gasPrices),
    saraGasTraffic(eng.gasTraffic, eng.units, translateEng),
    saraMnp(eng.gasMnp, eng.units, translateEng),
    sara2019(eng.gas2019, eng.units, translateEng),
    ryanNglProduction(eng.nglProduction, eng.shared, eng.units, translateEng),
    ryanNglExports(eng.nglExports, eng.units, translateEng),
    ryanNglDestination(eng.nglDestination, eng.units, translateEng),
    cassandraSettlements(eng.settlements),
    cassandraTolls(eng.tolls),
    jenniferFinResources(eng.finResource, translateEng),
    jenniferAbandonment(eng.abandon, undefined, translateEng),
    cassandraAllPipes(eng.finance, translateEng),
    jenniferRatingsCross(eng.ratingsCross, false),
    jenniferRatingsMulti(eng.ratingsMultiple, false),
  ];
  Promise.allSettled(arrayOfCharts).then((value) => {
    console.timeEnd(`chart loading`);
  });
}
loadAllCharts(eng);
