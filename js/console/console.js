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
var drawChartBtn = document.getElementById("drawChartBtn");

var buttonList = [
	queryBtn,
	copyBtn,
	clearBtn,
	infoBtn,
	//drawChartBtn
];


var chess_str = "";
var copy_str = "";
var status_str = "";
var move_total = 0;
var move_curr  = 0;


$(document).ready(function() {
    queryBtn.addEventListener("click", query);
    $("#queryBtn").val($("#queryBtn").html());

    copyBtn.addEventListener("click", copy);
    clearBtn.addEventListener("click", clear);
    infoBtn.addEventListener("click", info);

    $("#copyEgBtn").bind("click", function() {
        copyToClipboard("copyEgBtn");
    });
    
    initPlaceholder();
});

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
    if(status_str == "") status_str = $("#queryBtn").val();
    document.getElementById("queryBtn").innerHTML = status_str;

	document.getElementById("chessBookOutput").innerHTML = chess_str;
}

async function query() {
	
	move_total = 0;
    move_curr  = 0;
	status_str = "";
	chess_str = "";
	copy_str = "";
	red_score = [];
	score_bias = [];
    var mytext   = document.getElementById("chessBookInput").value;	
	disableButtons();

    $("#copyEgBtn").attr("disabled", true);
	
	if (mytext == "" || mytext ===  placeholder)
	{
		chess_str = "請輸入棋譜!";
	}
	else
	{
		var list     = check_text_valid(mytext);
		var result   = list[0];
		var list_num = list[1];
	
		if (result)
		{
			var query_result = [];
			status_str = "進度: " + 0 + "/" + list_num;
			showResult();
			query_result = await query_move_list(mytext);
			red_score  = query_result[0];
			score_bias = query_result[1];
		}
		else
		{
			chess_str = "輸入格式有誤!";
		}
	}
	showResult();
	$('.chartArea').addClass('opacity9');
	drawScore(red_score);
	enableButtons();

    $("#copyEgBtn").attr("disabled", false);
    $("#queryBtn").html($("#queryBtn").val());
}

function disableButtons(){
	for(var i=0; i<buttonList.length; ++i) {
		buttonList[i].disabled = true;
	}
}

function enableButtons() {
	for(var i=0; i<buttonList.length; ++i) {
		buttonList[i].disabled = false;
	}
}

async function query_move_list(chess_manual)
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
    
	move_total = move_list.length;
	copy_str  += "FEN：" + fen + "\n";
	
	for (var i = 0; i < move_list.length; i++)
	{
		move_curr = i+1;
		addStr(move_curr + "." + move_list[i]);

		prev_fen = fen;
		fen = Update_FEN(fen, move_list[i]);
		curr_score = await query_score(fen);
		curr_score = is_red ? curr_score*(-1) : curr_score;
		recommend_list = await query_cloud(fen);
		is_red  = (fen.indexOf('w') >= 0);
        red_score_list = [];
		recommend_text = [];
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
			red_score.push(NaN);
			score_bias.push(NaN);
		}
        status_str = "進度: " + move_curr + "/" + move_total ;
		showResult();
		prev_recommend_list = recommend_list;
		addStr("\n");
    } 
	chess_str = chess_str + "end " + "\n\n";
	return [red_score, score_bias];
}

function copy() {
	
	const el = document.createElement('textarea');
    el.value = copy_str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
	
	if(copy_str != "")		
		alert("複製成功!");
	else
		alert("沒有可複製的文字!");
	
}

function clear() {
	
	document.getElementById("chessBookInput").value = "";
}

function info() {

	alert("操作步驟:\
	     \n\t1. 在象棋橋打譜，註解盡量保持空白。\
		 \n\t2. 完成後在工具列按'匯出'=>'文字棋譜'=>'複製到剪貼簿'。\
	     \n\t3. 將步驟2所複製內容貼到本網頁上，然後按下'雲庫查詢'。\
		 \n\t4. 查詢完成後，按下本網頁上的'複製結果'。\
		 \n\t5. 回到象棋橋，按'匯入'=>'文字棋譜'。\
		 \n輸出說明:\
		 \n\t1. Red score代表該盤面的分數。正分代表紅優，負分則為黑優。\
		 \n\t2. score bias代表該步和官著的分數差異，0分即為官著。\
		 \n\t3. 如出現NaN則代表無法查到相關分數或是著法。");
}

function addStr(newstr) {

	console.log(newstr);
	chess_str += newstr + "\n";
	copy_str  += newstr + "\n";
}	

