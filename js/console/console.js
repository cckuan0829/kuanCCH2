/*
  1.炮二平五      炮８平５  
  2.車一進一      馬８進７  
  3.車一平六      車９平８  
  4.馬二進三      車８進６ 
  5.車六進七      馬２進１
  6.車九進一      炮２進７
  7.炮八進五      馬７退８
  8.炮五進四      士６進５  
  9.車九平六      將５平６  
 10.前車進一      士５退４  
 11.車六平四      炮５平６  
 12.車四進六      將６平５  
 13.炮八平五 
*/

var inputExample = 
"  1.炮二平五      炮８平５\n\
  2.車一進一      馬８進７\n\
  3.車一平六      車９平８\n\
  4.馬二進三      車８進６\n\
  5.車六進七      馬２進１\n\
  6.車九進一      炮２進７\n\
  7.炮八進五      馬７退８\n\
  8.炮五進四      士６進５\n\
  9.車九平六      將５平６\n\
 10.前車進一      士５退４\n\
 11.車六平四      炮５平６\n\
 12.車四進六      將６平５\n\
 13.炮八平五\n"

var placeholder = "在這輸入或貼上棋譜，例如：\n\n" + inputExample;

// should put all buttons to consoleConfig file
var queryBtn = document.getElementById("queryBtn");
var copyBtn = document.getElementById("copyBtn");
var clearBtn = document.getElementById("clearBtn");
//var infoBtn = document.getElementById("infoBtn");
var uploadBtn =  document.getElementById("uploadBtn");
//var stopBtn = document.getElementById("stopBtn");
//var drawChartBtn = document.getElementById("drawChartBtn");

var buttonList = [
	queryBtn,
	copyBtn,
	clearBtn,
	//infoBtn,
	downloadBtn,
	uploadBtn
	//stopBtn
	//drawChartBtn
];

var _pgn_str = "";
var _chess_str = "";
var _copy_str = "";
var _status_str = "";
var _move_total = 0;
var _move_curr  = 0;
var _toStop = false;
var _inQuety = false;
var _is_not_complete = false;

$(document).ready(function() {
    queryBtn.addEventListener("click", queryCloudDB);
    $("#queryBtn").val($("#queryBtn").html());

    copyBtn.addEventListener("click", copyQueryResult);
    clearBtn.addEventListener("click", clearInputText);
	//infoBtn.addEventListener("click", showInfo);
	downloadBtn.addEventListener("click", onDownloadBtnClick);
	uploadBtn.addEventListener('change', handleFileSelect, false);

	/*stopBtn.addEventListener("click", stopQuery);*/

    $("#copyEgBtn").bind("click", function() {
        copyToClipboard("範例棋譜",inputExample);
    });
    
    initPlaceholder();
});


function onDownloadBtnClick() {
	
	console.log($("#uploadBtn").value);
	if($("#moveListTable")[0].innerText === "") {
		alert('搜尋後才能下載!');
	}
	else {	
		if(_is_not_complete)
		{
			var answer = confirm("棋雲分析未完整，是否仍要下載pgn檔?")
			if (answer) {
				setFilenameandDownload();
			}
		}
		else
		{
			setFilenameandDownload();
		}
	}
}

function setFilenameandDownload()
{
	var outFileName = prompt("請輸入下載檔名", "chess_file");

	if(outFileName == "")	
		outFileName = 'chess_file.pgn'
	else
		outFileName += ".pgn";
		
	var encoded = new TextEncoder("gb18030",{ NONSTANDARD_allowLegacyEncoding: true }).encode(_pgn_str);
	download(encoded,outFileName);
}

function download (content, filename, contentType) {
    if(!contentType) contentType = 'application/octet-stream';
        var a = document.createElement('a');
        var blob = new Blob([content], {'type':contentType});
        a.href = window.URL.createObjectURL(blob);
        a.download = filename;
        a.click();
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    // use the 1st file from the list
    f = files[0];
    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function() {
        return function(e) {
          $( '#chessBookInput' ).val( e.target.result );
        };
    })(f);
	reader.readAsText(f,"gbk");
}

function stopQuery() {
	_toStop = true;
}

async function queryCloudDB() {
	
	if(_inQuety)
	{
		_inQuety = false;
		stopQuery();
		return;
	}
	_toStop = false;
	_move_total = 0;
    _move_curr  = 0;
	_status_str = "";
	_chess_str = "";
	_copy_str = "";
	_pgn_str = "";
	move_list = [];
	red_score = [];
	score_bias = [];
	recommend_list = [];
	badRateCount = [0,0,0,0];
    var mytext   = document.getElementById("chessBookInput").value;	
	disableButtons();
    _is_not_complete = false;
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
			_inQuety = true;
			is_got_result   = true;
			_status_str = "進度: " + 0 + "/" + list_num;
			showResult();
			query_result = await queryByMoveList(mytext);
			move_list  = query_result[0];
			red_score  = query_result[1];
			score_bias = query_result[2];
			recommend_list = query_result[3];
			_pgn_str = generate_pgn_file(move_list, red_score, score_bias, recommend_list);
			if(red_score.findIndex(Number.isNaN) >= 0)
				_is_not_complete = true;
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
		drawScore(move_list ,red_score, score_bias);
	}
	enableButtons();
	_inQuety = false;
	
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
	uploadBtn.value = '';
}

function showInfo() {

	alert("操作步驟:\
	     \n\t1. 從象棋橋或是東萍匯出文字棋譜。\
	     \n\t2. 將文字棋譜貼至本網頁上，然後按下'雲庫查詢'。\
		 \n\t3. 查詢完成後，按下本網頁上的'複製結果'。\
		 \n\t4. 可將複製結果匯入象棋橋：在象棋橋按'匯入'=>'文字棋譜'。\
		 \n輸出說明:\
		 \n\t1. 盤面分數正分代表紅優，負分則為黑優。\
		 \n\t2. 分數偏差是指和最佳應著之間的偏差絕對值，越小越好。\
		 \n\t3. 分數偏差大於50記為緩著，大於200記為失著。\
		 \n\t4. NaN代表雲庫查無資料。");
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

function copyToClipboard(infoString, copiedContent ) {
    // Create a "hidden" input
	var aux = document.createElement("input");

	// Assign it the value of the specified element
	aux.setAttribute("value", copiedContent);

	// Append it to the body
	document.body.appendChild(aux);
	
	if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
 
        // convert to editable with readonly to stop iOS keyboard opening
        aux.contentEditable = true;
        aux.readOnly = true;

        // create a selectable range
        var range = document.createRange();
        range.selectNodeContents(aux);

        // select the range
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        aux.setSelectionRange(0, 999999);
	} else {
		aux.select();
	}
    
    // Copy the highlighted text
    document.execCommand("copy");
  
    // Remove it from the body
    document.body.removeChild(aux);

    alert("已複製"+infoString+"至你的剪貼本: \n" + copiedContent);
}

function showResult(){
    if(_status_str == "") _status_str = $("#queryBtn").val();
    document.getElementById("queryBtn").innerHTML = _status_str;

	//document.getElementById("chessBookOutput").innerHTML = _chess_str;
}

function disableButtons(){
	for(var i=0; i<buttonList.length; ++i) {
		if(buttonList[i]!=queryBtn)
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
	var first_recommend_list = [];
	var prev_fen  = fen;
	var recommend_list = await query_cloud(fen);
	var prev_recommend_list = recommend_list;
	var score_diff = 0;
	var is_red_before = (fen.indexOf('w') >= 0);
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
		curr_score = is_red_before ? curr_score*(-1) : curr_score;
		recommend_list = await query_cloud(fen);
		is_red_before  = (fen.indexOf('w') >= 0);
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
					score     = is_red_before ? score*(-1) : score;
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
			if(is_red_before)
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
			first_recommend_list.push(fisrt_recommend_move_text);
			addDisplayRow([_move_curr, move_list[i], curr_score, Math.abs(score_diff), fisrt_recommend_move_text, fen, !is_red_before]);
		}
		else
		{
			first_recommend_list.push("");
			addDisplayRow([_move_curr, move_list[i], curr_score, Math.abs(score_diff), "", fen, !is_red_before]);
		}
		if(_toStop) break;
    } 
	_chess_str = _chess_str + "end " + "\n\n";
	
	return [move_list, red_score, score_bias, first_recommend_list];
}

function addStr(newstr) {

	console.log(newstr);
	_chess_str += newstr + "\n";
	_copy_str  += newstr + "\n";
}	

function addDisplayRow(info_list) {
    var table = document.getElementById("moveListTable");
	table.classList.add("outputTable");
    var row = table.insertRow(-1);
	row.classList.add("moveListTable_normal");
	
    var cell_round = row.insertCell(0);
    var cell_move = row.insertCell(1);
	var cell_score = row.insertCell(2);
	var cell_bias = row.insertCell(3);
	var cell_recommend = row.insertCell(4);

	var move_str = info_list[1];
    var result = move_str.link("http://www.chessdb.cn/query/?"+info_list[5]);
    
	if(info_list[5]!="")
	{
		cell_round.innerHTML = "<Button id = 'infoList" + info_list[0] + "' >" + info_list[0] + "</Button>";
		$('#infoList'+info_list[0]).bind("click", function() {
			 copyToClipboard("此盤面FEN碼", decodeURI(info_list[5]) ); 
		});

		if(info_list[6] == true)
			cell_move.innerHTML = '<a href="'+"http://www.chessdb.cn/query/?"+info_list[5]+'" target="_blank" style="color:red">'+move_str+'</a>';
		else
			cell_move.innerHTML = '<a href="'+"http://www.chessdb.cn/query/?"+info_list[5]+'" target="_blank" style="color:blue">'+move_str+'</a>';
		
	}
	else
	{
		cell_move.innerHTML = move_str;
		cell_round.innerHTML = info_list[0];
	}
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