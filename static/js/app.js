//use d3 json to read files
d3.json("samples.json").then(function(alldata) {
    console.log(alldata);   //returns whole dataset object

    var data = alldata;
    var names = data.names;
    // console.log(names);
    //append all the names in the list as selection in the dropdown menu
    //select html element using D3 to append all the options
    names.forEach(data=>d3.select("#selDataset").append("option").text(data));
    
//DISPLAY THE WHOLE DATASET
var samplesdata = data.samples;
console.log(samplesdata);   //the WHOLE SAMPLES dataset
console.log(samplesdata[0]);  //the first entry on this dataset //ID IS 940

function init() {

//DISPLAY THE FIRST DATASET, THIS WILL BE USED ON TO PLOT THE CHART BY DEFAULT
defaultdata = samplesdata.filter((data) => data.id === "940")[0];
console.log(defaultdata);   

//select the OTUID, OTULABEL, SAMPLE VALUES found in dataset
initialID = defaultdata.otu_ids;
initiallabel = defaultdata.otu_labels;
initialvalue = defaultdata.sample_values;

console.log(initialID);
console.log(initiallabel);
console.log(initialvalue);

//SELECT TOP 10 results only to display
top10otuid = initialID.slice(0,10).reverse();
top10label = initiallabel.slice(0,10).reverse();
top10value = initialvalue.slice(0,10).reverse();

console.log(top10otuid);
console.log(top10label);
console.log(top10value);

//draw the DEFAULT BAR CHART
//ADD the trace for the default plot 940 
var trace1 = {
    x: top10value,
    y: top10otuid.map(otuid => `OTU_id ${otuid}`),
    type: "bar",
    text: top10label,
    orientation: "h"
};

var bardata = [trace1];

var barlayout = {
    title: "OTU ID vs SAMPLES VALUES",
    xaxis: {title : "SAMPLES VALUES"},
    yaxis: {title : "OTU_ID"},
    width: 500,
    height: 600, 
    autosize : false
};
//RENDERING the plots
Plotly.newPlot("bar",bardata, barlayout);

//CREATE BUBBLE CHART that displays each sample
//grab the values of OTUIDs, SAMPLESVALUES, OTUIDS, OTULABELS
var trace2 = {
x: initialID,
y: initialvalue,
mode: "markers",
marker: {
    size: initialvalue,
    color: initialID
}
};

var bubbledata = [trace2];
var bubblelayout = {
    title:"Bubbkle Chart for OTUID vs Sample Values",
    showlegend: false,
    height: 600,
    width:700,
    xaxis: {title: "OTU IDs"},
    yaxis: {title: "Sample Values"}
}

Plotly.newPlot("bubble", bubbledata, bubblelayout);

//NOW DISPLAY THE SAMPLE METADATA DATASET ; includes the individuals demo's info.
//display each key-value pair from the metadata 
var meta = data.metadata;
console.log(meta); //return the whole objects of arrays
console.log(meta[0]); //return only the first result

metademographic = meta.filter((data) => (data.id == 940))[0];  //or we use the fuklter to return an array
console.log(metademographic);

// Object.entries(metademographic).forEach(([key,value]) =>console.log(`Key: ${key}, Value: ${value}`));
// Object.keys(metademographic).forEach(key => console.log(key));
// Object.values(metademographic).forEach(value => console.log(value));
Object.entries(metademographic).forEach(([key,value]) => d3.select("#sample-metadata").append('p').text(`${key} : ${value}`));

//BONUS : gauge chart
//Grab the value of washing frequency from individual (metadata)
var washfreq = metademographic.wfreq;
console.log(washfreq);

var gaugeData = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: washfreq,
      title: {text: '<b>Belly Button Washing Frequency</b> <br> Scrubs per week'},
      type: "indicator",
      mode: "gauge+number",
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

d3.selectAll("#selDataset").on("change",optionChanged);


//define the onchange function
function optionChanged() {
//store the reference into a value from html element
var changeoption = d3.select("#selDataset").property("value");
console.log(changeoption);

newdataset = samplesdata.filter((data) => data.id === changeoption)[0];
console.log(newdataset);

newotuid = newdataset.otu_ids;
newdatavalues = newdataset.sample_values;
newdatalabel = newdataset.otu_labels;

console.log(newotuid);
console.log(newdatavalues);
console.log(newdatalabel);

//using the new chosen option to slice the top 10 info for display
newtop10id = newotuid.slice(0,10).reverse();
newtop10value = newdatavalues.slice(0,10).reverse();
newtop10label = newdatalabel.slice(0,10).reverse() ;

//UPDATE new data on the bar chart
Plotly.restyle("bar", "x", [newtop10value]);
Plotly.restyle("bar", "y", [newtop10id.map(id=>`OTU ID : ${id}`)]);
Plotly.restyle("bar", "text", [newtop10label]);

//UPDATE new data on the bubble chart
Plotly.restyle("bubble","x",[newtop10id]);
Plotly.restyle("bubble","y",[newtop10value]);
Plotly.restyle("bubble","text",[newtop10label]);
Plotly.restyle("bubble","marker.color",[newtop10id]);
Plotly.restyle("bubble","marker.size",[newtop10value]);

//UPDATE the demographic info 
d3.select("#sample-metadata").html("");
newoptiondemo = meta.filter(info => info.id == changeoption)[0];
console.log(newoptiondemo);

Object.entries(newoptiondemo).forEach(([key,value]) => d3.select("#sample-metadata").append('p').text(`${key} : ${value}`));






}





});







