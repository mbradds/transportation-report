Highcharts.mapChart("container", {
  chart: {
    type: "map",
    map: "countries/us/custom/us-all-mainland",
  },

  title: {
    text: null,
  },

  credits: {
    enabled: false,
  },

  tooltip: {
    formatter: function () {
      return this.series.name;
    },
  },

  plotOptions: {
    map: {
      allAreas: false,
    },
    series: {
      point: {
        events: {
          mouseOver: function () {
            var selectedName = this.series.name;
            this.series.chart.series.forEach(function (s, seriesNum) {
              if (s.name != selectedName) {
                s.setVisible(false);
              } else {
                s.setVisible(true);
              }
            });
            // this.series.data.forEach(function (p, i) {
            //   if (p.value == 1) {
            //     p.setState("hover");
            //   } else {
            //     p.setState("inactive");
            //   }
            // });
          },
          mouseOut: function () {
            var selectedName = this.series.name;
            this.series.chart.series.forEach(function (s, seriesNum) {
              if (s.name != selectedName) {
                // s.update({
                //   opacity: 1,
                // });
                s.setState('select',false)
              }
            });
            // this.series.data.forEach(function (p, i) {
            //   if (p.value == 1) {
            //     p.setState("");
            //   }
            // });
          },
        },
      },
      borderWidth: 1,
    },
  },

  series: [
    {
      name: "PADD 1",
      data: [
        ["us-me", 1],
        ["us-vt", 1],
        ["us-nh", 1],
        ["us-ma", 1],
        ["us-ct", 1],
        ["us-ri", 1],
        ["us-ny", 1],
        ["us-pa", 1],
        ["us-nj", 1],
        ["us-de", 1],
        ["us-md", 1],
        ["us-wv", 1],
        ["us-va", 1],
        ["us-nc", 1],
        ["us-sc", 1],
        ["us-ga", 1],
        ["us-fl", 1],
      ],
      color: "#559B37",
    },
    {
      name: "PADD 2",
      data: [
        ["us-nd", 1],
        ["us-sd", 1],
        ["us-ne", 1],
        ["us-ks", 1],
        ["us-ok", 1],
        ["us-mn", 1],
        ["us-ia", 1],
        ["us-mo", 1],
        ["us-wi", 1],
        ["us-il", 1],
        ["us-mi", 1],
        ["us-in", 1],
        ["us-ky", 1],
        ["us-tn", 1],
        ["us-oh", 1],
      ],
      color: "#5FBEE6",
    },
    {
      name: "PADD 3",
      data: [
        ["us-tx", 1],
        ["us-la", 1],
        ["us-nm", 1],
        ["us-ms", 1],
        ["us-al", 1],
        ["us-ar", 1],
      ],
      color: "#054169",
    },
    {
      name: "PADD 4",
      data: [
        ["us-mt", 1],
        ["us-id", 1],
        ["us-ut", 1],
        ["us-co", 1],
        ["us-wy", 1],
      ],
      color: "#FFBE4B",
    },
    {
      name: "PADD 5",
      data: [
        ["us-wa", 1],
        ["us-or", 1],
        ["us-ca", 1],
        ["us-nv", 1],
        ["us-az", 1],
      ],
      color: "#FF821E",
    },
  ],
});
