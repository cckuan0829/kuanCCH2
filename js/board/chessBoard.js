var RED_MOVE   = 2;
var BLACK_MOVE = 1;
var NONE_MOVE  = 0;

var chessType = {
	'X':'',
	'Y':'',
	'0':'',
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

var BLACK_NORMAL_VIEW   = 0;
var BLACK_OPPOSITE_VIEW = 1
var RED_OPPOSITE_VIEW   = 2;
var RED_NORMAL_VIEW     = 3;
var _chessBoardNumber = 
[['１', '２', '３', '４', '５', '６', '７', '８', '９'],
 ['９', '８', '７', '６', '５', '４', '３', '２', '１'],
 ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
 ['九', '八', '七', '六', '五', '四', '三', '二', '一'],
];

var ChessPiece = function(chess, x ,y) {
	this.chess = chess;
	this.x = x; // x is the row index in the board, top is 0 
	this.y = y; // y is the column index in the bord, left is 0
};

//把棋子放置在页面中
ChessPiece.prototype.placement = function() {
	var bodyStyles = window.getComputedStyle(document.body); 
	var preChessPiece = parseInt(bodyStyles.getPropertyValue('--chess'));
	var preTd = parseInt(bodyStyles.getPropertyValue('--grid'));

	if(this.chess == '0')
		return;

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
		if(isChessRed(this.chess)) this.DOM = $('<i class="chesspieceRed textcolor">');
		else this.DOM = $('<i class="chesspieceBlack textcolor">');
	}

	this.DOM.html(chessType[this.chess]);
	this.DOM.css({
		left: this.y*preTd - preChessPiece/2,
		top: this.x*preTd - preChessPiece/2,
	});
	this.DOM.attr({
				'data-chess' : this.chess,
				'data-x': this.x,
				'data-y': this.y
			});
	$list.append(this.DOM);
};

ChessPiece.prototype.move = function(x, y) {
	var bodyStyles = window.getComputedStyle(document.body); 
	var preChessPiece = parseInt(bodyStyles.getPropertyValue('--chess'));
	var preTd = parseInt(bodyStyles.getPropertyValue('--grid'));

	this.DOM.css({
		left: this.y*preTd - preChessPiece/2,
		top: this.x*preTd - preChessPiece/2,
	});
	this.DOM.attr({
				'data-chess' : this.chess,
				'data-x': this.x,
				'data-y': this.y
			});
};

var ChessBoard = function(chessList, score, bias, recommend, is_horiz_ori, is_vertical_ori) {
	$info= $('#chess-info');
	var chesspiecelist = [];
	var recommend_text = "";
	var listlen = chessList.length;
    var board = Array(10).fill(0).map(x => Array(9).fill('0'));

    for (var i = 0; i < listlen; i++) {

    	var chess_info = chessList[i];
        chesspiecelist.push(new ChessPiece(chess_info[0], chess_info[1], chess_info[2]));
        board[chess_info[1]][chess_info[2]] = chess_info[0];
    }

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
	
	this.board = board;
	this.chesspiecelist = chesspiecelist;
	this.selectedChess = null;
	this.lastmove = NONE_MOVE;
	this.initBoard(is_horiz_ori, is_vertical_ori);
	this.placementAll();
	
	//var title = document.getElementById("chessboard-name");
	//title.innerHTML = document.getElementById("title").innerHTML;
};

ChessBoard.prototype.initBoard = function(is_hori_ori, is_vert_ori) {
	$list = $('#chesslist');
	$list.empty();
	$axi_top = $('#axi-top');
	$axi_bot = $('#axi-bot');
	$chess_hor = $('#chess-hor');
	$chess_ver = $('#chess-ver');
	$axi_top.empty();
	$axi_bot.empty();
	$chess_hor.empty();
	$chess_ver.empty();
	
	var bodyStyles = window.getComputedStyle(document.body); 
	var preTd = parseInt(bodyStyles.getPropertyValue('--grid'));
	var top_num = 0;
	var bot_num = 0;
	if(is_hori_ori)
	{
		//BLACK_NORMAL_VIEW   = 0;
		//BLACK_OPPOSITE_VIEW = 1
		//RED_OPPOSITE_VIEW   = 2;
		//RED_NORMAL_VIEW     = 3;
		if(is_vert_ori)
		{
			top_num = BLACK_NORMAL_VIEW;
			bot_num = RED_NORMAL_VIEW;
		}
		else
		{
			top_num = RED_NORMAL_VIEW;
			bot_num = BLACK_NORMAL_VIEW;
		}
	}
	else
	{

		if(is_vert_ori)
		{
			top_num = BLACK_OPPOSITE_VIEW;
			bot_num = RED_OPPOSITE_VIEW;
		}
		else
		{
			top_num = RED_OPPOSITE_VIEW;
			bot_num = BLACK_OPPOSITE_VIEW;
		}
	}
	
	for(var i = 0; i < 9; i++)
	{
		this.DOM = $('<i class="chess-axi-top">');
		this.DOM.html(_chessBoardNumber[top_num][i]);
		this.DOM.css({
			left: -6+(i)*preTd,
			top: -(1+preTd),
		});
		$axi_top.append(this.DOM);
	}	
	
	for(var i = 0; i < 9; i++)
	{
		this.DOM = $('<i class="chess-axi-bot">');
		this.DOM.html(_chessBoardNumber[bot_num][i]);
		this.DOM.css({
			left: -6+(i)*preTd,
		});
		$axi_bot.append(this.DOM);
	}
    

    for(var j = 0; j < 10; j++)
    {
    	this.DOM = $('<i class="horizonLine">');
		this.DOM.css({
			 width : 8*preTd,
			 left: 0,
			 top: (j)*preTd,
		});
		$chess_hor.append(this.DOM);
    }

    for(var i = 0; i < 9; i++)
    {
    	for(j = 0; j < 2 ; j++)
    	{
    		this.DOM = $('<i class="verticalLine">');
			this.DOM.css({
			     height : (4*preTd)+1,
			     left: (i)*preTd,
			     top: j*(5*preTd),
		    });
		    $chess_ver.append(this.DOM);
    	}
    }
}

ChessBoard.prototype.placementAll = function() {

	for(var i = 0; i < this.chesspiecelist.length; i++)
	{
		this.chesspiecelist[i].placement();
	}
};

ChessBoard.prototype.setActiveClass = function(bool) {
	if(this.selectedChess)
	{
		if(isChessRed(this.selectedChess.chess))
		{
			if(bool) this.selectedChess.addClass('red-active');
			else this.selectedChess.removeChess('red-active');
		}
		else
		{
			if(bool) this.selectedChess.addClass('black-active');
			else this.selectedChess.removeChess('black-active');
		}
	}
}

ChessBoard.prototype.getChessPieceIdx = function(x, y) {
	//var chesspiece = this.getChessPiece(chess, x, y);
	//chesspiece.move(x, y);;
	for(var i = 0; i < this.chesspiecelist.length; i++)
	{
		if(x == this.chesspiecelist[i].x && y == this.chesspiecelist[i].y && this.chesspiecelist[i].chess != 0)
		{
			return i;
		}
	}
	return -1;
};

ChessBoard.prototype.getMoveStr = function(chesspiece_idx, x, y) {
	//var chesspiece = this.getChessPiece(chess, x_o, y_o);
	//chesspiece.move(x_n, y_n);
	var movestr = "";
	
	if(chesspiece_idx >= 0) 
	{
		var chess = this.chesspiecelist[chesspiece_idx].chess;
		var x_bef = this.chesspiecelist[chesspiece_idx].x;
		var y_bef = this.chesspiecelist[chesspiece_idx].y;
		movestr = generateMoveText(this.board, chess, x_bef, y_bef, x, y);
	}

	return movestr;
};

ChessBoard.prototype.moveChess = function(chesspiece_idx, x, y) {
	//var chesspiece = this.getChessPiece(chess, x_o, y_o);
	//chesspiece.move(x_n, y_n);
	
	if(chesspiece_idx >= 0) 
	{
		var chess = this.chesspiecelist[chesspiece_idx].chess;
		var x_bef = this.chesspiecelist[chesspiece_idx].x;
		var y_bef = this.chesspiecelist[chesspiece_idx].y;

		this.chesspiecelist[chesspiece_idx].x = x;
		this.chesspiecelist[chesspiece_idx].y = y;
		this.board[x_bef][y_bef] = '0';
		this.board[x][y] = chess;
        this.initBoard(true, true);
		this.placementAll();
		if(isChessRed(chess)) this.lastmove = RED_MOVE; 
		else this.lastmove = BLACK_MOVE;
	}

};

ChessBoard.prototype.removeChess = function(x, y) {
	//var chesspiece = this.getChessPiece(chess, x_o, y_o);
	//chesspiece.move(x_n, y_n);
	var chesspiece_idx = this.getChessPieceIdx(x, y);
	if(chesspiece_idx >= 0) 
	{
		this.chesspiecelist[chesspiece_idx].x = 0;
		this.chesspiecelist[chesspiece_idx].y = 0;
		this.chesspiecelist[chesspiece_idx].chess = '0';
		
 	    this.initBoard(true, true);
		this.placementAll();
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
                chesslist.push([cha, x, y]);
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
		
		chesslist.push(['X', x_1, y_1]);
		chesslist.push(['Y', x_2, y_2]);
	}
	
    return chesslist;
}

function isChessRed(chess)
{
	return (chess == chess.toUpperCase() ? true : false);
}

function generateMoveText(board, chess, x_bef, y_bef, x_aft, y_aft)
{
	var chessUp = chess.toUpperCase();
    var movestr = "";
    var isred = isChessRed(chess);
    var chessstr = conver_english_chess(chess);
    var ismultiple = false;
    var movedir = "平";
    var chess_num_in_col = 0;
	var is_first_show = true;

    if(x_bef != x_aft)
    {
    	if((isred && x_bef > x_aft ) || (!isred && x_bef < x_aft) ) movedir = "進"; 
    	else movedir = "退";
    }

    for(var x = 0; x < 10; x ++)
    {
    	if(board[x][y_bef] == chess) 
    	{
    		if(chess_num_in_col == 0)
    		{
    			if(x == x_bef) is_first_show = true; //紅:前, 黑:後
    			else           is_first_show = false;//紅:後, 黑:前
    		}
    		chess_num_in_col++;
    	}
    }
    
    if(chess_num_in_col > 1)
    {
    	if((isred && is_first_show) || (!isred && !is_first_show))
    	{
    		movestr = '前' + chessstr;
    	}
    	else
    	{
    		movestr = '後' + chessstr;
    	}
    }
    else
    {
    	if(isred)
    	{
    		movestr = chessstr+_chessBoardNumber[RED_NORMAL_VIEW][y_bef];
    	}
    	else
    	{
    		movestr = chessstr+_chessBoardNumber[BLACK_NORMAL_VIEW][y_bef];
    	}
    }

    if(isred)
    {
    	if(movedir == "平")
    	{
    		movestr += movedir+_chessBoardNumber[RED_NORMAL_VIEW][y_aft];
    	}
    	else
    	{
			if(chessUp == 'K' || chessUp == 'P' || chessUp == 'R' || chessUp == 'C') //直線兵種: 帥 兵 車 炮
			{
				movestr += movedir+convert_english_num(Math.abs(x_bef-x_aft));
			}
			else //斜線兵種: 士 相 馬
			{
				movestr += movedir+_chessBoardNumber[RED_NORMAL_VIEW][y_aft];
			}
    	}    	
    }
    else
    {
    	if(movedir == "平")
    	{
    		movestr += movedir+_chessBoardNumber[BLACK_NORMAL_VIEW][y_aft];
    	}
    	else
    	{
    		if(chessUp == 'K' || chessUp == 'P' || chessUp == 'R' || chessUp == 'C') //直線兵種: 帥 兵 車 炮
			{
				movestr += movedir+Math.abs(x_bef-x_aft);
			}
			else //斜線兵種: 士 相 馬
			{
				movestr += movedir+_chessBoardNumber[BLACK_NORMAL_VIEW][y_aft];
			}
    	}  
    }

    console.log(movestr);

    return movestr;
}