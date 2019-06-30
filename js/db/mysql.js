var _chessDbUrl = "https://pragmatic-byway-242913.appspot.com/chess.php";

function getParameterHandler(val) {
	
	var is_exist = false;
	
	$.post(_chessDbUrl, 
	{url:val, query:"yes"},
	function(data){
	   if( data.includes("yes"))
	   {
		   is_exist = true;
	   }
	   else
	   {
		   alert("網址有誤!");
		   drawScore([], [], []);
		   return;
	   }
	});
    
	$.get(
    _chessDbUrl,
    {url: val},
    function(data) {

	   var res = data.toString().split(";");
	   console.log(res[0]); //account
	   console.log(res[1]); //record
	   var obj = JSON.parse(res[1]);
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
	   drawScore(_chessInfo.moveList, _chessInfo.scoreList, _chessInfo.biasList);
       });
}

function checkUrlExist(val) {
	
	$.post(_chessDbUrl, 
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

function insert2mysql(chessInfo) {
    var movestr = chessInfo.engmoveList.join(",");
	var hash = hash2INT32(movestr);
	var jobj = {
		 "move_num": chessInfo.move_total,
		 "move_list": chessInfo.moveList,
		 "score": chessInfo.scoreList,
		 "bias": chessInfo.biasList,
		 "recommend": chessInfo.recommendList
	   };
	var jstr = JSON.stringify(jobj);
	   
	$.post(_chessDbUrl, 
	{url:hash, record:jstr, account:""},
	function(data){
		alert("上傳雲梯成功!");
	});
}

function uploadresult(chessInfo) {
	var movestr = chessInfo.engmoveList.join(",");
	var hash = hash2INT32(movestr);
	
	$.post(_chessDbUrl, 
	{url:hash, query:"yes"},
	function(data){
	   if( data.includes("yes"))
	   {
		   if (confirm("該棋局已存在，是否要覆蓋?"))
		   {
		       insert2mysql(chessInfo);
		   }
	   }
	   else
	   {
		   insert2mysql(chessInfo);
	   }
	});
}