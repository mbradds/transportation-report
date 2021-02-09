import fra from "./fra.json";

const frenchSeries = {
  container_crude_production: {
    "Conventional Light": "Léger classique",
    "Conventional Heavy": "Lourd classique",
    "Field Condensate": "Condensat de puits",
    "Mined Bitumen": "Bitume extrait",
    "In Situ Bitumen": "Bitume in situ",
  },
  container_crude_imports: {
    "U.S. crude oil imports from ROW":
      "Importations américaines de pétrole brut du reste du monde",
    "U.S. crude oil exports": "Exportations américaines de pétrole brut",
    "U.S. crude oil imports from Canada":
      "Importations américaines de pétrole brut du Canada",
  },
  container_crude_prices: {
    Differential: "Écart",
  },
  container_crude_mode: {
    Marine: "Navire",
    Rail: "Train",
  },
  container_crude_by_rail: {
    "Crude by Rail": "Transport de brut par chemin de fer",
    "WCS-WTI Differential": "Écart entre WCS et WTI",
  },
  container_crude_marine: {
    "Mb/d": "kb/j",
  },
  container_crude_takeaway: {
    "Total Supply Available for Export":
      "Quantité totale disponible à l’exportation",
    "Express Pipeline": "Pipeline Express",
    "Milk River Pipeline": "Pipeline Milk River",
    "Aurora Pipeline": "Pipeline Aurora",
    "Trans Mountain Pipeline": "Pipeline Trans Mountain",
    "Enbridge Canadian Mainline": "Réseau d’Enbridge au Canada",
    "Keystone Pipeline": "Pipeline Keystone",
    Rail: "Train",
  },
  container_gas_production: {
    "Conventional Non-tight":
      "Gaz naturel classique ne provenant pas de réservoirs étanches",
    Tight: "Gaz de réservoir étanche",
    Shale: "Schistes",
    "Coalbed Methane": "Méthane de houille",
  },
  container_gas_trade: {
    "U.S. West": "Ouest américain",
    "U.S. Midwest": "Midwest américain",
    "U.S. East": "Est des États-Unis",
  },
  container_gas_trade_map: {
    "U.S. West": "Ouest américain",
    "U.S. Midwest": "Midwest américain",
    "U.S. East": "Est des États-Unis",
  },
  container_gas_prices: {
    "Alberta NIT": "Carrefour NIT en Alberta",
    "Henry Hub": "Carrefour Henry",
  },
  container_gas_map: {
    "Alberta NIT": "Carrefour NIT en Alberta",
    "Henry Hub": "Carrefour Henry",
  },
  container_gas_traffic: {
    "Alliance Pipeline - Border": "Pipeline Alliance – Frontière",
    "Westcoast Energy Inc. - BC Pipeline - Huntingdon/Lower Mainland":
      "Westcoast Energy Inc. – Gazoduc BC Pipeline – Huntingdon/Vallée du bas Fraser",
  },
  container_mnp: {
    Exports: "Exportations",
    Imports: "Importations",
    Capacity: "Capacité",
  },
  container_offshore: {
    "Sable Island": "Île de Sable",
  },
  container_gas_2019: {
    "NGTL System - Upstream of James River - intracanada":
      "Réseau de NGTL – En amont de la rivière James – Intra-Canada",
    "TC Canadian Mainline - Prairies - intracanada":
      "Réseau principal de TC au Canada – Prairies – Intra-Canada",
    "Foothills System - Kingsgate - export":
      "Réseau Foothills – Kingsgate – Exportation",
    "NGTL System - West Gate - intracanada":
      "Réseau de NGTL – Entrée ouest – Intra-Canada",
    "Foothills System - Monchy - export":
      "Réseau Foothills – Monchy – Exportation",
    "Enbridge BC Pipeline - Huntingdon Export - export":
      "	Gazoduc BC d’Enbridge – Point d’exportation de Huntingdon – Exportation",
    "Alliance Pipeline - Border - export":
      "Pipeline Alliance – Frontière – Exportation",
    "TC Canadian Mainline - Iroquois - export":
      "	Réseau principal de TC au Canada – Iroquois – Exportation",
    "M&NP Pipeline - St. Stephen - import":
      "Pipeline de M&NP – St. Stephen – Importation",
    "TC Canadian Mainline - Niagara - import":
      "Réseau principal de TC au Canada – Niagara – Importation",
  },
  container_ngl_production: {
    Ethane: "Éthane",
  },
  container_ngl: {
    Truck: "Camion",
    Marine: "Navire",
    Rail: "Train",
  },
  container_ngl_destination: {
    Other: "Autre",
  },
  container_settlements_oil: {
    "Settlements with fixed end date":
      "Règlements assortis d’une date de fin déterminée",
  },
  container_fin_resources_class: {
    Oil: "pétrole",
    Gas: "gaz",
  },
  container_fin_resources: {
    "Companies using Financial Instrument":
      "Sociétés ayant recours à un instrument financier",
    "Financial Instrument Total": "Total des instruments financiers",
  },
  container_abandonment: {
    "Amounts Set Aside": "Sommes mises de côté",
    "Remaining Estimate": "Estimation restante",
  },
  container_tolls_oil: fra.pipeline_name,
  container_tolls_gas: fra.pipeline_name,
};

export function translate() {
  Highcharts.charts.map((chart) => {
    try {
      let fra = frenchSeries[chart.renderTo.id];
      chart.series.map((s, i) => {
        if (fra.hasOwnProperty(s.name)) {
          s.name = fra[s.name];
        }
      });
      chart.isDirtyLegend = true;
      chart.redraw();
    } catch (err) {
      console.log("didnt tanslate: ", chart.renderTo.id);
    }
  });
}
