var meter = d3.select("#progress-meter");
var temptext = meter.append("text")
.attr("text-anchor", "middle")
.attr("dy", "1.35em");

function updateWeather() {
  d3.json("/weather", function(error, data) {
    if (error) throw error;
    temptext.text(data.obs.air_temp + "°C");
  });
}

updateWeather(); setInterval('updateWeather()', 600000);
