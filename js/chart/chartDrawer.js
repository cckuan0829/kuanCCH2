var dataAry = [                
    { label: 1, y: 0 },
    { label: 2, y: 400 },
    { label: 3, y: 100 },
    { label: 4, y: 60 },
    { label: 5, y: -120 },
    { label: 6, y: 35 },
    { label: 7, y: 400 },
    { label: 8, y: -100 },
    { label: 9, y: 60 },
    { label: 10, y: 120 },
];

$(document).ready(function() {
    $("#drawChartBtn").bind("click", function() {
        drawChart();
    });
});

function drawScore(move_list, score_list, score_bias) {
	dataAry = [];
	
	for(var i = 0; i<score_list.length; i++)
	{
		var point = new Object();
		point.x = i+1;
		point.indexLabel = move_list[i];
		if(score_bias[i]>200)
		{
			point.markerColor = "red";
			point.markerType = "cross";
			point.markerSize = 12;
		}
		
		if(isNaN(score_list[i]))
			break;
		
		point.y = score_list[i];
		
		dataAry.push(point);
	}
    drawChart();
}


function drawChart() {
    $('.chartArea').addClass('opacity9');
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
		theme: "light1",
		zoomEnabled: true,
        title: {
            text:　$('#badRate').html(),
            fontSize: 20,
            maxWidth: 320,
            padding: 10,
            margin:20,
            //borderThickness: 1,
            //backgroundColor: "#f4d5a6",
            //verticalAlign: "bottom",
            //horizontalAlign: "left",
        },
		toolTip:{   
			content: "{indexLabel}: {y}"      
		},
        axisX: {
            title: "步數"
        },
        axisY: {
            title: "分數",
            valueFormatString:"#",
			scaleBreaks: {
				customBreaks: [
					{
						startValue: 1500,
						endValue: 30000,
						},
					{
						startValue: -1500,
						endValue: -30000,
						}
				]
			}
        // suffix: "points"
        },
        data: [{
			lineColor: "black",
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