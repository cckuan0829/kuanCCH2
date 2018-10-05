var dataAry = [                
    { x: 1, y: 0 },
    { x: 2, y: 400 },
    { x: 3, y: 100 },
    { x: 4, y: 60 },
    { x: 5, y: -120 },
    { x: 6, y: 35 },
    { x: 7, y: 400 },
    { x: 8, y: -100 },
    { x: 9, y: 60 },
    { x: 10, y: 120 },
];

$(document).ready(function() {
    $("#drawChartBtn").bind("click", function() {
        drawChart();
    });
});

function drawScore(score_list) {
	dataAry = [];
	var upperbound = 3000;
	for(var i = 0; i<score_list.length; i++)
	{
		var point = new Object();
		point.x = i+1;
		if(isNaN(score_list[i]))
			break;
		
		if (score_list[i] > upperbound)
			point.y = upperbound;
		else if (score_list[i] < -1*upperbound)
			point.y = -1*upperbound;
		else
			point.y = score_list[i];
		
		dataAry.push(point);
	}
    drawChart();
}


function drawChart() {
    $('.chartArea').addClass('opacity9');
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        title: {
            text: "盤面分數走勢"
        },
        axisX: {
            title: "回合"
        },
        axisY: {
            title: "分數",
            valueFormatString:"#"
        // suffix: "points"
        },
        data: [{
            type: "line",
            name: "盤面絕對分數圖",
            connectNullData: false,
            //nullDataLineDashType: "solid",
            xValueType: "int",
          //  xValueFormatString: "DD MMM hh:mm TT",
          //  yValueFormatString: "#,##0.##\"%\"",
            dataPoints: dataAry
        }],
		
    });
    chart.render();
}