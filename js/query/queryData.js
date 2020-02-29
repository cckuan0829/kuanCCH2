function httpGet(theUrl)
{
	return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", theUrl);
      xhr.onload = () => resolve(xhr.responseText);
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(null);
    });
	
}

async function query_cloud(fen)
{
    var url='http://api.chessdb.cn:81/chessdb.php?action=queryall&learn=1&showall=1&egtbmetric=dtc&board='+fen;
    var data = await httpGet(url);
	var my_list = data.split(/\|/);
	var new_list = my_list.filter(move => (move.indexOf('??') == -1 ));
    return new_list;
}

async function query_score(fen)
{
    var url  = "http://api.chessdb.cn:81/chessdb.php?action=queryscore&learn=1&showall=1&egtbmetric=dtc&board="+fen;
    var data = await httpGet(url);
	var qurey_list = data.split(/:/); 
    
	if(qurey_list.length > 1)
        return parseInt(qurey_list[1]);
    else
        return NaN;
}

async function queryByMove(prev_fen, move)
{
	var recommend_list;
	var prev_recommend_list;
	var is_red_before = false;
	var show_len;
	var search_len;
    var fisrt_recommend_move_text = "";
    var recommend_str = "";
	var res =
	{
       red_score:NaN, 
       score_bias:NaN, 
       recommend:NaN, 
       fen:NaN, 
       curve:NaN,
       recommend_str:"",
	};
		
	res.curve = get_Curve(prev_fen, move);
	res.fen = Update_FEN(prev_fen, move);
	is_red_before  = (res.fen.indexOf('w') >= 0);
	prev_recommend_list = await query_cloud(prev_fen);
    recommend_list = await query_cloud(res.fen);

    res.red_score = await query_score(res.fen);
	if(!is_red_before) res.red_score *= -1;

	fisrt_recommend_move_text = "";

	var qurey_list = []; 
	var score_list = [];	
	search_len = prev_recommend_list.length;
	for ( var j = 0; j < search_len; j++)
	{
		qurey_list = prev_recommend_list[j].split(/:|,|\(/);       
		
		if (prev_recommend_list[j].indexOf('invalid') < 0 && prev_recommend_list[j].length >= 10)
		{
			var move = get_move_text(prev_fen, qurey_list[1]);
			var score = qurey_list[3];
			score     = is_red_before ? score*(-1) : score;
			score_list.push(score);
			if(res.fen == Update_FEN(prev_fen, move))
			{
				res.red_score = parseInt(score);
				break;
			}
			else
			{
				if(j < 5) recommend_str += "-" + move + " ,score = " + score + "\n";
			}

			if(j == 0) fisrt_recommend_move_text = move;
		}
	}

    if(res.red_score != NaN)
    {
		if(is_red_before)
			res.score_bias = Math.min(...score_list)-res.red_score;
    	else
			res.score_bias = Math.max(...score_list)-res.red_score;
	}

	res.score_bias = Math.abs(res.score_bias);

	prev_recommend_list = recommend_list;
	
	if ( Math.abs(res.score_bias) > 20 || Number.isNaN(res.score_bias))
	{
		res.recommend = fisrt_recommend_move_text;
	}
	else
	{
		res.recommend = "";
	}
    
    res.recommend_str = recommend_str;

	return res;
}

async function queryByMoveList(chess_manual)
{
	var res =
	{
       move_list:[], 
       red_score_list:[], 
       score_bias_list:[], 
       first_recommend_list:[], 
       fen_list:[], 
       curve_list:[],
       recommend_str_list:[], 
	};
	
	var parse_res = parsing_text(chess_manual);
	var fen       = parse_res[0];
	var prev_fen  = fen;
	var recommend_list = await query_cloud(fen);
	var prev_recommend_list = recommend_list;
	var is_red_before = false;
	var score_diff = 0;
	var curr_score = 0;
    var fisrt_recommend_move_text = "";

    res.move_list = parse_res[1];

	_chessInfo.move_total = res.move_list.length;
	
	showDisplayHeader();
	
	for (var i = 0; i < res.move_list.length; i++)
	{
		prev_fen  = fen;
		prev_recommend_list = recommend_list;
		recommend_list = await query_cloud(fen);
		move_str1 = res.move_list[i];
		move_str2 = res.move_list[i];
        is_red_before  = (fen.indexOf('w') >= 0);
        fen = Update_FEN(fen, move_str1);
		res_per_move = await queryByMove(prev_fen, move_str2);
        res.red_score_list.push(res_per_move.red_score);
        res.score_bias_list.push(res_per_move.score_bias); 
        res.first_recommend_list.push(res_per_move.recommend); 
        res.recommend_str_list.push(res_per_move.recommend_str); 
        res.curve_list.push(res_per_move.curve);
        res.fen_list.push(fen);

        _chessInfo.move_curr = i+1;
        _chessInfo.status_str = "" + _chessInfo.move_curr + "/" + _chessInfo.move_total;
        showResult();
        addDisplayRow([_chessInfo.move_curr, res.move_list[i], res.red_score_list[i], res.score_bias_list[i], res.first_recommend_list[i], res.fen_list[i], is_red_before]);

        if(_chessInfo.toStop) 
		{
			_chessInfo.move_total = _chessInfo.move_curr; 
			return res; 
		}
    } 

	return res; 
}

