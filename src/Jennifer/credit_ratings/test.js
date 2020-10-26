Highcharts.chart("container", {
  chart: {
    type: "line",
    borderWidth: 1,
  },

  plotOptions: {
    line: {
      marker: {
        enabled: true,
      },
    },
  },

  credits: {
    text: "Source: S&P, DBRS, Moody's",
  },

  legend: {
    enabled: true,
  },

  yAxis: {
    title: {
      text: "Standardized Credit Rating",
    },
    gridLineWidth: 3,
    gridZIndex: 1,
    categories: true,
  },
  xAxis: {
    categories: true,
  },
  series: [
    {
      name: "NOVA-DBRS",
      data: [
        {
          x: 2012,
          y: 21,
        },
        {
          x: 2013,
          y: 20,
        },
        {
          x: 2014,
          y: 20,
        },
        {
          x: 2015,
          y: 20,
        },
        {
          x: 2016,
          y: 20,
        },
        {
          x: 2017,
          y: 20,
        },
        {
          x: 2018,
          y: 20,
        },
        {
          x: 2019,
          y: 20,
        },
        {
          x: 2020,
          y: 20,
        },
      ],
      type: "line",
      color: "#054169",
    },
    {
      name: "NOVA-Moodys",
      data: [
        {
          x: 2012,
          y: 20,
        },
        {
          x: 2013,
          y: 20,
        },
        {
          x: 2014,
          y: 20,
        },
        {
          x: 2015,
          y: 20,
        },
        {
          x: 2016,
          y: 20,
        },
        {
          x: 2017,
          y: 20,
        },
        {
          x: 2018,
          y: 20,
        },
        {
          x: 2019,
          y: 19,
        },
        {
          x: 2020,
          y: 19,
        },
      ],
      type: "line",
      color: "#054169",
    },
    {
      name: "NOVA-S&P",
      data: [
        {
          x: 2012,
          y: 20,
        },
        {
          x: 2013,
          y: 20,
        },
        {
          x: 2014,
          y: 20,
        },
        {
          x: 2015,
          y: 20,
        },
        {
          x: 2016,
          y: 20,
        },
        {
          x: 2017,
          y: 20,
        },
        {
          x: 2018,
          y: 19,
        },
        {
          x: 2019,
          y: 19,
        },
        {
          x: 2020,
          y: 19,
        },
      ],
      type: "line",
      color: "#054169",
    },
  ],
});
