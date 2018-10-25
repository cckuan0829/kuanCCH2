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

function Board_to_FEN(board)
{
    var fen = ''
    for( var row = 0; row < 10; row++)
	{
        var index = 0;
        var str_temp=''
        for ( var col = 0; col < 9; col++)
		{
            var cha = board[row][col];
            if (cha[0] == '0')
			{
                index = index + 1;
                if (col == 8)
                    str_temp = str_temp + index;
            }
			else
			{
                if (index > 0)
				{
                    str_temp = str_temp + index;
                    index = 0;
				}
                str_temp = str_temp + cha;
			}
		}
        fen = fen + str_temp;
        if (row != 9)
            fen = fen +"/";
	}
    return fen;
}

function FEN_to_Board(fen)
{
    var board = Array(10).fill(0).map(x => Array(9).fill('0'))
    var row_list = fen.split(/\/|%/);

	for( var i = 0; i < 10; i++)
	{
        var index = 0
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
                board[i][index] = cha;
                index = index + 1;
			}
		}
	}
    return board;
}

function check_red(str_move)
{
    if ( str_move.indexOf('一')>0 || str_move.indexOf('二')>0 || str_move.indexOf('三')>0 ||
         str_move.indexOf('四')>0 || str_move.indexOf('五')>0 || str_move.indexOf('六')>0 ||
         str_move.indexOf('七')>0 || str_move.indexOf('八')>0 || str_move.indexOf('九')>0)
        return true;
    else
        return false;

}

function convert_front(num)
{
    var front_str = '無';
    if (num == 1)
        front_str = '前';
    else if (num == -1)
        front_str = '後';

    return front_str;
}
    
function get_front(str_move)
{
    if (str_move.indexOf('前') >= 0)
        return 1;
    else if (str_move.indexOf('後') >= 0 || str_move.indexOf('后') >= 0)
        return -1;
    else
        return 0;
}

function convert_direction(num)
{
    var dir_str = '無';
    if (num == 1)
        dir_str = '進';
    else if (num == -1)
        dir_str = '退';
    else if (num == 0)
        dir_str = '平';
    
    return dir_str;
}

function get_direction(str_move)
{
    if (str_move.indexOf('進')>=0 || str_move.indexOf('进')>=0)
        return 1;
    else if (str_move.indexOf('退')>=0)
        return -1;
    else
        return 0;
}

function get_global_col(board, str_move)
{
    if (get_front(str_move) != 0)
	{
        var chess = conver_chinese_chess(str_move);
        for (var col = 0; col < 9; col++)
		{
            for(var row = 0; row < 10; row++)
			{
                if (board[row][col] == chess)
                    return col;
			}
		}
        return -1;
	}
    else
	{
        if (check_red(str_move))
            return 9-convert_chinese_num(str_move[1]);
        else
		{
			var val = str_move[1].replace(/[\uff01-\uff5e]/g, function(ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xfee0); });
            return parseInt(val-1);
		}
	}
}

function convert_english_num(num)
{
    //print('convert_english_num', num)
    if (num == 1)
        return '一';
    else if (num == 2)
        return '二';
    else if (num == 3)
        return '三';
    else if (num == 4)
        return '四';
    else if (num == 5)
        return '五';
    else if (num == 6)
        return '六';
    else if (num == 7)
        return '七';
    else if (num == 8)
        return '八';
    else if (num == 9)
        return '九';
    else
        return '零';
}
    
function convert_chinese_num(str_num)
{
    if(str_num == '一')
        return 1;
    else if (str_num == '二')
        return 2;
    else if (str_num == '三')
        return 3;
    else if (str_num == '四')
        return 4;
    else if (str_num == '五')
        return 5;
    else if (str_num == '六')
        return 6;
    else if (str_num == '七')
        return 7;
    else if (str_num == '八')
        return 8;
    else if (str_num == '九')
        return 9;
    else
        return -1;
}

function conver_english_chess(chess)
{
    var chinese=''
    if (chess == 'K')
        chinese = '帥';
    else if (chess == 'k')
        chinese ='將';
    else if (chess == 'A')
        chinese ='仕';
    else if (chess == 'a')
        chinese ='士';
    else if (chess == 'B')
        chinese ='相';
    else if (chess == 'b')
        chinese ='象';
    else if (chess == 'R' || chess == 'r')
        chinese ='車';
	else if (chess == 'N' || chess == 'n')
        chinese ='馬';
    else if (chess == 'C' || chess == 'c')
        chinese ='炮';
    else if (chess == 'P')
        chinese ='兵';
    else if (chess == 'p')
        chinese ='卒';
    //print(chinese)
    return chinese;
}

function conver_chinese_chess(str_move)
{
    var is_red = check_red(str_move);
        
    if(str_move.indexOf('帥')>=0 || str_move.indexOf('帅')>=0)
        return 'K';
    else if (str_move.indexOf('將')>=0 || str_move.indexOf('将')>=0)
        return 'k';
    else if (str_move.indexOf('仕')>=0)
        return 'A';
    else if (str_move.indexOf('士')>=0)
	{
		if (is_red)
            return 'A';
        else
            return 'a';
	}
    else if (str_move.indexOf('相')>=0)
        return 'B';
    else if (str_move.indexOf('象')>=0)
        return 'b';
    else if (str_move.indexOf('車')>=0 || str_move.indexOf('车')>=0)
	{
        if (is_red)
            return 'R';
        else
            return 'r';
	}
	else if (str_move.indexOf('傌')>=0)
	{
		return 'N';
	}
    else if (str_move.indexOf('馬')>=0 || str_move.indexOf('马')>=0)
	{
        if (is_red)
            return 'N';
        else
            return 'n';
	}
    else if (str_move.indexOf('炮')>=0 || str_move.indexOf('包')>=0)
	{
        if (is_red)
            return 'C';
        else
            return 'c';
	}
    else if (str_move.indexOf('兵')>=0)
        return 'P';
    else if (str_move.indexOf('卒')>=0)
        return 'p';
    else
        return '0';
}

function check_pos(fen, row, col, is_red)
{
    var board  = FEN_to_Board(fen);
    if (row < 0 || row > 9 || col < 1 || col > 9 || Number.isNaN(row) || Number.isNaN(col))
        return -1;
    else
	{
        if (is_red)
            chess = board[9-row][9-col]; 
        else
            chess = board[row][col-1];
          
        if (chess == '0' || chess == 0)
            return 0;
        else
		{
            is_red_in_target = (chess == chess.toUpperCase());

            if(is_red == is_red_in_target)
                return 1;
            else
                return 2;
		}
	}
}

function check_global_pos(fen, row, col, is_red)
{
    var board  = FEN_to_Board(fen);
    if (row < 0 || row > 9 || col < 1 || col > 9)
        return -1;
    var chess = board[row][col];
    if (chess == '0')
        return 0;
    else
	{
        is_red_2 = (chess == chess.toUpperCase());
        if (is_red == is_red_2)
            return 1;
        else
            return 2;
	}
}

function get_move_text(fen, move_pos)
{
    var move_text = '';
    var board = FEN_to_Board(fen);
    var global_row_before = 9-parseInt(move_pos[1]);
    var global_col_before = move_pos[0].charCodeAt(0)-'a'.charCodeAt(0);
    var global_row_after  = 9-parseInt(move_pos[3]);
    var global_col_after  = move_pos[2].charCodeAt(0)-'a'.charCodeAt(0);
	var col_before        = 0; 
    var col_after         = 0;
    var row_diff          = global_row_after - global_row_before;
    var col_diff          = global_col_after - global_col_before;
    var directioin        = 0;    
    var chess   = board[global_row_before][global_col_before];
    var l_chess = chess.toLowerCase();
    var is_red  = (chess == chess.toUpperCase());

    var num = 0;
    var row_list=[];
    for ( var i = 0; i < 10; i++ )
	{
        if (board[i][global_col_before] == chess)
		{
            num = num+1;
            row_list.push(i);
		}
    }
	
    var is_mul = (num > 1);
    var diff = 0;
    if (global_row_before == global_row_after)
        direction = 0; //平
    else if (global_row_before > global_row_after)
	{
        if (is_red)
            direction = 1; //進
        else
            direction = -1; //退
	}
    else
	{
        if (is_red)
            direction = -1; //退
        else
            direction = 1; //進
	}
	
    diff = Math.abs(global_row_before - global_row_after);
    var pos_ind = 0;
    var second_val = 0;
    var is_mul_valid = false;
    var is_first = false;
    var is_vertical = Math.abs(row_diff) > Math.abs(col_diff);
    
    if (is_mul && (l_chess == 'p' || l_chess == 'c' || l_chess == 'r' || l_chess == 'n') ) //check the other chess has valid move or not
	{
        for( var i = 0; i < row_list.length; i++)
		{
            if (row_list[i] != global_row_before)
			{
                var pos_result = check_global_pos(fen, row_list[i] + global_row_after - global_row_before, global_col_after, is_red);         
                if (pos_result == 0 || pos_result == 2)
				{
                    if (l_chess == 'p') //兵
                        is_mul_valid = true;
                    else if (l_chess == 'c') //炮
					{
                        num = 0;
                        if (pos_result == 0) //no chess between
						{
                            if (is_vertical)
							{
                                for( var i = Math.min(global_row_before, global_row_after)+1; i < Math.max(global_row_before, global_row_after); i++)
                                {
									if (check_global_pos(fen, i, global_col_before, is_red) > 0)
                                        num = num + 1;
								}
                                if (num == 0)
                                    is_mul_valid = true;
							}
                            else
							{
                                for( var i = Math.min(global_col_before, global_col_after)+1; i < Math.max(global_col_before, global_col_after); i++)
                                {
									if (check_global_pos(fen, global_row_before, i, is_red) > 0)
                                        num = num + 1;
								}
                                if (num == 0)
                                    is_mul_valid = true; 
							}
						}							
                        else //just one chess
						{
                            if (is_vertical)
							{
                                for( var i = Math.min(global_row_before, global_row_after)+1; i < Math.max(global_row_before, global_row_after); i++)
								{
                                    if (check_global_pos(fen, i, global_col_before, is_red) > 0)
                                        num = num + 1;
								}
                                if (num == 1)
                                    is_mul_valid = true;
							}
                            else
							{
                                for( var i = Math.min(global_col_before, global_col_after)+1; i < Math.max(global_col_before, global_col_after); i++)
								{
                                    if (check_global_pos(fen, global_row_before, i, is_red) > 0)
                                        num = num + 1;
								}
                                if (num == 1)
                                    is_mul_valid = true;
							}									
						}
					}									
                    else if (l_chess == 'r') //車, no chess between
					{
                        num = 0;
                        if (is_vertical)
						{
                            for( var i = Math.min(global_row_before, global_row_after)+1; i < Math.max(global_row_before, global_row_after); i++)
							{
                                if (check_global_pos(fen, i, global_col_before, is_red) > 0)
                                    num = num + 1;
							}
                            if (num == 0)
                                is_mul_valid = true;
						}
                        else
						{
                            for( var i = Math.min(global_col_before, global_col_after)+1; i < Math.max(global_col_before, global_col_after); i++)
							{
                                if (check_global_pos(fen, global_row_before, i, is_red) > 0)
                                    num = num + 1;
							}
                            if (num == 0)
                                is_mul_valid = true;  
						}								
					}								
                    else if (l_chess == 'n') //馬, no constrain
					{
                        if (is_vertical)
						{
                            if (check_global_pos(fen, parseInt((global_row_before + global_row_after)/2), global_col_before, is_red) == 0)
                                is_mul_valid = true;
						}
                        else
						{
                            if (check_global_pos(fen, global_col_before, parseInt((global_col_before + global_col_after)/2), is_red) == 0)
                                is_mul_valid = true;
						}
					}
				}				
			}
		}
    }                 
    if (is_mul_valid)
	{
        if (row_list[0] == global_row_before) //the target chess is the first element of the chess list
            pos_ind = is_red ? 1 : -1;
        else
            pos_ind = is_red ? -1 : 1;
	}

    if (pos_ind == 0) // only one valid chess move in the col, dont need use frnot or rear
	{
        if (is_red)
		{
            col_before = convert_english_num(9-global_col_before); 
            col_after  = convert_english_num(9-global_col_after);          
            if (chess.toLowerCase() == 'p' || chess.toLowerCase() == 'c' || chess.toLowerCase() == 'r' || chess.toLowerCase() == 'k' )
			{
                if (direction == 0)
                    second_val = convert_english_num(9-global_col_after);
                else
                    second_val = convert_english_num(diff);
			}
            else
                second_val = convert_english_num(9-global_col_after);
            
            move_text = conver_english_chess(chess);
            move_text = move_text + col_before;
            move_text = move_text + convert_direction(direction);
            move_text = move_text + second_val;
		}
        else
		{
            col_before = global_col_before+1;
            col_after  = global_col_after+1;
            if (chess.toLowerCase() == 'p' || chess.toLowerCase() == 'c' || chess.toLowerCase() == 'r' || chess.toLowerCase() == 'k' )
			{
                if (direction == 0)
                    second_val = col_after;
                else
                    second_val = diff;
			}
            else
                second_val = col_after;
            
			var f_col_before = col_before.toString()[0].replace(/[A-Za-z0-9]/g, function(s) {return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);});
			var f_second_val = second_val.toString()[0].replace(/[A-Za-z0-9]/g, function(s) {return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);});
			
            move_text = conver_english_chess(chess);
            move_text = move_text + f_col_before;
            move_text = move_text + convert_direction(direction);
            move_text = move_text + f_second_val;
		}
	}
    else
	{
        move_text = convert_front(pos_ind);
        move_text = move_text + conver_english_chess(chess);
        if (is_red)
		{
            col_before = convert_english_num(9-global_col_before); 
            col_after  = convert_english_num(9-global_col_after);            
            if (chess.toLowerCase() == 'p' || chess.toLowerCase() == 'c' || chess.toLowerCase() == 'r' || chess.toLowerCase() == 'k' )
			{
                if (direction == 0)
                    second_val = convert_english_num(9-global_col_after);
                else
                    second_val = convert_english_num(diff);
			}
            else
                second_val = convert_english_num(9-global_col_after);
            
            move_text = convert_front(pos_ind);
            move_text = move_text + conver_english_chess(chess);
            move_text = move_text + convert_direction(direction);
            move_text = move_text + second_val;
		}
        else
		{
            col_before = global_col_before+1;
            col_after  = global_col_after+1;
            if (chess.toLowerCase() == 'p' || chess.toLowerCase() == 'c' || chess.toLowerCase() == 'r' || chess.toLowerCase() == 'k')
			{
                if (direction == 0)
                    second_val = col_after;
                else
                    second_val = diff;
			}
            else
                second_val = col_after;
            
			var f_second_val = second_val.toString()[0].replace(/[A-Za-z0-9]/g, function(s) {return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);});
		   
            move_text = convert_front(pos_ind);
            move_text = move_text + conver_english_chess(chess);
            move_text = move_text + convert_direction(direction);
            move_text = move_text + f_second_val;
		}
            
    }    

    return move_text;
}
 
function apply_move(fen, chess_pos, str_move)
{
    var is_red_turn = (fen.indexOf('%20w') >= 0);
    var board   = FEN_to_Board(fen);
    var is_red  = check_red(str_move);
    var chess   = conver_chinese_chess(str_move);
    var l_chess = chess.toLowerCase();
    var row     = chess_pos[0];
    var col     = chess_pos[1];
	var val     = 0;
	var val_temp = str_move[3].replace(/[\uff01-\uff5e]/g, function(ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xfee0); });
	
    if (is_red)
        val = convert_chinese_num(val_temp);
    else
        val = parseInt(val_temp);
		
    var front   = get_front(str_move);
    var move    = get_direction(str_move);
    
    var end_row = row;
    var end_col = col;
    
    if (move == 0) //平
	{
        if (l_chess == 'k') //帥
		{
            if (check_pos(fen, row, val, is_red) != 1) 
                end_col = val;  
            else
                return [false, fen]; // this means that the position already exists a chess belong to same color
        }
		else if (l_chess == 'p') //兵
		{
            if (check_pos(fen, row, val, is_red) != 1) 
			{
                if (row <= 4)
                    return [false, fen]; // this means pawn can't move before cross river
                else
                    end_col = val;  
			}
            else
                return [false, fen]; // this means that the position already exists a chess belong to same color
		}
        else if (l_chess == 'r') //車
		{
            if (val > col)
			{
                for (var j = col+1; j < val; j++)
				{
                    if (check_pos(fen, row, j, is_red) != 0)
                        return [false, fen];
				}
			}
            else
			{
                for (var j = col-1; j > val; j--)
				{
                    if (check_pos(fen, row, j, is_red) != 0)
                        return [false, fen];
				}
			}
            if (check_pos(fen, row, val, is_red) == 1)
                return [false, fen];
		}
        else if (l_chess == 'c') //炮
		{
            if (check_pos(fen, row, val, is_red) == 0) // no chess between
			{
                if (val > col)
				{
                    for(var j = col+1; j < val; j++)
					{
                        if (check_pos(fen, row, j, is_red) != 0)
                            return [false, fen];
					}
				}
                else
				{
                    for (var j = col-1; j > val; j--)
					{
                        if (check_pos(fen, row, j, is_red) != 0)
                            return [false, fen];
					}
				}
			}
            else if (check_pos(fen, row, val, is_red) == 2) // 1 chess between
			{
                num = 0;
                if (val > col)
				{
                    for (var j = col+1; j < val; j++)
					{
                        if (check_pos(fen, row, j, is_red) != 0)
                            num = num + 1;
					}
				}
                else
				{
                    for (var j = col-1; j > val; j--)
					{
                        if (check_pos(fen, row, j, is_red) != 0)
                            num = num + 1;
					}
				}
                if (num != 1)
                    return [false, fen];
			}
            else
			{
                return [false, fen];  
			}
		}				
        end_col = val;
	}
    else  //進 or 退
	{
        var p_val = val * move;
        if (l_chess == 'p' || l_chess == 'k') //兵, 帥
		{
            if (check_pos(fen, row+p_val, col, is_red) == 0 || check_pos(fen, row+p_val, col, is_red) == 2)
                end_row = row + p_val; 
            else
                return [false, fen]; // this means that the position already exists a chess belong to same color
		}
        else if (l_chess == 'r') //車
		{
            if (move > 0)
			{
                for (var i = move; i < p_val; i++)
				{
                    if (check_pos(fen, row+i, col, is_red) != 0)
                        return [false, fen];
				}
			}
            else
			{
                for (var i = move; i > p_val; i--)
				{
                    if (check_pos(fen, row+i, col, is_red) != 0) 
                        return [false, fen];
				}
			}
            if (check_pos(fen, row+p_val, col, is_red) == 1 || check_pos(fen, row+p_val, col, is_red) < 0)
                return [false, fen];
            end_row = row + p_val;
		}
        else if (l_chess == 'c') //炮
		{
            if (check_pos(fen, row+p_val, col, is_red) == 0) // no chess between
			{
                if (move > 0)
				{
                    for (var i = move; i < p_val; i++)
					{
                        if (check_pos(fen, row+i, col, is_red) != 0)
                            return [false, fen];
					}
				}
                else
				{
                    for (var i = move; i > p_val; i--)
					{
                        if (check_pos(fen, row+i, col, is_red) != 0)
                            return [false, fen];
					}
				}
            }
			else if (check_pos(fen, row+p_val, col, is_red) == 2) // 1 chess between
			{
                num = 0;
                if (move > 0)
				{
                    for (var j = move; j < p_val; j++)
					{
                        if (check_pos(fen, row+j, col, is_red) > 0)
                            num = num + 1;
					}
				}
                else
				{
                    for (var i = move; i > p_val; i--)
					{
                        if (check_pos(fen, row+i, col, is_red) > 0)
                            num = num + 1;
					}
				}
                if (num != 1)
                    return [false, fen];
            }
			else
                return [false, fen];
            end_row = row + p_val;
		}
        else if (l_chess == 'a') //士
		{
            if (row == 2 && p_val > 0)
                return [false, fen];
            else if (row == 0 && p_val < 0)   
                return [false, fen];
            else
			{
                if (p_val > 0)    
                    end_row = row + 1;
                else
                    end_row = row - 1;
                end_col = Math.abs(val);
			}
		}
        else if (l_chess == 'b') //象
		{
            if (row == 0 && p_val < 0)
                return [false, fen];
            else if (row == 4 && p_val > 0)
                return [false, fen];
            else
			{
                if (p_val > 0)
                    end_row = row + 2;
                else
                    end_row = row - 2;
                end_col = Math.abs(val);
			}
		}
        else if (l_chess == 'n') //馬
		{
            var diff = Math.abs(val - col);
            
            if (diff == 1)
			{
                if (p_val > 0) // row+2
				{
                    if (check_pos(fen, row+2, val, is_red) < 0 || check_pos(fen, row+2, val, is_red) == 1)
                        return [false, fen];
                    else if (check_pos(fen, row+1, col, is_red) != 0)
                        return [false, fen];
                    end_row = row + 2;
				}					
                else
				{
                    if (check_pos(fen, row-2, val, is_red) < 0 || check_pos(fen, row-2, val, is_red) == 1)
                        return [false, fen];
                    else if (check_pos(fen, row-1, col, is_red) != 0)
                        return [false, fen];
                    end_row = row - 2; 
				}
                end_col = val;
			}
            else if (diff == 2)
			{
                if (p_val > 0) // row+1
				{
                    if (check_pos(fen, row+1, val, is_red) < 0 || check_pos(fen, row+1, val, is_red) == 1)
                        return [false, fen];
                    else if (check_pos(fen, row, parseInt((val+col)/2), is_red) != 0)
                        return [false, fen];
                    end_row = row+1; 
				}
                else
				{
                    if (check_pos(fen, row-1, val, is_red) < 0 || check_pos(fen, row-1, val, is_red) == 1)
                        return [false, fen];
                    else if (check_pos(fen, row, parseInt((val+col)/2), is_red) != 0)
                        return [false, fen];
                    end_row = row-1;
				}
                end_col = val;
			}
            else
                return [false, fen]; 
		}
    }
	
    if (is_red)
	{
        board[9-row][9-col] = '0';
        board[9-end_row][9-end_col] = chess;
	}		
    else
	{
        board[row][col-1] = '0';
        board[end_row][end_col-1] = chess;
	}
	
    fen = Board_to_FEN(board);
	
    if (is_red_turn)
        fen = fen+'%20b';
    else
        fen = fen+'%20w';
	
    return [true, fen]; 
}

function Update_FEN(fen, str_move)
{
    var board       = FEN_to_Board(fen);
    var is_red      = check_red(str_move);
    var chess       = conver_chinese_chess(str_move);
    var global_col  = get_global_col(board, str_move);
    var global_row  = 0;
	var val         = convert_chinese_num(str_move[3]);
    var front       = get_front(str_move);
    var move        = get_direction(str_move);
    var index_list  = [];
	var row         = 0;
	var col         = 0;
    for (var i = 0; i < 10; i++)
	{
        if (board[i][global_col] == chess)
            index_list.push(i);
	}
    var is_mul = (index_list.length > 1);
    
    if (front != 0)
	{
        if ((front == 1 && is_red) || (front == -1 && !is_red))
            global_row = index_list[0]; 
        else if ((front == 1 && !is_red) || (front == -1 && is_red))
            global_row = index_list[1];
        if (is_red)
		{
            row = 9-global_row;
            col = 9-global_col;
		}
        else
		{
            row = global_row;
            col = global_col+1;
		}
		
		var return_list = apply_move(fen, [row, col], str_move);
        var result      = return_list[0];
		var new_fen     = return_list[1]; 
        
		if (result)
            return new_fen;
	}			
    else
	{
        for (var j = 0; j < index_list.length; j++)
		{
            global_row = index_list[j];
            if (is_red)
			{
                row = 9-global_row;
                col = 9-global_col;
			}
            else
			{
                row = global_row;
                col = global_col+1;
			}
            
			var return_list = apply_move(fen, [row, col], str_move);
			var result      = return_list[0];
			var new_fen     = return_list[1]; 
        
			if (result)
				return new_fen;
		}
	}				
    return fen;
}

function parsing_text(chess_manual)
{
    var is_red_turn  = (chess_manual.indexOf('w - -') >= 0);
	var fen          = 'none';
	var result       = [];
	
	if (chess_manual.indexOf('FEN') < 0 ) 
	{
		fen = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR%20w';
		var move_list = chess_manual.split(/ |\n|\.|\*m|\*|\u3000/);
		result = move_list.filter(move => (move.indexOf('進') >= 0 || move.indexOf('进') >= 0 || move.indexOf('退') >= 0 || move.indexOf('平') >= 0) && move.length == 4);
	}
	else
	{	
		var part_list = chess_manual.split(/FEN ：| w - -| b - -| 1\.|\n1\.|\*m|\*|\u3000/);
		if (part_list.length > 3)
		{
			fen = part_list[1];
			if (is_red_turn)
				fen = fen + '%20w';
			else
				fen = fen + '%20b';
    
			var move_list = part_list[3].split(/ |\n/);
			result  = move_list.filter(move => (move.indexOf('進') >= 0 || move.indexOf('进') >= 0 || move.indexOf('退') >= 0 || move.indexOf('平') >= 0) && move.length == 4);
		}
	}
    return [fen, result];
}

function check_text_valid(chess_text)
{
	var list      = parsing_text(chess_text);
	var fen       = list[0];
	var move_list = list[1];
	if (fen == 'none' || move_list.length == 0)
		return [false, 0];
	else
		return [true, move_list.length];
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
