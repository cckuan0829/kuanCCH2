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
var infoBtn = document.getElementById("infoBtn");
var uploadBtn =  document.getElementById("uploadBtn");
var uploadInput = document.getElementById("uploadInput");
var prevBtn = document.getElementById("prevBtn");
var nextBtn = document.getElementById("nextBtn");
var firstBtn = document.getElementById("firstBtn");
var endBtn = document.getElementById("endBtn");
var fenBtn = document.getElementById("fenBtn");
var cloudBtn = document.getElementById("cloudBtn");
var verticalBtn = document.getElementById("verticalBtn");
var horizBtn = document.getElementById("horizBtn");

var buttonList = [
	queryBtn,
	copyBtn,
	clearBtn,
	infoBtn,
	downloadBtn,
	uploadBtn,
	firstBtn,
	endBtn,
	prevBtn,
	nextBtn,
	fenBtn,
	cloudBtn,
	verticalBtn,
	horizBtn,
];

var _chessInfo =
{
	pgn_str: "",
	copy_str: "",
	status_str: "",
	move_total: 0,
	move_curr: 0,
	currNumber: 0,
	toStop: false,
	inQuety: false,
	is_not_complete: false,
	is_got_result: false,
	is_vertical_original: true,
	is_horizontal_original: true,
	moveList: [],
	fenList: [],
	scoreList: [],
	biasList: [],
	recommendList: [],
	badRate: [0, 0, 0, 0], //red NG, red BAD, black NG, black BAD 
}

$(document).ready(function() {
    queryBtn.addEventListener("click", queryCloudDB);
    $("#queryBtn").val($("#queryBtn").html());

    copyBtn.addEventListener("click", copyQueryResult);
    clearBtn.addEventListener("click", clearInputText);
	infoBtn.addEventListener("click", showInfo);
	downloadBtn.addEventListener("click", onDownloadBtnClick);
	uploadInput.addEventListener('change', handleFileSelect, false);
	uploadBtn.addEventListener('click', onUploadBtnClick);
	firstBtn.addEventListener('click', onFirstBtnClick);
	endBtn.addEventListener('click', onEndBtnClick);
	prevBtn.addEventListener('click', onPrevBtnClick);
	nextBtn.addEventListener('click', onNextBtnClick);
	fenBtn.addEventListener('click', onFenBtnClick);
	cloudBtn.addEventListener('click', onCloudBtnClick);
	verticalBtn.addEventListener('click', onVerticalBtnClick);
	horizBtn.addEventListener('click', onHorizBtnClick);

    $("#copyEgBtn").bind("click", function() {
        copyToClipboard("範例棋譜",inputExample);
    });
    
    initPlaceholder();
});

function onUploadBtnClick() {
	$("#uploadInput").click();
}

function onDownloadBtnClick() {
	
	console.log($("#uploadInput").value);
	if($("#moveListTable")[0].innerText === "") {
		alert('搜尋後才能下載!');
	}
	else {	
		if(_chessInfo.is_not_complete)
		{
			if (confirm("盤面分析未完整，是否仍要下載pgn檔?"))
			{
				setFilenameandDownload();
			}
		}
		else
		{
			setFilenameandDownload();
		}
	}
}

function onFirstBtnClick()
{
	showBoardbyNum(0);
	_chessInfo.currNumber = 0;
}

function onEndBtnClick()
{
	if(_chessInfo.move_total>0)
	{
		showBoardbyNum(_chessInfo.move_total);
		_chessInfo.currNumber = _chessInfo.move_total;
	}
}

function onPrevBtnClick()
{
	if(_chessInfo.currNumber>0)
	{
		showBoardbyNum(_chessInfo.currNumber-1);
	}
}

function onNextBtnClick()
{
	if(_chessInfo.currNumber<_chessInfo.move_total)
	{
		showBoardbyNum(_chessInfo.currNumber+1);
	}
}

function onFenBtnClick()
{
	if(_chessInfo.move_total>0)
	{
		if(_chessInfo.currNumber>0)
		{
			copyToClipboard("此盤面FEN碼", _chessInfo.fenList[_chessInfo.currNumber-1]);
		}
		else
		{
			copyToClipboard("此盤面FEN碼", getDefaultFEN());
		}
	}
}

function onCloudBtnClick()
{
	if(_chessInfo.move_total>0)
	{
		if(_chessInfo.currNumber>0)
		{
			window.open("http://www.chessdb.cn/query/?"+_chessInfo.fenList[_chessInfo.currNumber-1], "_blank");
		}
		else
		{
			window.open("http://www.chessdb.cn/query/?"+getDefaultFEN(), "_blank");
		}
	}
}

function onVerticalBtnClick()
{
	_chessInfo.is_vertical_original = ! _chessInfo.is_vertical_original;
	showBoardbyNum(_chessInfo.currNumber);
	
}

function onHorizBtnClick()
{
	_chessInfo.is_horizontal_original = ! _chessInfo.is_horizontal_original;
	showBoardbyNum(_chessInfo.currNumber);
}

function setFilenameandDownload()
{
	var outFileName = prompt("請輸入下載檔名", "chess_file");

	if(outFileName == null)
	{
		return;
	}
	else
	{
		if(outFileName == "")	
			outFileName = 'chess_file.pgn'
		else
			outFileName += ".pgn";
			
		var encoded = new TextEncoder("gb18030",{ NONSTANDARD_allowLegacyEncoding: true }).encode(_chessInfo.pgn_str);
		download(encoded,outFileName);
	}
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
	_chessInfo.toStop = true;
}

function resetChessInfo() {
	_chessInfo.copy_str = "";
	_chessInfo.status_str = "";
	_chessInfo.move_total = 0;
	_chessInfo.move_curr = 0;
	_chessInfo.currNumber = 0;
	_chessInfo.toStop = false;
	_chessInfo.inQuety = false;
	_chessInfo.is_not_complete = false;
	_chessInfo.is_got_result = false;
	_chessInfo.is_vertical_original = true;
	_chessInfo.is_horizontal_original = true;
	_chessInfo.scoreList = [];
	_chessInfo.biasList = [];
	_chessInfo.fenList = [];
	_chessInfo.recommendList = [];
	_chessInfo.badRate = [0, 0, 0, 0];
}

async function queryCloudDB() {
	
	if(_chessInfo.inQuety)
	{
		_chessInfo.inQuety = false;
		stopQuery();
		return;
	}
	resetChessInfo();
	
    var mytext   = document.getElementById("chessBookInput").value;	
	disableButtons();
	
	removeDisplayTable();
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
			_chessInfo.inQuety = true;
			_chessInfo.is_got_result = true;
			_chessInfo.status_str = "進度:" + 0 + "/" + list_num;
			showResult();
			query_result = await queryByMoveList(mytext);
			_chessInfo.moveList  = query_result[0];
			_chessInfo.scoreList  = query_result[1];
			_chessInfo.biasList = query_result[2];
			_chessInfo.recommendList = query_result[3];
			_chessInfo.fenList = query_result[4];
			_chessInfo.pgn_str = generate_pgn_file(_chessInfo.moveList, _chessInfo.scoreList, _chessInfo.biasList, _chessInfo.recommendList);
			if(_chessInfo.scoreList.findIndex(Number.isNaN) >= 0)
				_chessInfo.is_not_complete = true;
		}
		else
		{
			alert("輸入格式有誤!");
		}
	}
	if(_chessInfo.is_got_result)
	{
		showResult();  
		showBoardbyNum(0);
		updateBadRate(calBadRate(_chessInfo.biasList));
		$('.chartArea').addClass('opacity9');
		drawScore(_chessInfo.moveList, _chessInfo.scoreList, _chessInfo.biasList);
	}
	enableButtons();
	_chessInfo.inQuety = false;
	
    $("#copyEgBtn").attr("disabled", false);
    $("#queryBtn").html($("#queryBtn").val());
}

function copyQueryResult() {
	
	const el = document.createElement('textarea');
    el.value = document.getElementById("badRate").innerHTML+"\n"+_chessInfo.copy_str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
	
	if(_chessInfo.copy_str != "")		
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
    if(_chessInfo.status_str == "") _status_str = $("#queryBtn").val();
    document.getElementById("queryBtn").innerHTML = _chessInfo.status_str;
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
	var red_score = [];
	var score_bias = [];
	var first_recommend_list = [];
	var fen_list = [];
	var prev_fen  = fen;
	var recommend_list = await query_cloud(fen);
	var prev_recommend_list = recommend_list;
	var score_diff = 0;
	var is_red_before = (fen.indexOf('w') >= 0);
	var curr_score = 0;
	var show_len = recommend_list.length <= 5 ? recommend_list.length : 5;
	var search_len = recommend_list.length <= 10 ? recommend_list.length : 10;
    var fisrt_recommend_move_text = "";
	
	_chessInfo.move_total = move_list.length;
	_chessInfo.copy_str  += "FEN：" + fen + "\n";
	
	showDisplayHeader();
	
	for (var i = 0; i < move_list.length; i++)
	{
		_chessInfo.move_curr = i+1;
		addStr(_chessInfo.move_curr + "." + move_list[i]);

		prev_fen = fen;
		fen = Update_FEN(fen, move_list[i]);
		fen_list.push(fen);
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
        _chessInfo.status_str = "進度:" + _chessInfo.move_curr + "/" + _chessInfo.move_total ;
		showResult();
		prev_recommend_list = recommend_list;
		addStr("\n");
		
		if ( Math.abs(score_diff) > 20 || Number.isNaN(score_diff))
		{
			first_recommend_list.push(fisrt_recommend_move_text);
			addDisplayRow([_chessInfo.move_curr, move_list[i], curr_score, Math.abs(score_diff), fisrt_recommend_move_text, fen, !is_red_before]);
		}
		else
		{
			first_recommend_list.push("");
			addDisplayRow([_chessInfo.move_curr, move_list[i], curr_score, Math.abs(score_diff), "", fen, !is_red_before]);
		}
		if(_chessInfo.toStop) 
		{
			_chessInfo.move_total = _chessInfo.move_curr; 
			break;
		}
    } 
	_chessInfo.move_curr = 0;
	return [move_list, red_score, score_bias, first_recommend_list, fen_list];
}

function addStr(newstr) {

	console.log(newstr);
	_chessInfo.copy_str  += newstr + "\n";
}	

function showDisplayHeader(){
	var table = document.getElementById("moveListTable");
	var th_num = document.getElementById("th_num");
	var th_move = document.getElementById("th_move");
	var th_score = document.getElementById("th_score");
	var th_bias = document.getElementById("th_bias");
	var th_recom = document.getElementById("th_recom");
	th_num.classList.add("wid_70");
	th_move.classList.add("wid_120");
	th_score.classList.add("wid_120");
	th_bias.classList.add("wid_120");
	th_recom.classList.add("wid_180");
	table.classList.add("outputTable");	
	table.style.visibility = "visible";
}


function addDisplayRow(info_list) {
    var table = document.getElementById("moveListTable");
	
	var tbody = document.getElementById("moveListTableBody");
    tbody.classList.add("TableRow");	
	var row = tbody.insertRow(-1);
	
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
			 showBoardbyNum(info_list[0]); 
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
	
	cell_round.classList.add("wid_70");
	cell_move.classList.add("wid_120");
	cell_score.classList.add("wid_120");
	cell_bias.classList.add("wid_120");
	cell_recommend.classList.add("wid_180");
}

function removeDisplayTable() {
	document.getElementById("moveListTable").style.visibility = "visible";
	document.getElementById("moveListTableBody").innerHTML = "";
}

function updateBadRate(badrate) {
	var badratetext = document.getElementById("badRate");
	badratetext.classList.add("rateArea");
	badratetext.innerHTML = "紅方 緩著率："+_chessInfo.badRate[0]+"%， 失著率："+_chessInfo.badRate[1]+"% \n"+
	                        "黑方 緩著率："+_chessInfo.badRate[2]+"%， 失著率："+_chessInfo.badRate[3]+"%";
}

function resetBadRate()
{
	var badratetext = document.getElementById("badRate");
	badratetext.innerHTML = "";
}

function calBadRate(score_bias)
{
	_chessInfo.badRate = [NaN,NaN,NaN,NaN];
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

	if(badRateCount[0]>0)
	{
		_chessInfo.badRate[0] = parseInt(100*badRateCount[1]/badRateCount[0]);
		_chessInfo.badRate[1] = parseInt(100*badRateCount[2]/badRateCount[0]);
	}
		
	if(badRateCount[3]>0)
	{
		_chessInfo.badRate[2] = parseInt(100*badRateCount[4]/badRateCount[3]);
		_chessInfo.badRate[3] = parseInt(100*badRateCount[5]/badRateCount[3]);
	}

	return badRate;
}

function showBoardbyNum(num)
{
	var moveNumbertext = document.getElementById("moveNumber");
	if(_chessInfo.fenList.length >= num && num > 0) fen = _chessInfo.fenList[num-1];
	else fen = getDefaultFEN();
	chessList = FEN_to_ChessList(fen, _chessInfo.is_vertical_original, _chessInfo.is_horizontal_original);
	_chessInfo.currNumber = num;
	moveNumbertext.innerHTML = _chessInfo.currNumber+"/"+_chessInfo.move_total;
	new ChessBoard(chessList);
}

function showBoard(fen)
{
	chessList = FEN_to_ChessList(fen, _chessInfo.is_vertical_original, _chessInfo.is_horizontal_original);
	new ChessBoard(chessList);
}

function showInitBoard()
{
	fen = getDefaultFEN();
	chessList = FEN_to_ChessList(fen, true, true);
	new ChessBoard(chessList);
}

window.onload = showInitBoard;