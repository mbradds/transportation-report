import { generalTheme } from "./modules/themes";
generalTheme();
import { instructionsChart } from "./modules/charts";
// import { oilMap, gasMap } from "./SystemMaps/maps";
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
import { cassandraSettlements } from "./Cassandra/negotiated_settlements/settlements";
import { cassandraTolls } from "./Cassandra/tolls/tolls";
import { jenniferFinResources } from "./Jennifer/financial_instruments/fin_resource";
import { jenniferAbandonment } from "./Jennifer/abandonment_funding/abandonment";
import { cassandraAllPipes } from "./Cassandra/all_pipes/pipeline_metrics";
import { jenniferRatingsCross } from "./Jennifer/credit_ratings_cross_section/credit_ratings_cross";
import { jenniferRatingsMulti } from "./Jennifer/credit_ratings/creditRatingsMultiple";

async function tab0() {
  instructionsChart();
}

async function tab1() {
  //oilMap();
  kevinCrudeProduction();
  kevinCrudeExports();
  kevinUsImports();
  kevinCrudePrices();
  coletteCrudeMode();
  coletteCrudeByRail();
  coletteMarine();
  coletteCrudeTakeaway();
}

async function tab2() {
  //gasMap();
  rebeccaGasProd();
  rebeccaGasTrade();
  rebeccaGasPrices();
  saraGasTraffic();
  saraMnp();
  sara2019();
}

async function tab3() {
  ryanNglProduction();
  ryanNglExports();
}

async function tab4() {
  cassandraSettlements();
  cassandraTolls();
  jenniferFinResources();
  jenniferAbandonment();
}

async function tab5() {
  cassandraAllPipes();
  jenniferRatingsCross();
  jenniferRatingsMulti();
}

var currentTab = 0;

const tabIndex = () => {
  $(".wb-tabs").on("wb-ready.wb-tabs", function (event) {
    tab0();
  });
  $(".wb-tabs").on("wb-updated.wb-tabs", function (event, ui) {
    currentTab = $(ui).index();
    if (currentTab == 0) {
      tab0();
    } else if (currentTab == 1) {
      tab1();
    } else if (currentTab == 2) {
      tab2();
    } else if (currentTab == 3) {
      tab3();
    } else if (currentTab == 4) {
      tab4();
    } else if (currentTab == 5) {
      tab5();
    }
  });
};

tabIndex();
