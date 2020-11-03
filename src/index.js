import { cerPalette } from "./modules/util";
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

    tooltip: {
      useHTML: true,
      headerFormat:
        '<span style="font-size:10px;font-weight:bold">{point.key}</span><table>',
      footerFormat: "</table>",
    },

    xAxis: {
      title: {
        style: {
          fontSize: 12,
          color: cerPalette["Cool Grey"],
          fontWeight: "bold",
          fontFamily: "Arial",
        },
      },
      labels: {
        style: {
          fontSize: 12,
          color: cerPalette["Cool Grey"],
        },
      },
    },

    yAxis: {
      title: {
        style: {
          fontSize: 12,
          color: cerPalette["Cool Grey"],
          fontWeight: "bold",
          fontFamily: "Arial",
        },
      },
      labels: {
        formatter: function () {
          return Highcharts.numberFormat(this.value, 0, ".", ",");
        },
        style: {
          fontSize: 12,
          color: cerPalette["Cool Grey"],
        },
      },
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

const frenchTheme = () => {
  Highcharts.french = {
    lang: {
      months: [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
      ],
      weekdays: [
        "Dimanche",
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
      ],
      decimalPoint: ",",
      downloadCSV: "Download CSV (FRA)",
      downloadJPEG: "Download JPEG image (FRA)",
      downloadPDF: "Download PDF document (FRA)",
      downloadPNG: "Download PNG image (FRA)",
      downloadSVG: "Download SVG vector image (FRA)",
      downloadXLS: "Download XLS (FRA)",
      printChart: "Print chart (FRA)",
      resetZoom: "Reset zoom (FRA)",
      viewData: "View data table (FRA)"
    },
  };
  Highcharts.setOptions(Highcharts.french);
};

generalTheme();
//frenchTheme();

import { systemMaps } from "./SystemMaps/maps";
import { kevinCrudeProduction } from "./Kevin/crude_production/crude_production";
import { kevinCrudeExports } from "./Kevin/crude_exports/crude_exports";
import { kevinUsImports } from "./Kevin/us_imports/us_imports";
import { kevinCrudePrices } from "./Kevin/crude_prices/crude_prices";
import { coletteCrudeByRail } from "./Colette/crude_by_rail/crude_by_rail";
import { coletteMarine } from "./Colette/marine_exports/marine_exports";
import { coletteCrudeTakeaway } from "./Colette/crude_takeaway/crude_takeaway";
import { coletteCrudeMode } from "./Colette/crude_export_mode/crude_export_mode";
import { saraGasTraffic } from "./Sara/gas_traffic/gas_traffic";
import { sara2019 } from "./Sara/gas_2019/gas_2019";
import { saraMnp } from "./Sara/st_stephen/sync";
import { rebeccaGasPrices } from "./Rebecca/gas_prices/gas_prices";
import { rebeccaGasProd } from "./Rebecca/gas_production/gas_production";
import { rebeccaGasTrade } from "./Rebecca/gas_trade/gas_trade";
import { cassandraAllPipes } from "./Cassandra/all_pipes/pipeline_metrics";
import { cassandraTolls } from "./Cassandra/tolls/tolls";
import { cassandraSettlements } from "./Cassandra/negotiated_settlements/settlements";
import { ryanNglProduction } from "./Ryan/ngl_production/ngl_production";
import { ryanNglExports } from "./Ryan/ngl_exports/ngl_exports";
import { jenniferFinResources } from "./Jennifer/financial_instruments/fin_resource";
//import { jenniferRatings } from "./Jennifer/credit_ratings/creditRatings";
import { jenniferRatingsMulti } from "./Jennifer/credit_ratings/creditRatingsMultiple";
import { jenniferRatingsCross } from "./Jennifer/credit_ratings_cross_section/credit_ratings_cross";
import { jenniferAbandonment } from "./Jennifer/abandonment_funding/abandonment";

systemMaps();
kevinCrudeProduction();
kevinCrudeExports();
kevinUsImports();
kevinCrudePrices();
coletteCrudeByRail();
coletteMarine();
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
ryanNglProduction();
ryanNglExports();
jenniferFinResources();
//jenniferRatings();
jenniferRatingsMulti();
jenniferRatingsCross();
jenniferAbandonment();
