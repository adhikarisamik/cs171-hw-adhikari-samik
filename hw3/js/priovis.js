/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 1/28/15.
 */


//TODO: DO IT ! :) Look at agevis.js for a useful structure


PrioVis = function(_parentElement, _data, _metaData){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.displayData = [];



    // TODO: define all constants here

    this.margin = {top: 20, right: 20, bottom: 10, left: 60},
        this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
        this.height = 400 - this.margin.top - this.margin.bottom;

    this.initVis();

}


/**
 * Method that sets up the SVG and the variables
 */
PrioVis.prototype.initVis = function(){

    var that = this; // read about the this


    //TODO: construct or select SVG
    //TODO: create axis and scales


    // constructs SVG layout
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .append("g")
        .attr("class", 'graph')
        .attr("transform", "translate("+this.margin.left+","+this.margin.top+")")

    // creates axis and scales
    this.y = d3.scale.linear()
        .range([0,this.height-160]);


    this.yalt = d3.scale.linear()
        .range([this.height-160,0]);

    this.y2 = d3.scale.linear()
        .range([0,this.height-160]);


    this.y2alt = d3.scale.linear()
        .range([this.height-160,0]);

    this.x = d3.scale.linear()
        .range([0,this.width-180])

    this.color = d3.scale.category20();

    this.yAxis = d3.svg.axis()
        .scale(this.yalt)
        .orient("left");

    this.yAxis2 = d3.svg.axis()
        .scale(this.y2alt)
        .orient("right")

    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .ticks(16)
        .tickFormat(function(d){if (d == 0) {return " "}else {return that.metaData.choices[d+99]}})
        .orient("bottom");

    this.svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + 30 + "," +0+ ")")

    this.svg.append("g")
        .attr("class", "x axis")

    this.svg.append("g")
        .attr("class", "y axis2")
        .attr("transform", "translate(" + 735 + " ,0)")
        .call(this.yAxis2);

    this.svg.append("text")
        .attr("x", (this.width / 2))
        .attr("y", 0 - (this.margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("text-decoration", "underline")
        .text("Distribution of priorities and comparison of proportions to overall votes");





    // Add axes visual elements
    //this.svg.append("g")
    //    .attr("class", "x axis")
    //    .attr("transform", "translate(0," + this.height + ")")

    // filter, aggregate, modify data
    this.wrangleData(null);

    // call the update method
    this.updateVis();
}


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
PrioVis.prototype.wrangleData= function(_filterFunction){

    // displayData should hold the data which is visualized
    this.displayData = this.filterAndAggregate(_filterFunction);

    //// you might be able to pass some options,
    //// if you don't pass options -- set the default options
    //// the default is: var options = {filter: function(){return true;} }
    //var options = _options || {filter: function(){return true;}};





}



/**
 * the drawing function - should use the D3 selection, enter, exit
 */
PrioVis.prototype.updateVis = function(){

    // Dear JS hipster,
    // you might be able to pass some options as parameter _option
    // But it's not needed to solve the task.
    // var options = _options || {};


    // TODO: implement...
    // TODO: ...update scales
    // TODO: ...update graphs

    var that = this;

    // updates scales
    this.y.domain([0,d3.max(that.displayData, function(d) { return d; })]);
    this.yalt.domain([0,d3.max(that.displayData, function(d) { return d; })]);
    this.y2.domain([0,d3.max(that.displayData, function(d) { return d/7423268; })]);
    this.y2alt.domain([0,d3.max(that.displayData, function(d) { return d/7423268; })]);
    this.x.domain([0,16]);

    // updates axis
    this.svg.select(".y.axis")
        .attr("transform", "translate(" + 20 + " ,0)")
        .call(this.yAxis);

    this.svg.select(".y.axis2")
        .attr("transform", "translate(" + 735 + " ,0)")
        .call(this.yAxis2);

    this.svg.select(".x.axis")
        .attr("transform", "translate(0,215)")
        .call(that.xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-38)"
        });

    // updates graph

    // Data join
    var bar = this.svg.selectAll(".rect")
        .data(this.displayData, function(d){return d});

    var dots = this.svg.selectAll("circle")
        .data(this.displayData, function(d){return d/7423268});

    // Append new bar groups, if required
    var bar_enter = bar.enter().append("g").append("rect");
    var circle_enter = dots.enter().append("g").append("circle")



    // Add click interactivity
    bar_enter.on("click", function(d) {
        $(that.eventHandler).trigger("selectionChanged", that.brush.extent());
    })

    circle_enter.on("click", function(d) {
        $(that.eventHandler).trigger("selectionChanged", that.brush.extent());
    })

    // Add attributes (position) to all bars
    bar
        .attr("class", "rect")
        .attr("fill", function(d,i) {
            return that.color(i);
        })

    dots
        .attr("class","circle")
        .attr("r", 6)
        .attr("fill", "steelblue")



    // Remove the extra bars
    bar.exit()
        .remove();

    dots.exit()
        .remove();

    // Update all inner rects and texts (both update and enter sets)

    bar.select("rect")
        .transition()
        .attr("x", function(d,i) {return that.x(i)+25 })
        .attr("y", function(d,i) {return 210-that.y(d) })
        .attr("width", 40)
        .attr("height", function(d, i) {
            return that.y(d);
        });

    dots.select("circle")
        .transition()
        .attr("cx", function(d,i) {return that.x(i)+50 })
        .attr("cy", function(d, i) {
            return 160-that.y(d);
        })
        .attr("r", 6)
        .attr("fill", "steelblue")



}


/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
PrioVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){

    // TODO: call wrangle function


    var filter = {"start": selectionStart, "end": selectionEnd}


    this.wrangleData(filter)

    this.updateVis();


}


/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */



/**
 * The aggregate function that creates the counts for each age for a given filter.
 * @param _filter - A filter can be, e.g.,  a function that is only true for data of a given time range
 * @returns {Array|*}
 */
PrioVis.prototype.filterAndAggregate = function(_filter){


    // Set filter to a function that accepts all items
    // ONLY if the parameter _filter is NOT null use this parameter
    var filter = function(){return true;}
    if (_filter != null){
        filter = _filter;
    }
    //Dear JS hipster, a more hip variant of this construct would be:
    // var filter = _filter || function(){return true;}

    var that = this;


    // create an array of values for age 0-100
    var res = d3.range(16).map(function () {
        return 0;
    });
    // accumulate all values that fulfill the filter criterion

    // TODO: implement the function that filters the data and sums the values


    that.data.map(function (d) {
        if (d.time < filter.start || d.time > filter.end) {}
        else {
            for (i = 0; i < d.prios.length; i++) {
                res[i] = res[i] + d.prios[i];
            }
        }
        return d.time.toDateString();
    });
    console.log(res);
    return res;


}




