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

var _max = 0;
var _min = 0;

$(document).ready(function() {
    $("#drawChartBtn").bind("click", function() {
        drawChart();
    });
});

function drawScore(move_list, score_list, score_bias) {
	dataAry = [];
	_max = Math.max(...score_list);
	_min = Math.min(...score_list);
	
	for(var i = 0; i<score_list.length; i++)
	{
		var point = new Object();
		point.x = i+1;
		point.label2 = move_list[i];
		if(score_bias[i]>200)
		{
			if(point.x%2 == 1) point.markerColor = "red";
			else point.markerColor = "blue";
			
			point.markerType = "cross";	
			point.markerBorderColor = "black"; //change color here
			point.markerBorderThickness = 1;
			point.markerSize = 14;
		}
		else if(score_bias[i]>50)
		{
			if(point.x%2 == 1) point.markerColor = "red";
			else point.markerColor = "blue";
			
			point.markerType = "triangle";
			point.markerBorderColor = "black"; //change color here
            point.markerBorderThickness = 1;
			point.markerSize = 14;
		}
		else
		{
			point.markerColor = "black";
			point.markerType = "circle";
			point.markerSize = 6;
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

	var end_positive = 30000;
	var end_negative = -30000;
	if(_max > 1700)  end_positive = _max-200;
	if(_min < -1700) end_negative = _min+200;
	
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
			content: "{x}-{label2}: {y}"      
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
						endValue: end_positive,
						},
					{
						startValue: -1500,
						endValue: end_negative,
						}
				]
			}
        // suffix: "points"
        },
        data: [{
			lineColor: "black",
			lineThickness: 2,
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