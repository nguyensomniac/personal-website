//code for graphs
//get API calls from server
var lastLoad = function() {
  return $.get('http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&period=7day&user=ieely&limit=5&api_key=79d14cee5d01890da9ab6c1478e90f95&format=json');
};
var igLoad = function() {
  var d = new $.Deferred();
  var p = d.promise()
  $.getJSON('https://api.instagram.com/v1/users/583125553/media/recent?client_id=801340ab1774411a866caeeb03c98cd7&callback=?', function(data)  {
    d.resolve(data);
  });
  return p
};
var x = function(data)  {
  console.log(data);
};
$.when(lastLoad(), igLoad()).then(function(last, ig){
  last = last[0]
  console.log(last);
  console.log(ig);
  //general chart variables
  var chart =  {
    containerWidth: function(){
      return parseInt(d3.select('.about-graphs').style('width'))
    },
    containerHeightProp: function() {
      return parseInt(.75 * chart.containerWidth()) //for proportional height graphs
    },
    scale: function(min, max, param) {
      //maps data to size of a parameter - usually chart width or height
      var s = d3.scale.linear()
        .range([0, param])
        .domain([min, max])
      return s
    }
  }
  //create last.fm chart canvas
  var entryHeight = 38
  var lChart = d3.select('.music-7day-graph')
    .append('svg')
    .attr('height', last.topartists.artist.length * entryHeight);
  var lChartEntry = lChart.selectAll('g')
    .data(last.topartists.artist)
    .enter()
    .append('g')
    .attr('class', 'music-7day-group');
  //lastfm data is sorted, so take first artist's playcount
  var lChartMax = parseInt(last.topartists.artist[0].playcount)
  var lChartScale = chart.scale(0, lChartMax, chart.containerWidth());
  var lChartLabel = lChartEntry.append('text')
    .attr('y', function(d, i) {
      return entryHeight * i
    })
  lChartLabel.append('tspan')
    .text(function(d) {
      return d.name
    })
    .attr('class', 'music-7day-artist')
  lChartLabel.append('tspan')
    .text(function(d) {
       return ' - ' + d.playcount + ' plays'
    })
    .attr('class', 'music-7day-playcount')
  //bars
  lChartEntry.append('rect')
    .attr('y', function(d, i) {
      return entryHeight * i + 20
    })
    .attr('height', 10)
    .attr('width', function(d){
      return lChartScale(parseInt(d.playcount));
    })
    .attr('class', 'music-7day-bar');
  //instagram chart canvas
  var iChart = d3.select('.insta-graph')
    .append('svg')
    .attr('width', chart.containerWidth())
    .attr('height', chart.containerHeightProp());
  //create defs element
  var iChartDefs = iChart.append('defs');
  //get instagram like range
  var getLikeRange = function(d) {
    if(d.length === 1)  {
      //range is the number of likes of that photo
      return {
        min: d[0].likes.count,
        max: d[0].likes.count
      }
    }
    else  {
      //take maximum of the first item's likes and the maximum of the rest of the list, and do same for minimums
      var restRange = getLikeRange(d.slice(1, d.length));
      return {
        min: Math.min(d[0].likes.count, restRange.min),
        max: Math.max(d[0].likes.count, restRange.max)
      }
    }
  };
  ig.data.likeRange = getLikeRange(ig.data);
  ig.data.timeRange = {
    min: parseInt(ig.data[ig.data.length - 1].created_time),
    max: parseInt(ig.data[0].created_time)
  }
  var pointRadius = 10;
  var pointStroke = 2;
  var pointOffset = pointRadius + pointStroke;
  var transitionScale = 3;
  var iChartX = chart.scale(ig.data.length - 1, 0, chart.containerWidth() - pointOffset * 2); //reverses and maps time created to X axis
  var iChartY = chart.scale(ig.data.likeRange.max, 0, chart.containerHeightProp() - pointOffset * 2); //reverses and maps min/max likes to Y axis
  //creates line
  var likeLine = d3.svg.line()
    .x(function(d, i){
      //x axis is index, reversed (posts ordered by date)
      return iChartX(i) + pointOffset;
    })
    .y(function(d)  {
      //y axis is # of likes
      return iChartY(d.likes.count) + pointOffset;
    });
  //add line to graph
  iLine = iChart.append('path')
    .attr('d', likeLine(ig.data))
    .attr('class', 'insta-line');
  //create gradient fill
  var iChartAFill = iChartDefs.append('linearGradient')
    //makes it vertical
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '0%')
    .attr('y2', '100%')
    .attr('id', 'insta-area-fill');
  iChartAFill.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', d3.rgb(d3.select('.insta-line').style('stroke')))
    .attr('stop-opacity', .3);
  iChartAFill.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', d3.rgb(d3.select('.insta-line').style('stroke')))
    .attr('stop-opacity', .7);
  //create area under graph
  var likeArea = d3.svg.area()
    //x and y1 are identical to line, y0 is bottom of graph
    .x(function(d, i){
      return iChartX(i) + pointOffset;
    })
    .y0(chart.containerHeightProp())
    .y1(function(d)  {
      return iChartY(d.likes.count) + pointOffset;
    });
  //add area to graph
  iChart.append('path')
    .attr('d', likeArea(ig.data))
    .attr('fill', 'url(#insta-area-fill)')
    .attr('class', 'insta-area');
  //create point parent element
  var iPoint = iChart.selectAll('g')
    .data(ig.data)
    .enter()
    .append('g')
    .attr('class', 'insta-point');
  iPoint.append('circle')
    .attr('r', pointRadius)
    .attr('cx', function(d, i) {
      return iChartX(i) + pointOffset;
    })
    .attr('cy', function(d) {
      return iChartY(d.likes.count) + pointOffset
    })
    .attr('class', 'insta-point-solid')
    .attr('stroke-width', pointStroke);
  iPoint.append('text')
    .text(function(d){
      return d.likes.count
    })
    .attr('text-anchor', 'middle')
    //same x and y positions as point
    .attr('x', function(d, i) {
      return d3.select(this.parentNode)
        .select('.insta-point-solid')
        .attr('cx');
    })
    .attr('y', function(d) {
      return d3.select(this.parentNode)
        .select('.insta-point-solid')
        .attr('cy');
    });
  //create background image pattern for each point
  var iPointPat = iChartDefs.selectAll('pattern')
    .data(ig.data)
    .enter()
    .append('pattern')
    .attr('id', function(d, i)  {
      return 'insta-point-' + i
    })
    .attr('patternUnits', 'userSpaceOnUse')
    //offset x and y positions by transformed point radius
    .attr('x', function(d, i) {
      return iChartX(i) + pointOffset + pointRadius * transitionScale;
    })
    .attr('y', function(d) {
      return iChartY(d.likes.count) + pointOffset + pointRadius * transitionScale
    })
    //image width twice size of transformed radius
    .attr('width', pointRadius * 2 * transitionScale)
    .attr('height', pointRadius * 2 * transitionScale);
  iPointPat.append('image')
    .attr('xlink:href', function(d) {
      return d.images.thumbnail.url
    })
    .attr('width', pointRadius * 2 * transitionScale)
    .attr('height', pointRadius * 2 * transitionScale);
  iPoint.append('circle')
    .attr('r', 0)
    //same x and y positions as solid point
    .attr('cx', function(d, i) {
      return d3.select(this.parentNode)
        .select('.insta-point-solid')
        .attr('cx');
    })
    .attr('cy', function(d) {
      return d3.select(this.parentNode)
        .select('.insta-point-solid')
        .attr('cy');
    })
    .attr('fill', function(d, i)  {
      //fill with corresponding image pattern
      return 'url(#insta-point-' + i + ')'
    })
    .attr('class', 'insta-point-image');

  //adds link to points (for some reason, svg links don't work with Iron Router)
  iPoint.on('click', function(d)  {
    window.open(d.link, '_blank');
  });

  //animations
  iPoint.on('mouseover', function() {
    //bring current point to top
    this.parentNode.appendChild(this);
    //scales image circle to size of point
    d3.select(this)
      .select('.insta-point-image')
      .transition()
      .duration(50)
      .ease('linear')
      .attr('r', pointRadius)
      .each('end', function() {
        //then scales both of them
        d3.select(this)
          .transition()
          .duration(100)
          .ease('linear')
          .attr('r', pointRadius * transitionScale);
        d3.select(this.parentNode) //white circle
          .select('.insta-point-solid')
          .transition()
          .duration(100)
          .ease('linear')
          .attr('r', pointRadius * transitionScale);
      })
  });
  iPoint.on('mouseout', function() {
    //white point goes back to normal
    d3.select(this)
      .select('.insta-point-solid')
      .transition()
      .delay(100)
      .duration(300)
      .attr('r', pointRadius);
    //then image becomes 0
    d3.select(this)
      .select('.insta-point-image')
      .transition()
      .duration(300)
      .attr('r', 0)
  });
}, function(){
  //(really shitty) error handling for API calls
  console.log('Some error occured trying to load external data');
});
