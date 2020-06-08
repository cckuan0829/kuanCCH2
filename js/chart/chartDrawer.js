function drawScore(move_list, score_list, score_bias) {

	if(move_list == undefined || move_list == null || move_list.length == 0)
	{
	   document.getElementById("scorechart").style.visibility = "hidden";
	   document.getElementById("scorechart").style.display = "none";
	   return;
	}
  
    var bodyStyles = window.getComputedStyle(document.body); 
	var scale = parseFloat(bodyStyles.getPropertyValue('--titlescale'));
    var dataAry = [];
    var _max = Math.max(...score_list);
    var _min = Math.min(...score_list);
    var _size = 0;
	var end_positive = 30000;
	var end_negative = -30000;
    
    document.getElementById("scorechart").style.visibility = "visible";
    document.getElementById("scorechart").style.display = "block";
	$('.chartArea').addClass('opacity9');

	if(_max > 1700)  end_positive = _max-200;
	if(_min < -1700) end_negative = _min+200;
	
	for(var i = 0; i<score_list.length; i++)
	{
		if(score_list[i] != undefined && !isNaN(score_list[i]))
			_size = i;
	}
	
	for(var i = 0; i<=_size; i++)
	{
		var point = new Object();
		point.x = i+1;
		point.label2 = move_list[i];
		if(score_bias[i]>200)
		{
			if(point.x%2 == 1) point.markerColor = "red";
			else point.markerColor = "#1a75ff";
			
			point.markerType = "cross";	
			point.markerBorderColor = "black"; //change color here
			point.markerBorderThickness = 1;
			point.markerSize = 14*scale;
		}
		else if(score_bias[i]>50)
		{
			if(point.x%2 == 1) point.markerColor = "red";
			else point.markerColor = "#1a75ff";
			
			point.markerType = "triangle";
			point.markerBorderColor = "black"; //change color here
            point.markerBorderThickness = 1;
			point.markerSize = 14*scale;
		}
		else
		{
			point.markerColor = "black";
			point.markerType = "circle";
			point.markerSize = 6*scale;
		}
		
		if(isNaN(score_list[i]))
		{
			point.y = null;
		}
		else
		{
			point.y = score_list[i];
		}
		
		dataAry.push(point);
	}
	
    var chart = new CanvasJS.Chart("scorechart", {
        animationEnabled: true,
		theme: "light1",
		zoomEnabled: true,
		exportEnabled: true,
        title: {
            text:　"全局走勢",
            fontSize: 24*scale,
            maxWidth: 320*scale,
            padding: 5,
            margin:5,
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
			click: function(e){
				showBoardbyNum(e.dataPointIndex+1);
				$("#main").scrollTop(0);
			},
			lineColor: "black",
			lineThickness: 2*scale,
            type: "spline",
            connectNullData: true,
            nullDataLineDashType:"dot",
            xValueType: "int",
          //  xValueFormatString: "DD MMM hh:mm TT",
          //  yValueFormatString: "#,##0.##\"%\"",
            dataPoints: dataAry,
        }],
		
    });
    chart.render();
    
}

function drawBias(move_list, score_list, score_bias) {

	if(move_list == undefined || move_list == null || move_list.length == 0)
	{
	   document.getElementById("biaschart").style.visibility = "hidden";
	   document.getElementById("biaschart").style.display = "none";
	   return;
	}

    var bodyStyles = window.getComputedStyle(document.body); 
	var scale = parseFloat(bodyStyles.getPropertyValue('--titlescale'));
	var redBias = [];
	var blackBias = [];
	var redBiasAvg = 0;
	var blackBiasAvg = 0;

    document.getElementById("biaschart").style.visibility = "visible";
	document.getElementById("biaschart").style.display = "block";

	for(var i = 0; i<score_bias.length; i++)
	{
		var point = new Object();
		point.markerType = "circle";
		point.label2 = move_list[i];
        
        if(score_bias[i] == undefined || Number.isNaN(score_bias[i])) break;

        if(score_bias[i] >= 500)
        {
           point.markerSize = 20*scale;
        } 
        else if(score_bias[i] >= 200)
        {
           point.markerSize = 15*scale;
        }
        else if(score_bias[i] >= 50)
        {
           point.markerSize = 10*scale;
        }
        else
        {
           point.markerSize = 5*scale;
        }
         
		if(i % 2 == 0) // red
		{
	       point.x = 1+(i/2);
	       point.y = score_bias[i];
	       redBias.push(point);
	       if(score_bias[i] <= 1000)
		      redBiasAvg += score_bias[i];
		   else
		   	  redBiasAvg += 1000;
		}
		else //black
		{
		   point.x = 1+parseInt(i/2);
		   point.y = score_bias[i];
	       blackBias.push(point);
	       if(score_bias[i] <= 1000)
		      blackBiasAvg += score_bias[i];
		   else
		   	  blackBiasAvg += 1000;
		}
	}

	redBiasAvg /= redBias.length;
	blackBiasAvg /= blackBias.length;

	var chart = new CanvasJS.Chart("biaschart", {
        animationEnabled: true,
		theme: "light1",
		zoomEnabled: true,
		exportEnabled: true,
		title: {
            text:　"著法偏差",
            fontSize: 24*scale,
            maxWidth: 320*scale,
            padding: 5,
            margin:5,
            //borderThickness: 1,
            //backgroundColor: "#f4d5a6",
            //verticalAlign: "bottom",
            //horizontalAlign: "left",
        },
		axisX: {
	        title: "回合",
	        },
		axisY :{
			includeZero: false,
			title: "分數",
			scaleBreaks: {
				autoCalculate: true
			},
			stripLines: [{
				color: "red",
				labelFontColor: "red",
				lineDashType: "dot",
				value: redBiasAvg,
			},
			{
				color: "black",
				labelFontColor: "black",
				lineDashType: "dot",
				value: blackBiasAvg,
			}]
		},

		legend:{
			cursor:"pointer",
		},
		data: [{
			click: function(e){
				showBoardbyNum(2*(e.dataPointIndex)+1);
				$("#main").scrollTop(0);
			},
			type: "spline",
			toolTipContent: "{label2}: {y}",
			showInLegend: true,
			visible: true,
			color: "red",
			name: "紅方偏差(平均:"+parseInt(redBiasAvg)+")",
			dataPoints: redBias,
		    },
		    {
		    click: function(e){
				showBoardbyNum(2*(e.dataPointIndex)+2);
				$("#main").scrollTop(0);
			},
			type: "spline", 
			toolTipContent: "{label2}: {y}",
			showInLegend: true,
			visible: true,
			color: "black",
			name: "黑方偏差(平均:"+parseInt(blackBiasAvg)+")",
			dataPoints: blackBias,
		}]
	});
	chart.render();
}

function drawStaticChart(score_bias){
	
	if(score_bias == undefined || score_bias == null || score_bias.length == 0)
	{
	   document.getElementById("statchart").style.visibility = "hidden";
	   document.getElementById("statchart").style.display = "none";
	   return;
	}
    
    document.getElementById("statchart").style.visibility = "visible";
	document.getElementById("statchart").style.display = "block";

    var bodyStyles = window.getComputedStyle(document.body); 
	var scale = parseFloat(bodyStyles.getPropertyValue('--titlescale'));
    var redbiasCnt = [0, 0, 0, 0];
    var blackbiasCnt = [0, 0, 0, 0];
    var biasIdx = -1;

    for(var i = 0; i<score_bias.length; i++)
	{
		if(score_bias[i] >= 500)
		{
		   biasIdx = 3;
		}
		else if(score_bias[i] >= 200)
		{
   		   biasIdx = 2;
		}
		else if(score_bias[i] >= 100)
		{
   		   biasIdx = 1;
		}
		else if(score_bias[i] >= 50)
		{
		   biasIdx = 0;
		}
		else
		{
		   biasIdx = -1;
		}

        if(biasIdx >= 0)
        {
           if((i%2) == 0)
		      redbiasCnt[biasIdx]++;
		   else
			  blackbiasCnt[biasIdx]++;
        }
	}

	var chart = new CanvasJS.Chart("statchart", {
		animationEnabled: true,
		theme: "light1",
		zoomEnabled: true,
		exportEnabled: true,
		title:{
			text: "失著統計",
			fontSize: 24*scale,
            maxWidth: 320*scale,
            padding: 5,
            margin:5,
		},
		axisX: {
			interval: 1,
			labelFontSize: 20,
			labelFontWeight: "bold",
		},
		axisY: {
		},
		toolTip: {
			shared: true
		},
		legend:{
			cursor: "pointer",
		},
		data: [
		{
			type: "stackedBar",
			name: "偏差:50~100",
			color: "#FFCC4E",
			showInLegend: "true",
			dataPoints: [
				{ label: "黑方", y: blackbiasCnt[0] },
				{ label: "紅方", y: redbiasCnt[0] }
			]
		},
		{
			type: "stackedBar",
			name: "偏差:100~200",
			color: "#EF9F0B",
			showInLegend: "true",
			dataPoints: [
				{ label: "黑方", y: blackbiasCnt[1] },
				{ label: "紅方", y: redbiasCnt[1] }
			]
		},
		{
			type: "stackedBar",
			name: "偏差:200~500",
			color: "#EA4903",
			showInLegend: "true",
			dataPoints: [
				{ label: "黑方", y: blackbiasCnt[2] },
				{ label: "紅方", y: redbiasCnt[2] }
			]
		},
		{
			type: "stackedBar",
			name: "偏差:>500",
			color: "#C60000",
			showInLegend: "true",
			dataPoints: [
				{ label: "黑方", y: blackbiasCnt[3] },
				{ label: "紅方", y: redbiasCnt[3] }
			]
		}],
	});
	chart.render();
}

function drawScoreChart(move_list, score_list, score_bias, chart_type) {
	if(move_list != undefined && move_list.length > 0)
	{
	   document.getElementById("tabs").style.visibility = "visible";
	   if(chart_type == 0)
	   {
		  drawScore(move_list, score_list, score_bias);
		  drawBias([]);
		  drawStaticChart([]);
	   }
	   else if(chart_type == 1)
	   {
	   	  drawScore([]);
	      drawBias(move_list, score_list, score_bias);
	      drawStaticChart([]);
	   }
	   else if(chart_type == 2)
	   {
	      drawScore([]);
	      drawBias([]);
	      drawStaticChart(score_bias);
	   }
	}
	else
	{
		document.getElementById("tabs").style.visibility = "hidden";
		drawScore([]);
		drawBias([]);
		drawStaticChart([]);
	}
}
