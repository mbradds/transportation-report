function fillDropUpdate(select_name, options) {
  var refresh =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var defaultSelect =
    arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var select = document.getElementById(select_name);

  function addOption(text, select) {
    select.options[select.options.length] = new Option(text);
  }

  if (refresh) {
    select.options.length = 0;
  }

  options.map(function (option, i) {
    addOption(option, select);
  });

  if (refresh) {
    $(select).selectpicker("refresh");
  }

  if (defaultSelect !== false) {
    $(select).selectpicker("val", defaultSelect);
  }
}

fillDropUpdate('select_units_ie',['test 1','test 2'],false,'test 1')

Highcharts.chart("container", {
  title: {
    text: "Solar Employment Growth by Sector, 2010-2016",
  },

  subtitle: {
    text: "Source: thesolarfoundation.com",
  },

  yAxis: {
    title: {
      text: "Number of Employees",
    },
  },

  xAxis: {
    accessibility: {
      rangeDescription: "Range: 2010 to 2017",
    },
  },

  legend: {
    layout: "vertical",
    align: "right",
    verticalAlign: "middle",
  },

  plotOptions: {
    series: {
      label: {
        connectorAllowed: false,
      },
      pointStart: 2010,
    },
  },

  series: [
    {
      name: "Installation",
      data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175],
    },
    {
      name: "Manufacturing",
      data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434],
    },
    {
      name: "Sales & Distribution",
      data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387],
    },
    {
      name: "Project Development",
      data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227],
    },
    {
      name: "Other",
      data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111],
    },
  ],

  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 500,
        },
        chartOptions: {
          legend: {
            layout: "horizontal",
            align: "center",
            verticalAlign: "bottom",
          },
        },
      },
    ],
  },
});
