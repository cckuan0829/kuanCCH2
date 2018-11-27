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
	'N':'馬',
	'n':'馬',
	'C':'炮',
	'c':'炮',
	'P':'兵',
	'p':'卒',
};

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

var ChessBoard = function(chessList, score, bias, recommend) {
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
	this.initBoard();
	this.placementAll();
};

ChessBoard.prototype.initBoard = function() {
	$list = $('#chesslist');
	$list.empty();
}

ChessBoard.prototype.placementAll = function() {
	var ChessPieceList; 
		
	for(var i = 0; i < this.chessList.length; i++)
	{
		var chess_info = this.chessList[i];
		
		new ChessPiece(chess_info[0], chess_info[1], chess_info[2]);
	}
};

function FEN_to_ChessList(fen, is_vertical_ori, is_horiz_ori)
{
    var chesslist=[];
    var row_list = fen.split(/\/|%/);

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
				var x = is_horiz_ori ? i : 9-i;
				var y = is_vertical_ori ? index : 8-index;
                chesslist.push([x, y, cha]);
                index = index + 1;
			}
		}
	}
	
    return chesslist;
}
