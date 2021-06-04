import { cerPalette } from "./util.js";
export const generalTheme = () => {
  Highcharts.transportation = {
    chart: {
      borderColor: "black",
      animation: true,
    },

    plotOptions: {
      series: {
        animation: {
          duration: 700,
        },
      },
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

export const frenchTheme = () => {
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
      thousandsSep: " ",
      downloadCSV: "Télécharger en CSV",
      downloadJPEG: "Télécharger en JPEG",
      downloadPDF: "Télécharger en PDF",
      downloadPNG: "Télécharger en PNG",
      downloadSVG: "Télécharger en SVG",
      downloadXLS: "Télécharger en XLS",
      printChart: "Imprimer le graphique",
      resetZoom: "Réinitialiser l’agrandissement",
      viewData: "Afficher les données",
    },
  };
  Highcharts.setOptions(Highcharts.french);
};
