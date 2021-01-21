import { generalTheme, frenchTheme } from "./modules/themes";
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
import ieWarn from "ie-gang";
let warningParams = {
  message:
    "We noticed you are using Internet Explorer. Please consider using a different browser for a better experience on this page.",
  type: "alert",
  title: "Old Browser Warning",
  applyIE: false,
};
ieWarn(warningParams);
generalTheme();
frenchTheme();

async function loadAllCharts() {
  console.time(`chart loading`);
  let arrayOfCharts = [
    instructionsChart(),
    kevinCrudeProduction(),
    kevinCrudeExports(),
    kevinCrudePrices(),
    kevinUsImports(),
    coletteCrudeMode(),
    coletteCrudeByRail(),
    coletteMarine(),
    coletteCrudeTakeaway(),
    rebeccaGasProd(),
    rebeccaGasTrade(),
    rebeccaGasPrices(),
    saraGasTraffic(),
    saraMnp(),
    sara2019(),
    ryanNglProduction(),
    ryanNglExports(),
    ryanNglDestination(),
    cassandraSettlements(),
    cassandraTolls(),
    jenniferFinResources(),
    jenniferAbandonment(),
    cassandraAllPipes(),
    jenniferRatingsCross(),
    jenniferRatingsMulti(),
  ];
  Promise.all(arrayOfCharts).then((value) => {
    console.timeEnd(`chart loading`);
  });
}
loadAllCharts();
