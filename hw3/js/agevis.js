/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 1/28/15.
 */



/*
 *
 * ======================================================
 * We follow the vis template of init - wrangle - update
 * ======================================================
 *
 * */

/**
 * AgeVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
AgeVis = function(_parentElement, _data, _metaData){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.displayData = [];



    // TODO: define all constants here

    this.margin = {top: 20, right: 20, bottom: 20, left: 20},
        this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
        this.height = 400 - this.margin.top - this.margin.bottom;

    this.initVis();

}


/**
 * Method that sets up the SVG and the variables
 */
AgeVis.prototype.initVis = function(){

    var that = this; // read about the this


    //TODO: construct or select SVG
    //TODO: create axis and scales


    // constructs SVG layout
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + 0 + "," + 0 + ")");

    // creates axis and scales
    this.x = d3.scale.linear()
        .range([20, this.width]);

    this.y = d3.scale.linear()
        .range([this.height, 20]);


    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient("left");

    this.svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + 20 + "," +0+ ")")

    this.area = d3.svg.area()
        .interpolate("monotone")
        .y(function(d,i) {return that.y(i) })
        .x0(20)
        .x1(function(d) { return that.x(d) });

    this.svg.append("text")
        .attr("x", (this.width / 2))
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("text-decoration", "underline")
        .text("Age Distribution");




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
AgeVis.prototype.wrangleData= function(_filterFunction){

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
AgeVis.prototype.updateVis = function(){

    // Dear JS hipster,
    // you might be able to pass some options as parameter _option
    // But it's not needed to solve the task.
    // var options = _options || {};


    // TODO: implement...
    // TODO: ...update scales
    // TODO: ...update graphs

    // updates scales
    this.x.domain(d3.extent(this.displayData, function(d){return d}))
    this.y.domain([99,0])


    // updates axis

    this.svg.select(".y.axis")
        .call(this.yAxis)


    // updates graph
    var path = this.svg.selectAll(".area")
        .data([this.displayData])

    path.enter()
        .append("path")
        .attr("class", "area");

    path
        .transition().duration(5)
        .attr("d", this.area);

    path.exit()
        .remove();

}


/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
AgeVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){

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
AgeVis.prototype.filterAndAggregate = function(_filter){


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
    var res = d3.range(100).map(function () {
        return 0;
    });
    // accumulate all values that fulfill the filter criterion



    // TODO: implement the function that filters the data and sums the values


    that.data.map(function (d) {
        if (d.time < filter.start || d.time > filter.end) {}
        else {

            for (i = 0; i < d.ages.length; i++) {
                res[i] = res[i] + d.ages[i];
            }
        }
        return d.time.toDateString();
        });

    return res;


}




