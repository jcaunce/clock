var width = 500,
    height = 500,
    innerRad = 160,
    outerRad = 180,
    twoPi = 2 * Math.PI,
    hour = 1000*60*60,
    total = 24*hour;

var sleepStart = 23,
    sleepEnd = 8,
    workStart = 8,
    workEnd = 19,
    playStart = 19,
    playEnd = 23;

  var restArc = d3.arc()
  .startAngle(0)
  .endAngle(sleepEnd*hour/total*twoPi)
.innerRadius(innerRad)
  .outerRadius(outerRad);

  var restArc2 = d3.arc()
  .startAngle(sleepStart*hour/total*twoPi)
  .endAngle(total*twoPi)
.innerRadius(innerRad)
  .outerRadius(outerRad);

  var workArc = d3.arc()
  .startAngle(workStart*hour/total*twoPi)
  .endAngle(workEnd*hour/total*twoPi)
.innerRadius(innerRad)
  .outerRadius(outerRad);

  var playArc = d3.arc()
  .startAngle(playStart*hour/total*twoPi)
  .endAngle(playEnd*hour/total*twoPi)
.innerRadius(innerRad)
  .outerRadius(outerRad);

  var arc = d3.arc()
  .startAngle(0)
.innerRadius(innerRad-30)
  .outerRadius(outerRad);

  var svg = d3.select("#clock").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

  var meter = svg.append("g")
  .attr("id", "progress-meter");

  meter.append("path")
  .attr("class", "restArc")
  .attr("d", restArc);

  meter.append("path")
  .attr("class", "restArc")
  .attr("d", restArc2);

  meter.append("path")
  .attr("class", "workArc")
  .attr("d", workArc);

  meter.append("path")
  .attr("class", "playArc")
  .attr("d", playArc);

  var foreground = meter.append("path")
  .attr("class", "foreground");

  var text = meter.append("text")
  .attr("text-anchor", "middle")
  .attr("dy", ".35em");

  function updateClock() {
    var now = new Date();
    var progress = (now - d3.timeDay(now))/total;
    foreground.attr("d", arc.startAngle(twoPi*progress - 0.05).endAngle(twoPi*progress + 0.05));
    text.text(moment().format('h:mm a'));
  }

updateClock(); setInterval('updateClock()', 1000);

