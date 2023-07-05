

    const populationApp = {}

    populationApp.parseDate = d3.timeParse("%Y-%m-%d");
    populationApp.parseYear = d3.timeParse("%Y");
    // populationApp.parseDate = d3.timeParse("%b %Y");
    // populationApp.formatTime = d3.timeFormat("%b %e, %Y");
    populationApp.formatTime = d3.timeFormat("%Y");
    var data;
    
    populationApp.buildChart = (data, getThisData, dispPopulation, getTheseKeys) => {

        // CHARTS SETUP HERE ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------   
        
        d3.select('#chart1').html('')
        // d3.select('#chart2').html('')
        const chartWidth =  parseInt(d3.select('#chart1').style('width'))
        // const chartWidth2 =  parseInt(d3.select('#chart2').style('width'))

        // console.log(chartWidth)

        let years = [];

        let mobileTextOffset = 0
        let mobileTextOffsetAnnotation = 0
        let ticksA = 8;
        let ticksB = 2;
        let aligner = 30;
        
        if (chartWidth <= 695) {
            //do something here on mobile versions
            ticksA = 4;
            mobileTextOffset = -60
        }
        if (chartWidth <= 395) {
            mobileTextOffset = 0
        }

        // set the dimensions and margins of the graph
        var margin = {top: 20, right: 25, bottom: 20+37, left: 40, leftB: 40},
            width = chartWidth - margin.left - margin.right,
            // width2 = chartWidth2 - margin.left - margin.right,s
            height = document.querySelector('#chart').getBoundingClientRect().height - margin.top - margin.bottom;

        // if (chartWidth <= 500) {
            if (window.innerWidth < 701) {
            margin = {top: 25, right: 15, bottom: 20, left: 30, leftB: 30},
                width = chartWidth - margin.left - margin.right,
                // width2 = chartWidth2 - margin.left - margin.right,
                // height = document.querySelector('#chart').getBoundingClientRect().height - document.querySelector('#map-overlay').getBoundingClientRect().height - margin.top - margin.bottom;
                height = document.querySelector('#chart').getBoundingClientRect().height - 210 - margin.top - margin.bottom;


            mobileTextOffsetAnnotation = 0
        }

        


        // append the svg object to the body of the page
        var svg = d3.select("#chart1")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // append the svg object to the body of the page
        // var svg2 = d3.select("#chart2")
        // .append("svg")
        //     .attr("width", width2 + margin.leftB + margin.right)
        //     .attr("height", height + margin.top + margin.bottom)
        // .append("g")
        //     .attr("transform",
        //         "translate(" + margin.leftB + "," + margin.top + ")");

        //Read the data
        // d3.csv("./data/can-data-1931-2022-pop-increase-net.csv",function(data) {
        
        let canadaData = [], 
            ontarioData = [];

        data.forEach(function(d) {
            d.natGrowthCanada = +d.natGrowthCanada
            d.netMigrationCanada = +d.netMigrationCanada
            d.natGrowthcompCanada = +d.natGrowthcompCanada
            d.netMigrationcompCanada = +d.netMigrationcompCanada
            d.natGrowthOntario = +d.natGrowthOntario
            d.netMigrationOntario = +d.netMigrationOntario
            d.natGrowthcompOntario = +d.natGrowthcompOntario
            d.netMigrationcompOntario = +d.netMigrationcompOntario
            d.Canada = +d.Canada
            d.Ontario = +d.Ontario
            d.allZeros = 0
            d.date = populationApp.parseYear(d.year)
            years.push(populationApp.parseYear(d.year))
        });
         
        console.log(data)
        years.shift()
        
        // List of groups = header of the csv files
        // var keys = data.columns.slice(1)
        var keys = populationApp.keysBuilder(getTheseKeys, getThisData, true)

        // SETUPS AXIS HERE ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------  
        

        // Add X axis
        // var x = d3.scaleLinear()
        //     .domain(d3.extent(data, function(d) { return d.year; }))
            var x = d3.scaleTime()
                .domain(d3.extent(data, function(d) { return d.date; }))
                .range([ 0, width ]);
            // var xAxis = d3.axisBottom(x)
            //     // .tickValues(years)
            //     .ticks(ticksA)
            //     .tickFormat(function (d) {
            //         return populationApp.formatTime(d);
            //     })
            // var xAxisT = d3.axisTop()
            // .scale(x)
            // .tickValues(years)
            //     .ticks(ticksA)
            //     .tickSize(height)
            //     .tickFormat(function (d) {
            //         // return populationApp.formatTime(d);
            //         return "'" + d3.timeFormat("%y")(d);
            //     })

            // if (chartWidth <= 275) { 
            //     svg.append("g")
            //         .attr("class","myXaxis axisColour invisibleTick")
            //         .attr("transform", "translate(0," + (height) + ")")
            //         .call(xAxisT);
            // } else {
            var xAxis = svg.append("g")
                    .attr("class","myXaxis axisColour")
                    .attr("transform", "translate(0," + (height) + ")")
                    .call(d3.axisBottom(x)
                        // .tickValues(years)
                        .ticks(ticksA)
                        .tickFormat(function (d) {
                            return populationApp.formatTime(d);
                        })
                    );
                // svg2.append("g")
                //     .attr("class","myXaxis axisColour")
                //     .attr("transform", "translate(0," + (height) + ")")
                //     .call(xAxis);    
            // }

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([
                    0,
                    populationApp.getXMax(dispPopulation, getThisData, data) 
                ])
                .range([ height, 0 ]);

            var yAxis = svg.append("g")
                    .attr("class", "yAxis axisColour")
                    .attr("transform", "translate(" + 0 + ",0)")
                    .call(d3.axisLeft(y)
                        .ticks(ticksA)
                        .tickSize(-width)
                        .tickFormat(function (d) {
                            return d3.format(".0s")(Math.abs(d));
                        })
                    );

            
            
                // Add Y axis
            // var y2 = d3.scaleLinear()
            //     .domain([0,40000000])
            //     .range([ height, 0 ]);
            // svg2.append("g")
            //     .attr("transform", "translate(" + 0 + ",0)")
            //     .call(d3.axisLeft(y2)
            //         .tickSize(-width)
            //         .ticks(ticksB)
            //         .tickFormat(function (d) {
            //             return d3.format(".0s")(d);
            //         })
            //     )

            // svg2.append("g")
            //     .attr("transform", "translate(" + width + ",0)")
            //     .call(d3.axisLeft(y2)
            //         .tickSize(width)
            //         .ticks(ticksB)
            //         .tickFormat(function (d) {
            //             return d3.format(".0s")(d);
            //         })
            //     )

                d3.selectAll(".domain").remove()
                
            // Customization
            // svg.selectAll(".tick line").attr("stroke", "#F0F0F0")

        // color palette
        // var color = d3.scaleOrdinal()
        var color = d3.scaleOrdinal()
            // .domain(keys)
            .domain(["Canada","natGrowthCanada","netMigrationCanada","natGrowthOntario","netMigrationOntario"])
            // .range(['#f8f8f800', '#DB8233', '#4b76b4','#f8f8f800']);
            // .range(['#4b76b4', '#DB8233']);
            .range(['#009988','#4b76b4', '#DB8233','#4b76b4', '#DB8233']);

        
        // Making PATHS HERE ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------    

        //stack the data?
        var stackedData = d3.stack()
            // .offset(d3.stackOffsetSilhouette)
            .keys(keys)
            (data)

        // Area generator
        var area = d3.area()
            // .curve(d3.curveBasis)
            // .curve(d3.curveStepAfter)
            .curve(d3.curveStepBefore)
            .x(function(d) { return x(d.data.date); })
            .y0(function(d) { return y(d[0]); })
            .y1(function(d) { return y(d[1]); })

            // console.log(area())
            

        // Show the areas
        svg
            .selectAll("mylayers")
            .data(stackedData)
            .enter()
            .append("path")
            // .attr("class", function(d) { return "myArea " + d.key; })
            .attr("class", function(d) { return "myArea"; })
            // .attr("transform","translate(0,300)")
            .style("opacity", 0)
            .transition()
            .duration(1000)
            .style("opacity", 1)
            .attr("transform","translate(0,0)")
            .style("fill", function(d) { return color(d.key); })
            .attr("d", area)


            // Create the area variable: where both the area and the brush take place
            // var area2 = svg2.append('g')
            // .attr("clip-path", "url(#clip)")

            // Create an area generator
            // var areaGenerator = d3.area()
            // // .x0(x2(0))
            // .curve(d3.curveStepAfter)
            // .x(function(d) { return x(d.date); })
            // .y0(function(d) { return y2(0); })
            // .y1(function(d) { return y2(d.Canada); })

            // Add the area
        // area2.append("path")
        //     .datum(data)
        //     .attr("class", "myArea")  // I add the class myArea to be able to modify it later on.
        //     // .attr("transform","translate(0,30)")
        //     // .attr("fill", "#005789")
        //     .attr("fill", "#009988")
        //     .attr("fill-opacity", .8)
        //     // .attr("stroke", "black")
        //     // .attr("stroke-width", 1)
        //     .attr("d", areaGenerator )



        // FOCUS LINE HERE --- Needs to be behind the annotations ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------    
        // Create a rect on top of the svg area: this rectangle recovers mouse position
        var focusLine = svg
            .append("line")
            .attr("class", "positionline")
            .style("stroke", "#111")
            .style("stroke-width","1.5px")
            .style("opacity", 0)
            .attr("y1", y(y.domain()[0]))
            .attr("x1", x(0))
            .attr("y2", y(y.domain()[1]))
            .attr("x2", x(0));

        // Create a rect on top of the svg area: this rectangle recovers mouse position
        // var focusLineB = svg2
        //     .append("line")
        //     .attr("class", "positionline")
        //     .style("stroke", "#111")
        //     .style("stroke-width","1.5px")
        //     .style("opacity", 0)
        //     .attr("y1", y2(y2.domain()[0]))
        //     .attr("x1", x(0))
        //     .attr("y2", y2(y2.domain()[1]))
        //     .attr("x2", x(0));


        // TOOLTIP IS HERE ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------   

        // Create a rect on top of the svg area: this rectangle recovers mouse position
        var focusRect = svg
            .append('rect')
            .attr("class", "focusRect")
            .style("opacity", 0)
            .style("fill", "#F8F8F8")
            .style("stroke", "#111")
            .style("stroke-width","1.5px")
            .style("pointer-events", "all")
            .attr('width', "200px")
            .attr('height', "120px")
        
        //create three rectangles that will be displayed behind the numbers on the tooltip
        var focusRectMigrationNumberBackbox = svg
            .append('rect')
            .attr("class", "focusRect")
            .style("opacity", 0)
            .style("fill", "#DB8233")
        var focusRectNaturalNumberBackbox = svg
            .append('rect')
            .attr("class", "focusRect")
            .style("opacity", 0)
            .style("fill", "#4b76b4")
        var focusRectPopulationNumberBackbox = svg
            .append('rect')
            .attr("class", "focusRect")
            .style("opacity", 0)
            .style("fill", "#009988")

        // Create the text that travels along the curve of chart
        var focusTextYearNumber = svg
        .append('g')
        .attr("class", "tooltipTextNode")
        .append('text')
            // .attr("class", "backgroundText")
            .style("opacity", 0)
            .attr("text-anchor", "right")
            .attr("alignment-baseline", "center")

        // Create the text that travels along the curve of chart
        var focusTextMigrationNumber = svg
        .append('g')
        .attr("id", "focusTextMigrationNumber")
        .attr("class", "tooltipTextNode tooltipNumber")
        .append('text')
            // .attr("class", "backgroundText")
            .style("opacity", 0)
            .style("fill", "#F8F8F8")
            .attr("text-anchor", "right")
            .attr("alignment-baseline", "center")

        // Create the text that travels along the curve of chart
        var focusTextNaturalNumber = svg
        .append('g')
        .attr("id", "focusTextNaturalNumber")
        .attr("class", "tooltipTextNode tooltipNumber")
        .append('text')
            // .attr("class", "backgroundText")
            .style("opacity", 0)
            .style("fill", "#F8F8F8")
            .attr("text-anchor", "right")
            .attr("alignment-baseline", "center")

        // Create the text that travels along the curve of chart
        var focusTextPopulationNumber = svg
        .append('g')
        .attr("id", "focusTextPopulationNumber")
        .attr("class", "tooltipTextNode tooltipNumber")
        .append('text')
            // .attr("class", "backgroundText")
            .style("opacity", 0)
            .style("fill", "#F8F8F8")
            .attr("text-anchor", "right")
            .attr("alignment-baseline", "center")

        // Create the text that travels along the curve of chart
        var focusTextYear = svg
        .append('g')
        .attr("class", "tooltipTextNode")
        .append('text')
            .style("opacity", 0)
            .attr("text-anchor", "right")
            .attr("alignment-baseline", "center")

        // Create the text that travels along the curve of chart
        var focusTextMigration = svg
        .append('g')
        .attr("class", "tooltipTextNode")
        .append('text')
            .style("opacity", 0)
            .attr("text-anchor", "right")
            .attr("alignment-baseline", "center")

        // Create the text that travels along the curve of chart
        var focusTextNatural = svg
        .append('g')
        .attr("class", "tooltipTextNode")
        .append('text')
            .style("opacity", 0)
            .attr("text-anchor", "right")
            .attr("alignment-baseline", "center")

        // Create the text that travels along the curve of chart
        var focusTextPopulation = svg
        .append('g')
        .attr("class", "tooltipTextNode")
        .append('text')
            .style("opacity", 0)
            .attr("text-anchor", "right")
            .attr("alignment-baseline", "center")

        // Create a rect on top of the svg area: this rectangle recovers mouse position
        svg
        .append('rect')
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);

        // Create a rect on top of the svg area: this rectangle recovers mouse position
        // svg2
        // .append('rect')
        // .style("fill", "none")
        // .style("pointer-events", "all")
        // .attr('width', width2)
        // .attr('height', height)
        // .on('mouseover', mouseover)
        // .on('mousemove', mousemove)
        // .on('mouseout', mouseout);


        // This allows to find the closest X index of the mouse:
        var bisect = d3.bisector(function(d) { return d.date; }).left;

            // What happens when the mouse move -> show the annotations at the right positions.
            function mouseover() {
                focusRect.style("opacity",1)
                focusLine.style("opacity",1)
                // focusLineB.style("opacity",1)
                focusRectMigrationNumberBackbox.style("opacity",1)
                focusRectNaturalNumberBackbox.style("opacity",1)
                focusRectPopulationNumberBackbox.style("opacity",1)
                focusTextYearNumber.style("opacity",1)
                focusTextMigrationNumber.style("opacity",1)
                focusTextNaturalNumber.style("opacity",1)
                focusTextPopulationNumber.style("opacity",1)
                focusTextYear.style("opacity",1)
                focusTextMigration.style("opacity",1)
                focusTextNatural.style("opacity",1)
                focusTextPopulation.style("opacity",1)
            }
            
            function mousemove() {
                console.log(stackedData)

                let leftChartOffset = 0;
                if (d3.event.pageX < (width * 0.6)) {
                    leftChartOffset = 250
                }
                
                // recover coordinate we need
                var x0 = x.invert(d3.mouse(this)[0]);
                var i = bisect(data, x0, 1);
                selectedData = data[i]


                focusRect
                .attr("y", 0)
                .attr("x", x(selectedData.date) - 230 + leftChartOffset - mobileTextOffset)

                focusLine
                .attr("x1", x(selectedData.date))
                .attr("x2", x(selectedData.date))
                
                // focusLineB
                // .attr("x1", x(selectedData.date))
                // .attr("x2", x(selectedData.date))

                function getBB(d) {
                    d.bbox = d.node().getBBox()
                }

                focusTextYearNumber
                .text(populationApp.formatTime(selectedData.date))
                .attr("y", 30)
                .attr("x", x(selectedData.date) - 210 + leftChartOffset - mobileTextOffset)
                // .attr("x", x(x.domain()[1]) - 210 -mobileTextOffset)
                // .attr("y", y(selectedData.date) - 10 - leftChartOffset - aligner)
                // .call(wrap, 200)

                focusTextMigrationNumber
                .text(d3.format(",")(selectedData['netMigration' + getThisData]))
                .attr("y", 60)
                .attr("x", x(selectedData.date) - 110 + leftChartOffset)
                .call(getBB);
                focusRectMigrationNumberBackbox
                    .attr("y", 60 - 15)
                    .attr("x", x(selectedData.date) - 115 + leftChartOffset)
                    .attr('width', focusTextMigrationNumber.bbox.width + 10)
                    .attr('height', focusTextMigrationNumber.bbox.height + 1)
                
                focusTextNaturalNumber
                .text(d3.format(",")(selectedData['natGrowth' + getThisData]))
                .attr("x", x(selectedData.date) - 100 + leftChartOffset)
                .attr("y", 80)
                .call(getBB);
                focusRectNaturalNumberBackbox
                    .attr("x", x(selectedData.date) - 105 + leftChartOffset)
                    .attr("y", 80 - 15)
                    .attr('width', focusTextNaturalNumber.bbox.width + 10)
                    .attr('height', focusTextNaturalNumber.bbox.height + 1)
                
                focusTextPopulationNumber
                .text(d3.format(",")(selectedData['Canada']))
                .attr("x", x(selectedData.date) - 130 + leftChartOffset)
                .attr("y", 100)
                .call(getBB);
                focusRectPopulationNumberBackbox
                    .attr("x", x(selectedData.date) - 135 + leftChartOffset)
                    .attr("y", 100 - 15)
                    .attr('width', focusTextPopulationNumber.bbox.width + 10)
                    .attr('height', focusTextPopulationNumber.bbox.height + 1)
                
                focusTextYear
                .text(populationApp.formatTime(selectedData.date))
                .attr("x", x(selectedData.date) - 210 + leftChartOffset - mobileTextOffset)
                .attr("y", 30)
                // .call(wrap, 200)

                focusTextMigration
                .text("Net migration: ")
                .attr("x", x(selectedData.date) - 210 + leftChartOffset - mobileTextOffset)
                .attr("y", 60)
                // .call(wrap, 200)

                focusTextNatural
                .text("Natural Growth: ")
                .attr("x", x(selectedData.date) - 210 + leftChartOffset - mobileTextOffset)
                .attr("y", 80)
                // .call(wrap, 200)

                focusTextPopulation
                .text("Population: ")
                .attr("x", x(selectedData.date) - 210 + leftChartOffset - mobileTextOffset)
                .attr("y", 100)
                // .call(wrap, 200)
                }

            function mouseout() {
                focusRect.style("opacity",0)
                focusLine.style("opacity",0)
                // focusLineB.style("opacity",0)
                focusRectMigrationNumberBackbox.style("opacity",0)
                focusRectNaturalNumberBackbox.style("opacity",0)
                focusRectPopulationNumberBackbox.style("opacity",0)
                focusTextYearNumber.style("opacity",0)
                focusTextMigrationNumber.style("opacity",0)
                focusTextNaturalNumber.style("opacity",0)
                focusTextPopulationNumber.style("opacity",0)
                focusTextYear.style("opacity",0)
                focusTextMigration.style("opacity",0)
                focusTextNatural.style("opacity",0)
                focusTextPopulation.style("opacity",0)
            }

            // TOOLTIP END ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------   

            populationApp.updateChart = (data, getThisData, dispPopulation, getTheseKeys, yearA, yearB) => {

                // console.log(data)

                var keys = populationApp.keysBuilder(getTheseKeys, getThisData, dispPopulation)

                data = populationApp.filterDateRange(data, yearA, yearB)
                    // .sort((a, b) => d3.descending(a.date, b.date))

                y.domain([
                    0,
                    populationApp.getXMax(dispPopulation, getThisData, data) 
                    // + d3.max(data, function(d) { return }) 
                    // d3.max(data, function(d) { return d[keys[1]]}) 
                ])

                x.domain(d3.extent(data, function(d) { return d.date; }))

                xAxis.transition()
                        .duration(500)
                        .call(d3.axisBottom(x)
                            .ticks(ticksA)
                            .tickFormat(function (d) {
                                return populationApp.formatTime(d);
                            })
                        )

                // console.log(populationApp.filterDateRange(data, "1954", "1933"))

                // console.log(d3.max(data, function(d) { return d[keys[1]]}) )

                yAxis.transition()
                        .duration(500)
                        .call(d3.axisLeft(y)
                            .ticks(ticksA)
                            .tickSize(-width)
                            .tickFormat(function (d) {
                                return d3.format(".0s")(Math.abs(d));
                            })
                        )
                        d3.selectAll(".domain").remove()

                var stackedData = d3.stack()
                    // .offset(d3.stackOffsetSilhouette)
                    .keys(keys)
                    (data)


                // Area generator
                var areaZero = d3.area()
                    // .curve(d3.curveBasis)
                    // .curve(d3.curveStepAfter)
                    .curve(d3.curveStepBefore)
                    .x(function(d) { 
                        return x(d.data.date); })
                    .y0(function(d) { return y(0); })
                    .y1(function(d) { return y(0); })
                // Area generator
                var area = d3.area()
                    // .curve(d3.curveBasis)
                    // .curve(d3.curveStepAfter)
                    .curve(d3.curveStepBefore)
                    .x(function(d) { 
                        return x(d.data.date); })
                    .y0(function(d) { return y(d[0]); })
                    .y1(function(d) { return y(d[1]); })

                // console.log(newArea())
                    

                // Show the areas
                svg
                // .merge()
                .selectAll(".myArea")
                    .data(stackedData)
                    // .style("opacity", 0)
                    .style("fill", function(d) { return color(d.key); })
                    // .attr("d", areaZero)
                    .transition()
                    // .delay(100)
                    .duration(1000)
                    .attr("d", area)
                    // .enter()
                    // .transition()
                    // .duration(300)
                    // .style("opacity", 1)
                    // .attr("d", areaGenerator)
                    // .update()

                    svg
                // .merge()
                .selectAll(".myArea")
                    .exit()
                    .remove()
            }

            
        // })


    }

    

    // populationApp.buttonWork = (data) => {
    //     d3.selectAll('button').on('click', function(){
    //         let getThisData = this.attributes["data-grab"].value
    //         let dispPopulation = /^true$/i.test(this.attributes["data-popDisplay"].value)
    //         let grabTheseKeys = this.attributes["data-keys"].value.split(",")
    //         let yearA = this.attributes["data-yearA"].value
    //         let yearB = this.attributes["data-yearB"].value
    //         populationApp.updateChart(data, getThisData, dispPopulation, grabTheseKeys, yearA, yearB)
    //     })
    // }

    populationApp.keysBuilder = (keyArray, getThisData, dispPopulation) => {
        let keysToReturn = []
        if (dispPopulation) {
            keysToReturn.push(getThisData)
            keysToReturn.push("allZeros")
        } else {
            keyArray.forEach(function(d){
                keysToReturn.push(d + getThisData)
            })
            if (keyArray.length < 2) {
                keysToReturn.push("allZeros")
            }
        }
        return keysToReturn
    }
    
    populationApp.getXMax = (dispPopulation, getThisData, data) => {
        let xMax = 0
        if (dispPopulation) {
            xMax = 40000000
        } else {
            xMax = d3.max(data, function(d) { return d["natGrowth"+getThisData] + d["netMigration"+getThisData]}) 
        }
        return xMax
    }

    populationApp.filterDateRange = (d, yearA, yearB) => {
        if (yearA == undefined || yearA == "") {
            yearA = d[0].date
        } else {
            yearA = populationApp.parseYear(yearA)
        }
        if (yearB == undefined || yearB == "") {
            yearB = d[d.length-1].date
        } else {
            yearB = populationApp.parseYear(yearB)
        }
        return d.filter( function(j){
            if (yearA <= yearB) {
                return j.date >= yearA && j.date <= yearB
            } else {
                return j.date >= yearB && j.date <= yearA
            }
        })
    }
    var data1;
    populationApp.init = () => {
        d3.csv("./images/can-data-1931-2022-pop-increase-net.csv",function(data) {
            data1 = data;
            populationApp.buildChart(data, 'Canada', true, ["Canada","allZeros"])
            populationApp.buttonWork(data)
        })
    }
    populationApp.init()


    function wrap(text, width) {
        text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.2, // ems
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
            while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
            }
        });
        }
    


    function resize(){
        var message = {'resize': 
                  {
                    'iframe':'graphic-iframe-sidescroll-test',
                    'height': document.getElementsByClassName('graphic-sidescroll-test')[0].offsetHeight + 20
                  }
                };
       
        parent.postMessage(message, "*");
        // populationApp.buildChart()
    };

    window.addEventListener('load', function() {
        resize();
    });

    window.addEventListener("resize", function(){
        resize();
    });

    setTimeout(function() {
                        resize();
                    }, 800);

  
	document.addEventListener("touchstart", function(){}, true);