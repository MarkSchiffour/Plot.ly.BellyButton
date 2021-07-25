var arrColorsG = ["#5899DA", "#E8743B", "#19A979", "#ED4A7B", "#945ECF", "#13A4B4", "#525DF4", "#BF399E", "#6C8893", "white"];
// stack overflow^^

// pull samples
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata= data.metadata;
    var resultsarray= metadata.filter(sampleobject => 
      sampleobject.id == sample);
    var result= resultsarray[0]

    var panel = d3.select("#sample-metadata");

    panel.html("");

    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
}

// build chart function

function buildGaugeChart(sample) {
  console.log("sample", sample);

  d3.json("samples.json").then(data =>{

    var objs = data.metadata;
    
    var matchedSampleObj = objs.filter(sampleData => 
      sampleData["id"] === parseInt(sample));

    gaugeChart(matchedSampleObj[0]);
 });   
}

// Build a GAUGE Chart 

function gaugeChart(data) {
  console.log("gaugeChart", data);
  if(data.wfreq === null){
    data.wfreq = 0;
  }

  let value = parseInt(data.wfreq)
  var data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: value,
      title: { text: "Belly Button Washing Frequency" },
      type: "indicator",
      mode: "gauge+number",
      delta: { reference: 1},
      gauge: { axis: { range: [0, 10, 1] }, color: "blue" }
    }
  ];
  
  var layout = { width: 600, height: 400 };
 Plotly.newPlot('gauge', data, layout);
}


//chart functions 

function buildCharts(sample) {

// Use `d3.json` to fetch the sample data for the plots
d3.json("samples.json").then((data) => {
  var samples= data.samples;
  var resultsarray= samples.filter(sampleobject => 
      sampleobject.id == sample);
  var result= resultsarray[0]

  var ids = result.otu_ids;
  var labels = result.otu_labels;
  var values = result.sample_values;


// Bubble chart


  var LayoutBubble = {
    margin: { t: 25},
    xaxis: { title: "OTU ID" },
    title: "Bacteria Cultures Per sample",
    hovermode: "closest",
    };

    var DataBubble = [ 
    {
      x: ids,
      y: values,
      text: labels,
      mode: "markers",
      marker: {
        color: ids,
        size: values,
        }
    }
  ];

  Plotly.newPlot("bubble", DataBubble, LayoutBubble);


// build the chart
  var bar_data =[
    {
      y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      x:values.slice(0,10).reverse(),
      text:labels.slice(0,10).reverse(),
      type:"bar",
      orientation:"h"

    }
  ];

  var barLayout = {
    title: "Top 10 Bacteria Cultures Found",
    margin: { t: 30, l: 150 }
  };

  Plotly.newPlot("bar", bar_data, barLayout);
});
}
 

// init

function init() {

var selector = d3.select("#selDataset");

// Use the list of sample names to populate the select options
d3.json("samples.json").then((data) => {
  var sampleNames = data.names;
  sampleNames.forEach((sample) => {
    selector
      .append("option")
      .text(sample)
      .property("value", sample);
  });

  // first sample from the list
  const firstSample = sampleNames[0];
  buildMetadata(firstSample);
  buildCharts(firstSample);
  buildGaugeChart(firstSample)


});
}

function optionChanged(newSample) {
// Get new data each time a new sample is selected
buildMetadata(newSample);
buildCharts(newSample);
buildGaugeChart(newSample)

}



// run init
init();