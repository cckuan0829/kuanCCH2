var _chessDbUrl = "https://pragmatic-byway-242913.appspot.com/chess.php";

function getUserInfo(val) {

	//CHECK the url is belong to user's personal or not.
	if(_chessInfo.is_login)
	{
		$.get(
   			_chessDbUrl,
    		{pers: true, url: val, account: _userInfo.accountID},
    		function(data) {

    		if(data != undefined)
    		{
    			console.log(data);
    			var res = data.toString();
	            var arr = JSON.parse(res);
	            var info = JSON.parse(arr[0].info);
	            
	            document.getElementById("datepicker").value = info.date;
	            document.getElementById("game_name").value = info.game_name;
	            document.getElementById("round").value = info.round;
	            document.getElementById("red_name").value = info.r_name;
				document.getElementById("black_name").value = info.b_name;

				if(info.play_side != undefined && info.play_side != null)
				{
					switch(info.play_side)
					{
						case 0: //none
							document.getElementById("unknown_turn").checked = true;
							break;
						case 1: //red
							document.getElementById("red_turn").checked = true;
							break;
						case 2: //black
							document.getElementById("black_turn").checked = true;
							break;
						default:
					}

				}

				if(info.result != undefined && info.result != null)
				{
					switch(info.result) //1 red win, 2 draw, 3 black win, 0 unknown
					{
						case 0: 
							document.getElementById("unknown_win").checked = true;
							break;
						case 1: 
							document.getElementById("red_win").checked = true;
							break;
						case 2: 
							document.getElementById("draw").checked = true;
							break;
						case 3: 
							document.getElementById("black_win").checked = true;
							break;
						default:
					}
				}
    		}
    	});
	}
}

function getParameterHandler(val) {
	
	var is_exist = false;
	
	$.post(_chessDbUrl, 
	{url:val, query:"yes"},
	function(data){
	   if( data.includes("yes"))
	   {
		   is_exist = true;
		   _chessInfo.is_in_cloud_db = true;
	   }
	   else
	   {
		   alert("網址有誤!");
		   drawScoreChart([]);

		   return;
	   }
	});
    
	$.get(
    _chessDbUrl,
    {url: val},
    function(data) {

	   var res = data.toString();
	   var obj = JSON.parse(res);
	   var fen = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR%20w';
	   var out_str = "";
	   
	   _chessInfo.move_total = obj.move_num;
	   _chessInfo.moveList   = obj.move_list;
	   _chessInfo.engmoveList = convert2engmovelist(_chessInfo.moveList);
	   
	   for (var i = 0; i < _chessInfo.move_total; i++)
	   {
		 _chessInfo.moveCurveList.push(get_Curve(fen, _chessInfo.moveList[i]));  
		 fen = Update_FEN(fen, _chessInfo.moveList[i]);
		 _chessInfo.fenList.push(fen);
		 
		 if(i%2 == 0) { out_str += i/2 + 1 + "."; }
		 
		 out_str += _chessInfo.moveList[i]+" ";
		 
		 if(i%2 == 1) { out_str += "\n"; }
	   }

	   _chessInfo.scoreList  = obj.score;
       _chessInfo.biasList   = obj.bias;
	   _chessInfo.recommendList = obj.recommend;
	   
	   document.getElementById("chessBookInput").value = out_str;
	   removeDisplayTable();
	   showDisplayHeader();
	
	   var is_red = true;
	   for (var i = 0; i < _chessInfo.move_total; i++)
	   {
	   	  if(_chessInfo.scoreList[i] == undefined) _chessInfo.scoreList[i] = NaN;
	   	  if(_chessInfo.biasList[i] == undefined) _chessInfo.biasList[i] = NaN;
	   	  if(_chessInfo.recommendList[i] == undefined) _chessInfo.recommendList[i] = "";
	      addDisplayRow([i+1, _chessInfo.moveList[i], _chessInfo.scoreList[i], _chessInfo.biasList[i], 
	                  _chessInfo.recommendList[i], _chessInfo.fenList[i], is_red]);	
	      is_red = !is_red;
	   }
	   
	   _chessInfo.inQuety = false;
	   _chessInfo.pgn_str = generate_pgn_file(_chessInfo.moveList, _chessInfo.scoreList, _chessInfo.biasList, _chessInfo.recommendList);
	   _chessInfo.copy_str = createCopyStr([_chessInfo.fenList, _chessInfo.moveList, _chessInfo.scoreList, _chessInfo.biasList, _chessInfo.recommendList]);       
   
	   showResult();  
	   showBoardbyNum(0);
	   updateBadRate(calBadRate(_chessInfo.biasList));
	   $('.chartArea').addClass('opacity9');
	   drawScoreChart(_chessInfo.moveList, _chessInfo.scoreList, _chessInfo.biasList, _chessInfo.chartType);
       evaluateChess(true, _chessInfo.biasList);
	   enableButtons();
       _chessInfo.inQuety = false;
	
       $("#copyEgBtn").attr("disabled", false);
       $("#queryBtn").html($("#queryBtn").val());

       });

	getUserInfo(val);

}

async function checkUrlExist(val) {
	
	await $.post(_chessDbUrl, 
	{url:val, query:"yes"},
	 function(data){
	   if( data.includes("yes"))
	   {
		   return true;
	   }
	   else
	   {
		   return false;
	   }
	});
}

function getCartProduct(id, callback){
    $.post('core/ajax/getCartProduct.ajax.php', {id: parseInt(id)}, function(data){
        callback(data);
    });
}

function deleteRecord(myurl, myaccount) {
   $.post(_chessDbUrl, 
	{url:myurl, account:myaccount, delete:"delete"},
	function(data){
		document.getElementById("personalrecordBody").innerHTML = "";

		$.get(
    	_chessDbUrl,
   		{account: _userInfo.accountID},
    	function(data) {
	   		console.log(data);
		   		showPersonalHeader();
	   			if(data)
	   			{
	      			var jarr = JSON.parse(data);
	      			for(var i = 0; i < jarr.length; i++)
	      			{
	   	    			//console.log(jarr[i]);
	   	    			_personInfo[i] = JSON.parse(jarr[i].info);
	   	    			_personInfo[i].url = jarr[i].url;
	   	    			addPersonalRecordRow(_personInfo[i]); 
	      			}
	   			}
		});
	});
}

function loginChessLadder(userInfo) {
	var id    = userInfo.accountID;
	var name  = userInfo.username;
	var email = userInfo.email;

	$.post(_chessDbUrl, 
	{login:"login", accountID: id, name: name, email: email},
	function(data){
		//alert("hi "+name);
		console.log(data);
	});
}

function insert2mysql(chessInfo) {
    var movestr = chessInfo.engmoveList.join(",");
	var hash = hash2INT32(movestr);
	var jobj_record = {
		 "move_num": chessInfo.move_total,
		 "move_list": chessInfo.moveList,
		 "score": chessInfo.scoreList,
		 "bias": chessInfo.biasList,
		 "recommend": chessInfo.recommendList
	   };

	var record_str = JSON.stringify(jobj_record);

	$.post(_chessDbUrl, 
	{url:hash, record: record_str},
	function(data){
		//alert("上傳雲梯成功!");
		_chessInfo.is_in_cloud_db = true;
	});
}

function insert2mysqlwithAccoutInfo(chessInfo, gameInfo) {
    var movestr = chessInfo.engmoveList.join(",");
	var hash = hash2INT32(movestr);
	var jobj_record = {
		 "move_num": chessInfo.move_total,
		 "move_list": chessInfo.moveList,
		 "score": chessInfo.scoreList,
		 "bias": chessInfo.biasList,
		 "recommend": chessInfo.recommendList
	   };

	var jobj_info = {
         "date": gameInfo.date,
   		 "game_name": gameInfo.game_name,
   		 "round": gameInfo.round,
   		 "play_side": gameInfo.play_side, //0: none, 1: red, 2: black 
		 "r_name": gameInfo.r_name,
		 "b_name": gameInfo.b_name,
		 "r_bad_rate1": gameInfo.r_bad_rate1,
		 "r_bad_rate2": gameInfo.r_bad_rate2,
		 "b_bad_rate1": gameInfo.b_bad_rate1,
		 "b_bad_rate2": gameInfo.b_bad_rate2,
		 "result": gameInfo.result,
	   };

	var record_str = JSON.stringify(jobj_record);
	var info_str = JSON.stringify(jobj_info);
	var id = (parseInt(chessInfo.accountID) % 65535) + (parseInt(hash) % 65535) * 65535;

	$.post(_chessDbUrl, 
	{url: hash, record: record_str},
	function(data){
		//alert("上傳雲梯成功!");
		_chessInfo.is_in_cloud_db = true;
	});

	$.post(_chessDbUrl, 
	{id: id, url: hash, account: chessInfo.accountID, info: info_str},
	function(data){

	});
}

function uploadresult(chessInfo, gameInfo) {
	//var movestr = chessInfo.engmoveList.join(",");
	//var hash = hash2INT32(movestr);
	
    if(chessInfo.is_login)
	   insert2mysqlwithAccoutInfo(chessInfo, gameInfo);
	else
	   insert2mysql(chessInfo);

	/*
	$.post(_chessDbUrl, 
	{url:hash, query:"yes"},
	function(data){
	   if( data.includes("yes"))
	   {
		   if (confirm("該棋局已存在，是否要覆蓋?"))
		   {
		   	   if(chessInfo.is_login)
		   	      insert2mysqlwithAccoutInfo(chessInfo, gameInfo);
		       else
		          insert2mysql(chessInfo);
		   }
	   }
	   else
	   {
		   if(chessInfo.is_login)
		      insert2mysqlwithAccoutInfo(chessInfo, gameInfo);
		   else
		      insert2mysql(chessInfo);
	   }
	});
	*/
}
