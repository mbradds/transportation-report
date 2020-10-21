const generalTheme = () => {
  Highcharts.transportation = {
    chart: {
      borderColor: "black",
      animation: true,
    },

    plotOptions: {
      column: {
        stacking: "normal",
      },
      area: {
        stacking: "normal",
        marker: false,
        dataLabels: {
          enabled: false,
        },
      },
    },

    yAxis: {
      stackLabels: {
        style: {
          fontWeight: "bold",
          color: (Highcharts.theme && Highcharts.theme.textColor) || "grey",
        },
      },
    },

    noData: {
      style: {
        fontWeight: "bold",
        fontSize: "15px",
        color: "#303030",
      },
    },

    title: {
      text: "",
    },

    legend: {
      itemStyle: {
        font: "12pt Arial",
        color: "black",
      },
    },
  };

  Highcharts.setOptions(Highcharts.transportation);
};

generalTheme();

import { kevinCrudeProduction } from "./Kevin/crude_production/crude_production";
import { kevinCrudeExports } from "./Kevin/crude_exports/crude_exports";
import { kevinUsImports } from "./Kevin/us_imports/us_imports";
import { kevinCrudePrices } from "./Kevin/crude_prices/crude_prices";
import { coletteCrudeByRail } from "./Colette/crude_by_rail/crude_by_rail";
import { coletteCrudeTakeaway } from "./Colette/crude_takeaway/crude_takeaway";
import { coletteCrudeMode } from "./Colette/crude_export_mode/crude_export_mode";
import { saraGasTraffic } from "./Sara/gas_traffic/gas_traffic";
import { sara2019 } from "./Sara/gas_2019/gas_2019";
import { saraMnp } from "./Sara/st_stephen/sync";
import { rebeccaGasPrices } from "./Rebecca/gas_prices/gas_prices";
import { rebeccaGasProd } from "./Rebecca/gas_production/gas_production";
import { rebeccaGasTrade } from "./Rebecca/gas_trade/gas_trade"
import { cassandraAllPipes } from "./Cassandra/all_pipes/pipeline_metrics";
import { cassandraTolls } from "./Cassandra/tolls/tolls";
import { cassandraSettlements } from "./Cassandra/negotiated_settlements/settlements";
import { ryanNglExports } from "./Ryan/ngl_exports/ngl_exports";
import { jenniferFinResources } from "./Jennifer/financial_instruments/fin_resource";

kevinCrudeProduction();
kevinCrudeExports();
kevinUsImports();
kevinCrudePrices();
coletteCrudeByRail();
coletteCrudeTakeaway();
coletteCrudeMode();
saraGasTraffic();
sara2019();
saraMnp();
rebeccaGasPrices();
rebeccaGasProd();
rebeccaGasTrade();
cassandraAllPipes();
cassandraTolls();
cassandraSettlements();
ryanNglExports();
jenniferFinResources();
