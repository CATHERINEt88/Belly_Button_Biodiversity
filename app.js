d3.json("samples.json").then((bigData) => {

	console.log(bigData);

	var data = bigData;
	var names = data.names;
	names.forEach((name)=>{
    d3.select("#selDataset").append("option").text(name);
  })


var meta = data.metadata;

// //Initialise a page with default plots

var datasamples = data.samples;
console.log(datasamples[1]);

function init() {
initialdata = datasamples.filter((sample) => (sample.id === "940"))[0];
console.log(initialdata);

//define the samples values, otu_ids, and otu_labels
initialvalues = initialdata.sample_values;
initialid = initialdata.otu_ids;
initiallabels = initialdata.otu_labels;

// console.log(initialvalues);
// console.log(initialid);
// console.log(initiallabels);

//select top 10 OTUs with their sample_values, otu_ids, otu_labels
top10values = initialvalues.slice(0,10).reverse();
top10id = initialid.slice(0,10).reverse();
top10labels = initiallabels.slice(0,10).reverse();

console.log(top10values);
console.log(top10id);
console.log(top10labels);


//Draw the Bar Chart
//add the trace for the default plot
var trace1 = {
  x: top10values,
  y:top10id.map(ID => `OTU ${ID}`),
  text:top10labels,
  type: "bar",
  orientation: "h"

};

var data = [trace1];
var layout = {
  title: "OTU ID vs Sample Values",
  xaxis: {title: "Sample Values"},
  // yaxis:{title:"OTU_ID"},
  width: 500,
  height: 600,
  autosize: false
};

//RenderS the plot 
Plotly.newPlot("bar", data, layout);

//Create the bubble chart that display each sample  
var trace2 = {
  x: initialid,
  y: initialvalues,
  mode: "markers",
  marker: {
    size:initialvalues,
    color: initialid
  }
}
var bubbledata = [trace2];
var bubblelayout = {
  title: "Bubble Chart",
  showlegend: false,
  xaxis: {title: "OTU ID"},
  yaxis: {title: "Sample Values"}
}

Plotly.newPlot("bubble", bubbledata, bubblelayout);

console.log(meta);

// var demoid= meta.map(demoinfo => demoinfo.id)[0];
// var demoethnic = meta.map(demoinfo => demoinfo.ethnicity)[2];
// console.log(demoid);  //demoinfo.id[0] returns 940  this selects only ID info
// console.log(demoethnic);//demoinfo.id[2] selects only ethnicity info at the index 2

//demographic info 
//this returns an array
demographicdef = meta.filter(info => (info.id === 940))[0];
console.log(demographicdef);

//this returns an OBJECT
// Object.entries(demographicdef).forEach(([key,value])=> );
Object.entries(demographicdef).forEach(([key,value])=> d3.select("#sample-metadata").append("p").text(`${key}: ${value}`));


var defscrubfreq = demographicdef.wfreq;
//Bonus assignment (gauge chart)
var gaugeData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: defscrubfreq,
    marker: {size: 28, color:'850000'},
    title: {text: '<b>Belly Button Washing Frequency</b> <br> Scrubs per week'},
    type: "indicator",
    text: ['0-1', '1-2','2-3','3-4','4-5','5-6','6-7', '7-8','8-9'],
    textinfo: "text",
    textposition:"inside",
    mode: "gauge+number",
    hole:.5,
    gauge: {
      axis: { range: [null, 9] },
      steps: [
        { range: [0, 1], color: 'rgb(248, 243, 236)' },
        { range: [1, 2], color: 'rgb(244, 241, 229)' },
        { range: [2, 3], color: 'rgb(233, 230, 202)' },
        { range: [3, 4], color: 'rgb(229, 231, 179)' },
        { range: [4, 5], color: 'rgb(213, 228, 157)' },
        { range: [5, 6], color: 'rgb(183, 204, 146)' },
        { range: [6, 7], color: 'rgb(140, 191, 136)' },
        { range: [7, 8], color: 'rgb(138, 187, 143)' },
        { range: [8, 9], color: 'rgb(133, 180, 138)' },
      ],
    }
  }
];

var gaugeLayout = { width: 600, height: 450, margin: { t: 0, b: 0 } };

Plotly.newPlot('gauge', gaugeData, gaugeLayout);


}
init();

//call to update the plot when a change takes place
d3.selectAll("#selDataset").on("change", optionChanged);

function optionChanged()
{
  var newoption = d3.select("#selDataset").property("value");
  console.log(newoption);

  newdata = datasamples.filter(newdata=> (newdata.id === newoption))[0];
  console.log(newdata);

//define the new selected values, otu_ids, and otu_labels
newvalue = newdata.sample_values;
newid = newdata.otu_ids;
newlabel = newdata.otu_labels;
console.log(newvalue);
console.log(newid);
console.log(newlabel);

newtop10value = newvalue.slice(0,10).reverse();
newtop10id= newid.slice(0,10).reverse();
newtop10label = newlabel.slice(0,10).reverse();

console.log(newtop10value);
console.log(newtop10id);
console.log(newtop10label);


//update bar chart
Plotly.restyle("bar", "x", [newtop10value]);
Plotly.restyle("bar", "y", [newtop10id.map(id=>`OTU ID: ${id}`)]);
Plotly.restyle("bar", "text", [newtop10label]);

//Update bubble chart
Plotly.restyle("bubble","x",[newid]);
Plotly.restyle("bubble","y",[newvalue]);
Plotly.restyle("bubble","text",[newlabel]);
Plotly.restyle("bubble","marker.color",[newid]);
Plotly.restyle("bubble","marker.size",[newvalue]);

//update DEMOGRAPHIC INFO
newdemoinfo = meta.filter(info => (info.id == newoption))[0];
console.log(newdemoinfo);
//Clears out the existing info
d3.select("#sample-metadata").html("");

//update the displayed info
Object.entries(newdemoinfo).forEach(([key,value])=> d3.select("#sample-metadata").append("p").text(`${key}: ${value}`));

//New gauge info
var newscrubfreq = newdemoinfo.wfreq;

//update the gauge chart
Plotly.restyle("gauge", "value", newscrubfreq);



}

});
