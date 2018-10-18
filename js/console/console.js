/*
  1. 炮二平五  馬８進７    2. 馬二進三  車９平８
  3. 車一平二  馬２進３    4. 兵七進一  卒７進１
  5. 車二進六  炮８平９    6. 車二平三  炮９退１
  7. 兵五進一  士４進５    8. 兵五進一  炮９平７
  9. 車三平四  卒７進１   10. 馬三進五  車８進８
 11. 馬八進七  卒７進１   12. 馬五進六  象３進５
*/

var inputExample = 
" 1. 炮二平五  馬８進７    2. 馬二進三  車９平８\n\
 3. 車一平二  馬２進３    4. 兵七進一  卒７進１\n\
 5. 車二進六  炮８平９    6. 車二平三  炮９退１\n\
 7. 兵五進一  士４進５    8. 兵五進一  炮９平７\n\
 9. 車三平四  卒７進１   10. 馬三進五  車８進８\n\
 11. 馬八進七  卒７進１   12. 馬五進六  象３進５\n"

var placeholder = "在這輸入或貼上棋譜，例如：\n\n" + inputExample;

// should put all buttons to consoleConfig file
var queryBtn = document.getElementById("queryBtn");
var copyBtn = document.getElementById("copyBtn");
var clearBtn = document.getElementById("clearBtn");
var infoBtn = document.getElementById("infoBtn");
var stopBtn = document.getElementById("stopBtn");
var drawChartBtn = document.getElementById("drawChartBtn");

var buttonList = [
	queryBtn,
	copyBtn,
	clearBtn,
	infoBtn,
	stopBtn
	//drawChartBtn
];


var _chess_str = "";
var _copy_str = "";
var _status_str = "";
var _move_total = 0;
var _move_curr  = 0;
var _toStop = false;


$(document).ready(function() {
    queryBtn.addEventListener("click", queryCloudDB);
    $("#queryBtn").val($("#queryBtn").html());

    copyBtn.addEventListener("click", copyQueryResult);
    clearBtn.addEventListener("click", clearInputText);
	infoBtn.addEventListener("click", showInfo);
	stopBtn.addEventListener("click", stopQuery);

    $("#copyEgBtn").bind("click", function() {
        copyToClipboard("copyEgBtn");
    });
    
    initPlaceholder();
});

function stopQuery() {
	_toStop = true;
}

async function queryCloudDB() {
	_toStop = false;
	_move_total = 0;
    _move_curr  = 0;
	_status_str = "";
	_chess_str = "";
	_copy_str = "";
	red_score = [];
	score_bias = [];
	badRateCount = [0,0,0,0];
    var mytext   = document.getElementById("chessBookInput").value;	
	disableButtons();
    var is_not_complete = false;
	var is_got_result   = false;
	
	removeDisplayRow();
	resetBadRate();
	
    $("#copyEgBtn").attr("disabled", true);
	
	if (mytext == "" || mytext ===  placeholder)
	{
		alert("請輸入棋譜!");
	}
	else
	{
		var list     = check_text_valid(mytext);
		var result   = list[0];
		var list_num = list[1];
	
		if (result)
		{
			var query_result = [];
			is_got_result   = true;
			_status_str = "進度: " + 0 + "/" + list_num;
			showResult();
			query_result = await queryByMoveList(mytext);
			red_score  = query_result[0];
			score_bias = query_result[1];
			if(red_score.findIndex(Number.isNaN) >= 0)
				is_not_complete = true;
		}
		else
		{
			alert("輸入格式有誤!");
		}
	}
	if(is_got_result)
	{
		showResult();  
		updateBadRate(calBadRate(score_bias, true));
		$('.chartArea').addClass('opacity9');
		drawScore(red_score);
	}
	enableButtons();
	
	//if(is_not_complete)
	//	alert('目前雲庫資料不完整，再過幾個小時後查此盤面或許就有結果摟!')
	
    $("#copyEgBtn").attr("disabled", false);
    $("#queryBtn").html($("#queryBtn").val());
}

function copyQueryResult() {
	
	const el = document.createElement('textarea');
    el.value = _copy_str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
	
	if(_copy_str != "")		
		alert("複製成功!");
	else
		alert("沒有可複製的文字!");
	
}

function clearInputText() {
	
	document.getElementById("chessBookInput").value = "";
}

function showInfo() {

	alert("操作步驟:\
	     \n\t1. 在象棋橋打譜，註解盡量保持空白。\
		 \n\t2. 完成後在工具列按'匯出'=>'文字棋譜'=>'複製到剪貼簿'。\
	     \n\t3. 將步驟2所複製內容貼到本網頁上，然後按下'雲庫查詢'。\
		 \n\t4. 查詢完成後，按下本網頁上的'複製結果'。\
		 \n\t5. 回到象棋橋，按'匯入'=>'文字棋譜'。\
		 \n輸出說明:\
		 \n\t1. Red score代表該盤面的分數。正分代表紅優，負分則黑優。\
		 \n\t2. score bias代表該步和官著的分數差異，0分即為官著。\
		 \n\t3. 如出現NaN則代表無法查到相關分數或是著法。");
}

function initPlaceholder() {
    
    $('#chessBookInput').val(placeholder);

    $('#chessBookInput').focus(function(){
        if($(this).val() === placeholder){
            $(this).val('');
        }
    });

    $('#chessBookInput').blur(function(){
        if($(this).val() ===''){
            $(this).val(placeholder);
        }    
    });
}

function copyToClipboard(elementId) {
    // Create a "hidden" input
    var aux = document.createElement("input");
  
    // Assign it the value of the specified element
    aux.setAttribute("value", inputExample);
  
    // Append it to the body
    document.body.appendChild(aux);
  
    // Highlight its content
    aux.select();
  
    // Copy the highlighted text
    document.execCommand("copy");
  
    // Remove it from the body
    document.body.removeChild(aux);

    alert("已複製輸入格式範例至你的剪貼本: \n" + inputExample);
}

function showResult(){
    if(_status_str == "") _status_str = $("#queryBtn").val();
    document.getElementById("queryBtn").innerHTML = _status_str;

	//document.getElementById("chessBookOutput").innerHTML = _chess_str;
}

function disableButtons(){
	for(var i=0; i<buttonList.length; ++i) {
		if(buttonList[i]!=stopBtn)
			buttonList[i].disabled = true;
	}
}

function enableButtons() {
	for(var i=0; i<buttonList.length; ++i) {
		buttonList[i].disabled = false;
	}
}

async function queryByMoveList(chess_manual)
{
	var list      = parsing_text(chess_manual);
	var fen       = list[0];
	var move_list = list[1];
	var prev_fen  = fen;
	var recommend_list = await query_cloud(fen);
	var prev_recommend_list = recommend_list;
	var score_diff = 0;
	var is_red = (fen.indexOf('w') >= 0);
	var curr_score = 0;
	var show_len = recommend_list.length <= 5 ? recommend_list.length : 5;
	var search_len = recommend_list.length <= 10 ? recommend_list.length : 10;
    var fisrt_recommend_move_text = "";
	
	_move_total = move_list.length;
	_copy_str  += "FEN：" + fen + "\n";
	
	addDisplayRow(["步數", "棋譜", "紅方分數", "分數偏差", "推薦著法", ""]);
	
	for (var i = 0; i < move_list.length; i++)
	{
		_move_curr = i+1;
		addStr(_move_curr + "." + move_list[i]);

		prev_fen = fen;
		fen = Update_FEN(fen, move_list[i]);
		curr_score = await query_score(fen);
		curr_score = is_red ? curr_score*(-1) : curr_score;
		recommend_list = await query_cloud(fen);
		is_red  = (fen.indexOf('w') >= 0);
        red_score_list = [];
		recommend_text = [];
		fisrt_recommend_move_text = "";
		show_len = recommend_list.length <= 5 ? recommend_list.length : 5;
	    search_len = recommend_list.length <= 10 ? recommend_list.length : 10;
		
		if( prev_recommend_list[0] != undefined)
		{
			var qurey_list = prev_recommend_list[0].split(/:|,/);  
			var score_list = [];	
			search_len = prev_recommend_list.length <= 10 ? prev_recommend_list.length : 10;
			for ( var j = 0; j < search_len; j++)
			{
				qurey_list = prev_recommend_list[j].split(/:|,|\(/);       
				
				if (prev_recommend_list[j].indexOf('invalid') >= 0 || prev_recommend_list[j].length < 10)
				{
					addStr('Red score   = '+ NaN);
					addStr('score bias  = '+ NaN);
					red_score.push(NaN);
					score_bias.push(NaN);
				}
				else
				{
					var move = get_move_text(prev_fen, qurey_list[1]);
					var score = qurey_list[3];
					score     = is_red ? score*(-1) : score;
					score_list.push(score);
					if(fen == Update_FEN(prev_fen, move))
					{
						curr_score = parseInt(score);
						if(j > 3) break;
					}
					recommend_text.push("-" + move + " ,score = " + score)
					
					if( j == 0)
						fisrt_recommend_move_text = move;
				}
			}
			addStr('Red score   = '+ curr_score);
			red_score.push(curr_score);
			if(is_red)
				score_diff = Math.min(...score_list)-curr_score;
		    else
				score_diff = Math.max(...score_list)-curr_score

			addStr('score bias  = ' + Math.abs(score_diff));
			score_bias.push(Math.abs(score_diff));
			
			addStr('recommend :');
			for ( var j = 0; j < show_len; j++)
			{
				if(recommend_text[j] != undefined) addStr(recommend_text[j]);
			}		
		}
		else
		{	
			curr_score = NaN;
			score_diff = NaN;
			red_score.push(NaN);
			score_bias.push(NaN);
		}
        _status_str = "進度: " + _move_curr + "/" + _move_total ;
		showResult();
		prev_recommend_list = recommend_list;
		addStr("\n");
		
		if ( Math.abs(score_diff) > 20 || Number.isNaN(score_diff))
		{
			addDisplayRow([_move_curr, move_list[i], curr_score, Math.abs(score_diff), fisrt_recommend_move_text, fen]);
		}
		else
		{
			addDisplayRow([_move_curr, move_list[i], curr_score, Math.abs(score_diff), "", fen]);
		}
		if(_toStop) break;
    } 
	_chess_str = _chess_str + "end " + "\n\n";
	
	return [red_score, score_bias];
}

function addStr(newstr) {

	console.log(newstr);
	_chess_str += newstr + "\n";
	_copy_str  += newstr + "\n";
}	

function addDisplayRow(info_list) {
    var table = document.getElementById("moveListTable");
    var row = table.insertRow(-1);
	if(info_list[4]>=200)
		row.classList.add("moveListTable_bad");
	else if(info_list[4]>=50)
		row.classList.add("moveListTable_not_good");
	else
		row.classList.add("moveListTable_normal");
	
    var cell_round = row.insertCell(0);
    var cell_move = row.insertCell(1);
	var cell_score = row.insertCell(2);
	var cell_bias = row.insertCell(3);
	var cell_recommend = row.insertCell(4);
	var move_str = info_list[1];
    var result = move_str.link("http://www.chessdb.cn/query/?"+info_list[5]);
    cell_round.innerHTML = info_list[0];
	if(info_list[5]!="")
		cell_move.innerHTML = '<a href="'+"http://www.chessdb.cn/query/?"+info_list[5]+'" target="_blank" style="color:#b7c8f4">'+move_str+'</a>';
	else
		cell_move.innerHTML = move_str;
	cell_score.innerHTML = info_list[2];
	cell_bias.innerHTML = info_list[3];
	cell_recommend.innerHTML = info_list[4];
}

function removeDisplayRow() {
	var table = document.getElementById("moveListTable");
	table.innerHTML = "";
}

function updateBadRate(badrate) {
	var badratetext = document.getElementById("badRate");
	badratetext.classList.add("rateArea");
	badratetext.innerHTML = "紅方 緩著率："+badrate[0]+"%， 失著率："+badrate[1]+"% \n"+
	                        "黑方 緩著率："+badrate[2]+"%， 失著率："+badrate[3]+"%";
}

function resetBadRate()
{
	var badratetext = document.getElementById("badRate");
	badratetext.innerHTML = "";
}

function calBadRate(score_bias, first_is_Red)
{
	var badRate = [NaN,NaN,NaN,NaN];
	var badRateCount = [0,0,0,0,0,0];
	var not_good = 50;
	var bad = 200;
	var offset = 0;
	
	for(var i = 0; i<score_bias.length; i++)
	{
		offset = (i%2)*3;
		if(!Number.isNaN(score_bias[i]))
		{
			badRateCount[0+offset]++;
			if(Math.abs(score_bias[i]) >= not_good)
			{
				badRateCount[1+offset]++;
				if(Math.abs(score_bias[i]) >= bad)
					badRateCount[2+offset]++;
			}
		}
	}
	
	if(first_is_Red)
	{
		if(badRateCount[0]>0)
		{
			badRate[0] = parseInt(100*badRateCount[1]/badRateCount[0]);
			badRate[1] = parseInt(100*badRateCount[2]/badRateCount[0]);
		}
		
		if(badRateCount[3]>0)
		{
			badRate[2] = parseInt(100*badRateCount[4]/badRateCount[3]);
			badRate[3] = parseInt(100*badRateCount[5]/badRateCount[3]);
		}
	}
	else
	{
		if(badRateCount[3]>0)
		{
			badRate[0] = parseInt(100*badRateCount[4]/badRateCount[3]);
			badRate[1] = parseInt(100*badRateCount[5]/badRateCount[3]);
		}
		
		if(badRateCount[0]>0)
		{
			badRate[2] = parseInt(100*badRateCount[1]/badRateCount[0]);
			badRate[3] = parseInt(100*badRateCount[2]/badRateCount[0]);
		}
	}
	return badRate;
}