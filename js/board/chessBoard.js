var chessType = {
	'X':'',
	'Y':'',
	'K':'帥',
	'k':'將',
	'A':'仕',
	'a':'士',
	'B':'相',
	'b':'象',
	'R':'車',
	'r':'車',
	'N':'傌',
	'n':'馬',
	'C':'炮',
	'c':'包',
	'P':'兵',
	'p':'卒',
};

var _chessBoardNumber = 
[['1', '2', '3', '4', '5', '6', '7', '8', '9'],
 ['9', '8', '7', '6', '5', '4', '3', '2', '1'],
 ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
 ['九', '八', '七', '六', '五', '四', '三', '二', '一'],
];

var config = {
	preChessPiece: 26,
	preTd: 30,
};

var ChessPiece = function(x ,y, chess) {
	this.x = x;
	this.y = y;
	this.chess = chess;
	this.placement();
};
//把棋子放置在页面中
ChessPiece.prototype.placement = function() {
	if(this.chess == 'X')
	{
		this.DOM = $('<i class="chesspieceMovingCurve">');
	}
	else if(this.chess == 'Y')
	{
		this.DOM = $('<i class="chesscurrent">');
	}
	else
	{
		if(this.chess == this.chess.toUpperCase()) this.DOM = $('<i class="chesspieceRed textcolor">');
		else this.DOM = $('<i class="chesspieceBlack textcolor">');
	}
	
	this.DOM.html(chessType[this.chess]);
	this.DOM.css({
		left: this.y*config.preTd - config.preChessPiece/2,
		top: this.x*config.preTd - config.preChessPiece/2,
	});
	$list.append(this.DOM);
};

var ChessBoard = function(chessList, score, bias, recommend, is_horiz_ori, is_vertical_ori) {
	$info= $('#chess-info');
	var recommend_text = "";
	if(recommend != null && recommend != "") recommend_text = "，推薦："+recommend;
	
	if(score != null && bias != null)
	{
		if(bias >= 200)
			$info.html("局分："+score+"；失著"+recommend_text);
		else if(bias >= 50)
			$info.html("局分："+score+"；緩著"+recommend_text);
		else
			$info.html("局分："+score);
	}
	else
	{
		$info.html("");
	}
	
	this.chessList = chessList;
	this.initBoard(is_horiz_ori, is_vertical_ori);
	this.placementAll();
};

ChessBoard.prototype.initBoard = function(is_hori_ori, is_vert_ori) {
	$list = $('#chesslist');
	$list.empty();
	$axi_top = $('#axi-top');
	$axi_bot = $('#axi-bot');
	$axi_top.empty();
	$axi_bot.empty();
	
	var top_num = 0;
	var bot_num = 0;
	if(is_hori_ori)
	{
		if(is_vert_ori)
		{
			top_num = 0;
			bot_num = 3;
		}
		else
		{
			top_num = 3;
			bot_num = 0;
		}
	}
	else
	{

		if(is_vert_ori)
		{
			top_num = 1;
			bot_num = 2;
		}
		else
		{
			top_num = 2;
			bot_num = 1;
		}
	}
	
	for(var i = 0; i < 9; i++)
	{
		this.DOM = $('<i class="chess-axi-top">');
		this.DOM.html(_chessBoardNumber[top_num][i]);
		this.DOM.css({
			left: -5+(i)*30,
			top: -31,
		});
		$axi_top.append(this.DOM);
	}	
	
	for(var i = 0; i < 9; i++)
	{
		this.DOM = $('<i class="chess-axi-bot">');
		this.DOM.html(_chessBoardNumber[bot_num][i]);
		this.DOM.css({
			left: -5+(i)*30,
			top: 14,
		});
		$axi_bot.append(this.DOM);
	}
}

ChessBoard.prototype.placementAll = function() {
	var ChessPieceList; 
		
	for(var i = 0; i < this.chessList.length; i++)
	{
		var chess_info = this.chessList[i];
		
		new ChessPiece(chess_info[0], chess_info[1], chess_info[2]);
	}
};

function FEN_to_ChessList(fen, curve, is_horiz_ori, is_vertical_ori)
{
    var chesslist=[];
    var row_list = fen.split(/\/|%/);
	var x_1, x_2, y_1, y2;
	
	for( var i = 0; i < 10; i++)
	{
        var index = 0;
        for ( var j = 0; j < row_list[i].length; j++)
		{
            var cha = row_list[i][j];
            var val = cha.charCodeAt(0)-'0'.charCodeAt(0);
            if( val <= 9 && val > 0)
            {
				index = index + val;
            }
			else
			{
				var x = is_vertical_ori ? i : 9-i;
				var y = is_horiz_ori ? index : 8-index;
                chesslist.push([x, y, cha]);
                index = index + 1;
			}
		}
	}
	
	if (curve != null)
	{
		if(is_horiz_ori) 
		{
			y_1 = curve[1];
			y_2 = curve[3];
		}
		else
		{
			y_1 = 8-curve[1];
			y_2 = 8-curve[3];
		}
		
		if(is_vertical_ori) 
		{
			x_1 = curve[0];
			x_2 = curve[2];
		}
		else
		{
			x_1 = 9-curve[0];
			x_2 = 9-curve[2];
		}
		
		chesslist.push([x_1, y_1, 'X']);
		chesslist.push([x_2, y_2, 'Y']);
	}
	
    return chesslist;
}
