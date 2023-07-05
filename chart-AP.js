const populationApp = {}

    populationApp.parseDate = d3.timeParse("%Y-%m-%d");
    populationApp.parseYear = d3.timeParse("%Y");
    // populationApp.parseDate = d3.timeParse("%b %Y");
    // populationApp.formatTime = d3.timeFormat("%b %e, %Y");
    populationApp.formatTime = d3.timeFormat("%Y");
    
    populationApp.buildChart = (data, getThisData, dispPopulation, getTheseKeys) => {

        // CHARTS SETUP HERE ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------   
        
        d3.select('#chart1').html('')
        // d3.select('#chart2').html('')
        const chartWidth =  parseInt(d3.select('#chart1').style('width'))
        const chartHeight =  parseInt(d3.select('#chart1').style('height'))
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
            // mobileTextOffset = -60
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
        
        let canadaData = [], 
            ontarioData = [];

        data.forEach(function(d) {
            d.natGrowthCanada = +d.natGrowthCanada
            d.netMigrationCanada = +d.netMigrationCanada
            d.natGrowthOntario = +d.natGrowthOntario
            d.netMigrationOntario = +d.netMigrationOntario
            d.natGrowthToronto = +d.natGrowthToronto
            d.netMigrationToronto = +d.netMigrationToronto
            d.netEmigrationToronto = +d.netEmigrationToronto
            d.natGrowthPeel = +d.natGrowthPeel
            d.netMigrationPeel = +d.netMigrationPeel
            d.netEmigrationPeel = +d.netEmigrationPeel
            d.Canada = +d.Canada
            d.Ontario = +d.Ontario
            d.Toronto = +d.Toronto
            d.Peel = +d.Peel
            d.allZeros = 0
            d.date = populationApp.parseYear(d.year)
            years.push(populationApp.parseYear(d.year))
        });
         
        console.log(data)
        dataLength = data.length
        years.shift()
        
        // List of groups = header of the csv files
        var keys = populationApp.keysBuilder(getTheseKeys, getThisData, true)

        // SETUPS AXIS HERE ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------  
            var x = d3.scaleTime()
                .domain(d3.extent(data, function(d) { return d.date; }))
                .range([ 0, width ]);
            var xAxis = svg.append("g")
                    .attr("class","myXaxis axisColour")
                    .attr("transform", "translate(" + (width/dataLength/-2) + "," + (height) + ")")
                    .call(d3.axisBottom(x)
                        // .tickValues(years)
                        .ticks(ticksA)
                        .tickFormat(function (d) {
                            return populationApp.formatTime(d);
                        })
                    );

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

                d3.selectAll(".domain").remove()

        // color palette
        var color = d3.scaleOrdinal()
            .domain(["Canada","natGrowthCanada","netMigrationCanada","natGrowthOntario","netMigrationOntario","natGrowthToronto","netMigrationToronto","natGrowthPeel","netMigrationPeel"])
            .range(['#0077BB','#A6611A', '#018571','#A6611A', '#018571','#A6611A', '#018571','#A6611A', '#018571']);

        
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


        // ANNOTATIONS ARE HERE ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------   

        // Create a rect on top of the svg area: this rectangle recovers mouse position
        const annotations = [["1984","1993"],["1931","1940"],["2015","2022"]]
        
        // populationApp.parseYear(yearB)
        annotations.forEach(function(d,i){
            svg
                .append('rect')
                .attr("class", "annotation annotationRect annotation" + i)
                // .style("opacity", 1)
                .style("fill", "#F8F8F810")
                // .style("stroke", "#F8F8F8")
                // .style("stroke-width","3.5px")
                // .style("pointer-events", "all")
                .attr('height', height)
                .attr("y", 0)
                .attr("x", x(new Date(d[0])))
                .attr('width', x(new Date(d[1])) - x(new Date(d[0])))

            svg
                .append("line")
                .attr("class", "annotation annotationLine annotation" + i)
                    .style("stroke", "#F8F8F8")
                    .style("stroke-width","2px")
                // .style("opacity", 0)
                .attr("y1", y(y.domain()[0]))
                .attr("x1", x(new Date(d[0])))
                .attr("y2", y(y.domain()[1]))
                .attr("x2", x(new Date(d[0])));

            svg
                .append("line")
                .attr("class", "annotation annotationLine annotation" + i)
                    .style("stroke", "#F8F8F8")
                    .style("stroke-width","2px")
                // .style("opacity", 0)
                .attr("y1", y(y.domain()[0]))
                .attr("x1", x(new Date(d[1])))
                .attr("y2", y(y.domain()[1]))
                .attr("x2", x(new Date(d[1])));

        })

        var asterix = svg
        .append('g')
        .attr("id", "asterisk")
        .attr("class", "asterisk")
        .append('text')
            .style("opacity", 0)
            .style("fill", "#F8F8F8")
            .attr("text-anchor", "right")
            .attr("alignment-baseline", "center")
            .text('*')
            .attr("y", 0)
            .attr("x", 0)
            .attr("transform","translate(" 
                    + (x(new Date(data[data.length-1].year)) - (width/dataLength/2))
                    + "," 
                    // + y(data[data.length-1].natGrowthCanada + data[data.length-1].netMigrationCanada) 
                    + y(data[data.length-1].Canada)
                    + ")")

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
            .style("fill", "#018571")
        var focusRectNaturalNumberBackbox = svg
            .append('rect')
            .attr("class", "focusRect")
            .style("opacity", 0)
            .style("fill", "#A6611A")
        var focusRectPopulationNumberBackbox = svg
            .append('rect')
            .attr("class", "focusRect")
            .style("opacity", 0)
            .style("fill", "#0077BB")

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

            // What happens when the mouse move -> show the annotations at the right positions.
            function mouseover() {
                bisect = d3.bisector(function(d) { return d.date; }).left;
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
                // console.log(dataLength)

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
                .attr("x1", x(selectedData.date) - (width/dataLength/2))
                .attr("x2", x(selectedData.date) - (width/dataLength/2))
                
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

                
                var keys = populationApp.keysBuilder(getTheseKeys, getThisData, dispPopulation)
                
                data = populationApp.filterDateRange(data, yearA, yearB)
                dataLength = data.length

                    // .sort((a, b) => d3.descending(a.date, b.date))

                y.domain([
                    0,
                    populationApp.getXMax(dispPopulation, getThisData, data) 
                ])

                x.domain(d3.extent(data, function(d) { return d.date; }))

                xAxis.transition()
                        .duration(500)
                        .attr("transform", "translate(" + (width/dataLength/-2) + "," + (height) + ")")
                        .call(d3.axisBottom(x)
                            .ticks(ticksA)
                            .tickFormat(function (d) {
                                return populationApp.formatTime(d);
                            })
                        )

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

                // Show the areas
                svg
                .selectAll(".myArea")
                    .data(stackedData)
                    .style("fill", function(d) { return color(d.key); })
                    .transition()
                    .duration(1000)
                    .attr("d", area)

                svg
                .selectAll(".myArea")
                    .exit()
                    .remove()

                if (!dispPopulation && getThisData == 'Canada' && data[data.length-1].year == '2023') {
                    let yVal = y(data[data.length-1].natGrowthCanada)
                    if (getTheseKeys.length == 2) {
                        yVal = y(data[data.length-1].natGrowthCanada + data[data.length-1].netMigrationCanada)
                    }
                 //update asterix position   
                 asterix
                    .style("opacity", 1)
                    .transition()
                    .duration(1000)
                    .attr("transform","translate(" 
                            + (x(new Date(data[data.length-1].year)) - (width/dataLength/2))
                            + "," 
                            + yVal 
                            + ")")
                } else {
                   asterix
                      .transition()
                      .duration(1000)
                      .style("opacity", 0)
                }




            } // end of updateChart

            
        // })


    }

    populationApp.buildChartSmall = (data, getThisData, getTheseKeys) => {

        let cityData = populationApp.filterDateRange(data, "2002", "2022")

        let keys = populationApp.keysBuilder(getTheseKeys, getThisData, false)
        
        const filterColumns = (filterThisArray, newArrayKeys) => {
            let newArray = []
            
            filterThisArray.forEach((d) => {
                let thisInstance = {}
                // thisInstance.date = d.date
                thisInstance.year = d.year
                
                newArrayKeys.forEach((j) => {
                    // console.log(`${j}: ${d[j]}`)
                    thisInstance[j] = d[j]
                })
                // newArrayKeys.forEach((j) => {
                //     thisInstance[j+"comp"] = d[j]
                // })
                newArray.push(thisInstance)
            })
            return newArray
        }

        cityData = filterColumns(cityData,keys)
        console.log(cityData)
        // keys = d3.keys(cityData[0]).slice(1)


        d3.select('.SA_stepper-nav-text').html('')
        d3.select('.SA_stepper-nav-text')
            .append('svg')
            .attr("id","chart2")

        const chartWidth = parseInt(d3.select('#chart2').style('width'))
        const chartHeight = parseInt(d3.select('#chart2').style('height'))

         // set the dimensions and margins of the graph
         var margin = {top: 30, right: 30, bottom: 20, left: 40, leftB: 40},
            width = chartWidth - margin.left - margin.right,
            // width2 = chartWidth2 - margin.left - margin.right,s
            height = chartHeight - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#chart2")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

       
        // console.log(subgroups)
        // List of subgroups = header of the csv files = soil condition here
        // var subgroups = populationApp.keysBuilder(getTheseKeys, getThisData, true)
        
        // List of groups = species here = value of the first column called group -> I show them on the X axis
        var groups = d3.map(cityData, function(d){return(d.year)}).keys()
        // var subgroups = cityData.columns.slice(1)
        var subgroups = keys


        let ticksA = 8;
        if (chartWidth <= 695) {
                    //do something here on mobile versions
                    ticksA = 4;
                    // mobileTextOffset = -60
                }
        
        // Add X axis
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.15])
        svg.append("g")
        .attr("class", "yAxis axisColour")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .ticks(3)
            // .tickSizeOuter(0)
            );

        // Add Y axis
        var y = d3.scaleLinear()
        // .domain([0, 60])
        .domain([-10000, populationApp.getXMax(false, getThisData, cityData) ])
        .range([ height, 0 ]);
        svg.append("g")
        .attr("class", "yAxis axisColour")
        .call(d3.axisLeft(y)
                .ticks(ticksA)
                .tickFormat(function (d) {
                    return d3.format(".0s")(d);
                })
            );

        d3.selectAll(".domain").remove()


        svg
            .append("line")
                .style("stroke", "#F8F8F880")
                .style("stroke-width","0.5px")
            .attr("y1", y(0))
            .attr("x1", x(0))
            .attr("y2", y(0))
            .attr("x2", width);


        // Another scale for subgroup position?
        var xSubgroup = d3.scaleBand()
            .domain(subgroups)
            .range([0, x.bandwidth()])
            .padding([0.0])

        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
        .domain(keys)
        .range(['#A6611A','#018571','#0077BB'])


        // SMALL LEGEND IS HERE --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 

        var smalCircA = svg
        .append('circle')
        .attr('stroke', 'black')
        .attr('fill', '#A6611A')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 5)
            .attr("transform","translate(-30,-15)")

        var smalTextA = svg
        .append('text')
        .attr("class", "smallLegend")
            .style("opacity", 1)
            .style("fill", "#F8F8F8")
            .attr("text-anchor", "right")
            .style("font-size", "0.7em")
            // .7em or 12.6px
            .attr("alignment-baseline", "center")
            .text('Natural growth')
            .attr("y", 0)
            .attr("x", 0)
            .attr("transform","translate(-20,-10)")
            // .call(wrap,120)

        var smalCircB = svg
        .append('circle')
        .attr('stroke', 'black')
        .attr('fill', '#018571')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 5)
            .attr("transform","translate(70,-15)")
        
        var smalTextb = svg
        .append('text')
        .attr("class", "smallLegend")
            .style("opacity", 1)
            .style("fill", "#F8F8F8")
            .attr("text-anchor", "right")
            .style("font-size", "0.7em")
            .attr("alignment-baseline", "center")
            .text('Net international migration')
            .attr("y", 0)
            .attr("x", 0)
            .attr("transform","translate(80,-10)")
            // .call(wrap,120)

        var smalCircC = svg
        .append('circle')
        .attr('stroke', 'black')
        .attr('fill', '#0077BB')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 5)
            .attr("transform","translate(-30,0)")
        
        var smalTextC = svg
        .append('text')
        .attr("class", "smallLegend")
            .style("opacity", 1)
            .style("fill", "#F8F8F8")
            .attr("text-anchor", "right")
            .style("font-size", "0.7em")
            .attr("alignment-baseline", "center")
            .text('Net migration within Canada')
            .attr("y", 0)
            .attr("x", 0)
            .attr("transform","translate(-20,5)")
            // .call(wrap,120)
        
            // SMALL LEGEND ENDS --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 

          // Show the bars
        svg.append("g")
            .selectAll("g")
            // Enter in data = loop group per group
            .data(cityData)
            .enter()
            .append("g")
            .attr("transform", function(d) { return "translate(" + x(d.year) + ",0)"; })
            .selectAll("rect")
            .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
            .enter().append("rect")
            .attr("x", function(d) { return xSubgroup(d.key); })
            .attr("y", function(d) { 
                // return y(0);
                // return y(0);
                // return y(d.value);
                if (d.value >= 0) {
                    return y(d.value); 
                } else {
                    return y(0); 
                }   
            })
            .attr("width", xSubgroup.bandwidth())
            // .attr("height", function(d) { return y(0); })
            .attr("height", function(d) { 
                    if (d.value >= 0) {
                        return y(0) - y(d.value); 
                        // return y(-d.value); 
                    } else {
                        // return height + y(0); 
                        // return y(d.value); 
                        return height - y(0); 
                    }  
                    
            })
            // .attr("transform", function(d) { return "translate(0," + (y(0)*-1) + ")"; })
            .attr("fill", function(d) { return color(d.key); });
    }

    

    populationApp.buttonWork = (data) => {
        d3.selectAll('.updateChart').on('click', function(){
            let getThisData = this.attributes["data-grab"].value
            let dispPopulation = /^true$/i.test(this.attributes["data-popDisplay"].value)
            let grabTheseKeys = this.attributes["data-keys"].value.split(",")
            let yearA = this.attributes["data-yearA"].value
            let yearB = this.attributes["data-yearB"].value
            populationApp.updateChart(data, getThisData, dispPopulation, grabTheseKeys, yearA, yearB)
            if (this.id == 'Button6') {
                populationApp.buildChartSmall(data,getThisData,grabTheseKeys)
                populationApp.removeAnnotations()
            }
        })
        
        d3.selectAll('.updatehighlight').on('click', function(){
            let getThisData = this.attributes["data-grab"].value
            populationApp.annotator(getThisData)
        })
        
    }

    populationApp.annotator = (anotation) => {
            d3.selectAll(".annotation").style("opacity", 0)
            d3.selectAll("." + anotation).style("opacity", 1)
    }
    populationApp.removeAnnotations = () => {
            d3.selectAll(".annotation").style("opacity", 0)
    }

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
    
    var data1, dataLength, bisect;
    populationApp.init = () => {
        d3.csv("./data/can-data-1931-2022-pop-increase-net.csv",function(data) {
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