d3.json(`samples.json`).then((data) => {
  var dropdown = d3.select("#selDataset");

  data.names.forEach((entry) => {
    dropdown
      .append("option")
      .attr("value", entry)
      .text(entry)
      .property("value");
  });

  function updatePage(meta, samp) {
    var sampleData = d3.select(`#sample-metadata`);

    sampleData.html("");

    Object.entries(meta).forEach(function ([key, value]) {
      sampleData.append("p").text(`${key}:${value}`);
    });

    var xBar = samp.sample_values.slice(0, 10).reverse();

    var yBar = samp.otu_ids
      .slice(0, 10)
      .reverse()
      .map((d) => "OTU " + d);

    var textBar = samp.otu_labels.slice(0, 10).reverse();

    var barData = {
      x: xBar,
      y: yBar,
      text: textBar,
      marker: {
        color: "rgb(61, 136, 197)",
      },
      type: "bar",
      orientation: "h",
    };

    var barLayout = {
      yaxis: {
        autorange: true,
        type: "category",
      },
      margin: {
        l: 100,
        r: 100,
        t: 0,
        b: 50,
      },
    };

    Plotly.newPlot("bar", [barData], barLayout, (responsive = true));

    var bubbleData = [
      {
        x: samp.otu_ids,
        y: samp.sample_values,
        mode: "markers",
        marker: {
          size: samp.sample_values,
          colorscale: "Earth",
          color: samp.otu_ids,
        },
        text: samp.otu_labels,
      },
    ];

    var bubbleLayout = {
      xaxis: { title: "OTU ID" },
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout, (responsive = true));

    var gaugeData = [
      {
        value: parseFloat(meta.wfreq),
        title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
        rotation: 90,
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 9] },
          bar: { color: "black" },
          steps: [
            { range: [0, 1], color: "rgb(221,296,357)" },
            { range: [1, 2], color: "rgb(201,276,337)" },
            { range: [2, 3], color: "rgb(181,256,317)" },
            { range: [3, 4], color: "rgb(161,236,297)" },
            { range: [4, 5], color: "rgb(141,216,277)" },
            { range: [5, 6], color: "rgb(121,196,257)" },
            { range: [6, 7], color: "rgb(101,176,237)" },
            { range: [7, 8], color: "rgb(81,156,217)" },
            { range: [8, 9], color: "rgb(61, 136, 197)" },
          ],
        },
      },
    ];

    var gaugeLayout = { width: 500, height: 400 };

    Plotly.newPlot("gauge", gaugeData, gaugeLayout, (responsive = true));
  }

  function init() {
    var firstMetadata = data.metadata[0];

    var firstSample = data.samples[0];

    updatePage(firstMetadata, firstSample);

    d3.selectAll("#selDataset").on("change", function () {
      var meta = data.metadata.find((d) => d.id == this.value);

      var samp = data.samples.find((d) => d.id == this.value);

      updatePage(meta, samp);
    });
  }

  init();
});
