from bs4 import BeautifulSoup
from urllib.request import urlopen
import numpy as np
import re

def query_cloud(fen):
    url='http://api.chessdb.cn:81/chessdb.php?action=queryall&board='+fen
    html = urlopen(url).read()
    soup = BeautifulSoup(html, features='lxml')
    mystr = soup.text
    my_list = mystr.split('|')
    new_list = list(filter(lambda x: x.find('??')==-1, my_list))
    #print(*my_list, sep = "\n")
    #print(my_list[0])
    #print(len(new_list))
    return new_list

def query_score(fen):
    html = urlopen("http://api.chessdb.cn:81/chessdb.php?action=queryscore&board="+fen).read()
    soup = BeautifulSoup(html, features='lxml')
    score = soup.text
    #print(score)
    qurey_list = re.split(":", score) 
    if(len(qurey_list)>1):
        return int(qurey_list[1])
    else:
        return -99999

def FEN_to_Board(fen):
    board = [['0' for x in range(9)] for y in range(10)]
    row_list = re.split("/|%", fen)
    for i in range(0, 10):
        index = 0
        for j in range(0, len(row_list[i])):
            char = row_list[i][j]
            val  = ord(char)-ord('0')
            if(val<=9 and val>0):
                index = index + val
            else:
                board[i][index]=char
                index = index + 1
    return board
    
def Board_to_FEN(board):
    fen = ''
    for row in range(0, 10):
        index = 0;
        str_temp=''
        for col in range(0, 9):
            char = board[row][col]
            if char[0] == '0':
                index = index + 1
                if col == 8:
                    str_temp = str_temp + str(index)
            else:
                if index > 0:
                    str_temp = str_temp + str(index)
                    index = 0
                str_temp = str_temp + str(char)
        fen = fen + str_temp
        if row != 9:
            fen = fen +"/"
    return fen

def check_red(str_move):
    if ( str_move.indexOf('一')>0 or str_move.indexOf('二')>0 or str_move.indexOf('三')>0 or
         str_move.indexOf('四')>0 or str_move.indexOf('五')>0 or str_move.indexOf('六')>0 or
         str_move.indexOf('七')>0 or str_move.indexOf('八')>0 or str_move.indexOf('九')>0): 
        return True
    else :
        return False

def convert_front(num):
    front_str = '無'.encode('utf-8')
    if num == 1:
        front_str = '前'.encode('utf-8')
    elif num == -1:
        front_str = '後'.encode('utf-8')

    return front_str
        
    
def get_front(str_move):
    if (str_move.find('前')>=0):
        return 1
    elif (str_move.find('後')>=0):
        return -1
    else :
        return 0

def convert_direction(num):
    dir_str = '無'.encode('utf-8')
    if num == 1:
        dir_str = '進'.encode('utf-8')
    elif num == -1:
        dir_str = '退'.encode('utf-8')
    elif num == 0:
        dir_str = '平'.encode('utf-8')
    
    return dir_str

def get_direction(str_move):
    if (str_move.find('進')>=0):
        return 1
    elif (str_move.find('退')>=0):
        return -1
    else:
        return 0

def get_global_col(board, str_move):
    if get_front(str_move) != 0:
        chess = conver_chinese_chess(str_move)
        for col in range(9):
            for row in range(10):
                if board[row][col] == chess:
                    return col
        return -1
    else:
        if check_red(str_move):
            return 9-convert_chinese_num(str_move[1])
        else:
            return int(str_move[1])-1

def convert_english_num(num):
    #print('convert_english_num', num)
    if num == 1:
        return '一'.encode('utf-8')
    elif num == 2:
        return '二'.encode('utf-8')
    elif num == 3:
        return '三'.encode('utf-8')
    elif num == 4:
        return '四'.encode('utf-8')
    elif num == 5:
        return '五'.encode('utf-8')
    elif num == 6:
        return '六'.encode('utf-8')
    elif num == 7:
        return '七'.encode('utf-8')
    elif num == 8:
        return '八'.encode('utf-8')
    elif num == 9:
        return '九'.encode('utf-8')
    else:
        return '零'.encode('utf-8')
        
def convert_chinese_num(str_num):
    if(str_num == '一'):
        return 1
    elif (str_num == '二'):
        return 2
    elif (str_num == '三'):
        return 3
    elif (str_num == '四'):
        return 4
    elif (str_num == '五'):
        return 5
    elif (str_num == '六'):
        return 6
    elif (str_num == '七'):
        return 7
    elif (str_num == '八'):
        return 8
    elif (str_num == '九'):
        return 9
    else:
        return -1

def conver_english_chess(chess):
    chinese=''
    if chess == 'K':
        chinese = '帥'.encode('utf-8')
    elif chess == 'k':
        chinese ='將'.encode('utf-8')
    elif chess == 'A':
        chinese ='仕'.encode('utf-8')
    elif chess == 'a':
        chinese ='士'.encode('utf-8')
    elif chess == 'B':
        chinese ='相'.encode('utf-8')
    elif chess == 'b':
        chinese ='象'.encode('utf-8')
    elif chess == 'R' or chess == 'r':
        chinese ='車'.encode('utf-8')
    elif chess == 'N' or chess == 'n':
        chinese ='馬'.encode('utf-8')
    elif chess == 'C' or chess == 'c':
        chinese ='炮'.encode('utf-8')
    elif chess == 'P':
        chinese ='兵'.encode('utf-8')
    elif chess == 'p':
        chinese ='卒'.encode('utf-8')
    #print(chinese)
    return chinese
    
def conver_chinese_chess(str_move):
    is_red = check_red(str_move)
        
    if(str_move.find('帥')>=0):
        return 'K'
    elif (str_move.find('將')>=0):
        return 'k'
    elif (str_move.find('仕')>=0):
        return 'A'
    elif (str_move.find('士')>=0):
        return 'a'
    elif (str_move.find('相')>=0):
        return 'B'
    elif (str_move.find('象')>=0):
        return 'b'
    elif (str_move.find('車')>=0):
        if is_red:
            return 'R'
        else:
            return 'r'
    elif (str_move.find('馬')>=0):
        if is_red:
            return 'N'
        else:
            return 'n'
    elif (str_move.find('炮')>=0):
        if is_red:
            return 'C'
        else:
            return 'c'
    elif (str_move.find('兵')>=0):
        return 'P'
    elif (str_move.find('卒')>=0):
        return 'p'
    else:
        return '0'
    
def check_pos(fen, row, col, is_red):
    board  = FEN_to_Board(fen)
    if row < 0 or row > 9 or col < 1 or col > 9:
        return -1
    else:
        if is_red:
            chess = board[9-row][9-col] 
        else:
            chess = board[row][col-1]
          
        if chess == '0' or chess == 0 : 
            return 0
        else:
            is_red_in_target = not chess.islower()

            if(is_red == is_red_in_target):
                return 1
            else:
                return 2

def check_global_pos(fen, row, col, is_red):
    board  = FEN_to_Board(fen)
    if row < 0 or row > 9 or col < 1 or col > 9:
        return -1
    chess = board[row][col]
    if chess =='0':
        return 0
    else:
        is_red_2 = not chess.islower()
        if is_red == is_red_2:
            return 1
        else:
            return 2
            
def get_move_text(fen, move_pos):
    move_text=''
    board = FEN_to_Board(fen)
    global_row_before = 9-int(move_pos[1])
    global_col_before = int(ord(move_pos[0])-ord('a'))
    global_row_after  = 9-int(move_pos[3])
    global_col_after  = int(ord(move_pos[2])-ord('a'))
    row_diff          = global_row_after - global_row_before
    col_diff          = global_col_after - global_col_before
    
    chess   = board[global_row_before][global_col_before]
    l_chess = chess.lower()
    is_red  = not chess.islower()  

    num = 0
    row_list=[]
    for i in range(10):
        if board[i][global_col_before] == chess:
            num = num+1
            row_list.append(i)
    
    is_mul = num > 1
    diff = 0
    if global_row_before == global_row_after:
        direction = 0 #平
    elif global_row_before > global_row_after:
        if is_red:
            direction = 1 #進
        else:
            direction = -1 #退
    else:
        if is_red:
            direction = -1 #退
        else:
            direction = 1 #進
                    
    diff = abs(global_row_before - global_row_after)
    pos_ind = 0
    second_val = 0
    is_mul_valid = False
    is_first = False
    is_vertical = abs(row_diff) > abs(col_diff)
    
    if is_mul and (l_chess == 'p' or l_chess == 'c' or l_chess == 'r' or l_chess == 'n') : #check the other chess has valid move or not
        for i in range(len(row_list)):
            if row_list[i] != global_row_before: 
                pos_result = check_global_pos(fen, row_list[i] + global_row_after -global_row_before, global_col_after, is_red)         
                if pos_result == 0 or pos_result == 2:
                    if l_chess == 'p': #兵
                        is_mul_valid = True
                    elif l_chess == 'c': #炮
                        num = 0
                        if pos_result == 0: #no chess between
                            if is_vertical:
                                for i in range(min(global_row_before, global_row_after)+1, max(global_row_before, global_row_after)):
                                    if check_global_pos(fen, i, global_col_before, is_red) > 0:
                                        num = num + 1
                                if num == 0:
                                    is_mul_valid = True
                            else:
                                for i in range(min(global_col_before, global_col_after)+1, max(global_col_before, global_col_after)):
                                    if check_global_pos(fen, global_row_before, i, is_red) > 0:
                                        num = num + 1
                                if num == 0:
                                    is_mul_valid = True         
                        else: #just one chess
                            if is_vertical:
                                for i in range(min(global_row_before, global_row_after)+1, max(global_row_before, global_row_after)):
                                    if check_global_pos(fen, i, global_col_before, is_red) > 0:
                                        num = num + 1
                                if num == 1:
                                    is_mul_valid = True
                            else:
                                for i in range(min(global_col_before, global_col_after)+1, max(global_col_before, global_col_after)):
                                    if check_global_pos(fen, global_row_before, i, is_red) > 0:
                                        num = num + 1
                                if num == 1:
                                    is_mul_valid = True         
                    elif l_chess == 'r': #車, no chess between
                        num = 0
                        if is_vertical:
                            for i in range(min(global_row_before, global_row_after)+1, max(global_row_before, global_row_after)):
                                  if check_global_pos(fen, i, global_col_before, is_red) > 0:
                                    num = num + 1
                            if num == 0:
                                is_mul_valid = True
                        else:
                            for i in range(min(global_col_before, global_col_after)+1, max(global_col_before, global_col_after)):
                                if check_global_pos(fen, global_row_before, i, is_red) > 0:
                                    num = num + 1
                            if num == 0:
                                is_mul_valid = True                           
                    elif l_chess == 'n': #馬, no constrain
                        if is_vertical:
                            if check_global_pos(fen, int((global_row_before + global_row_after)/2), global_col_before, is_red) == 0 :
                                is_mul_valid = True
                        else:
                            if check_global_pos(fen, global_col_before, int((global_col_before + global_col_after)/2), is_red) == 0 :
                                is_mul_valid = True
                     
    if is_mul_valid:
        if row_list[0] == global_row_before: #the target chess is the first element of the chess list
            pos_ind = 1 if is_red else -1
        else:
            pos_ind = -1 if is_red else 1
                
    if pos_ind == 0: # only one valid chess move in the col, dont need use frnot or rear
        if is_red:
            col_before = convert_english_num(9-global_col_before) 
            col_after  = convert_english_num(9-global_col_after)            
            if chess.lower() == 'p' or chess.lower() == 'c' or chess.lower() == 'r' or chess.lower() == 'k' :
                if direction == 0:
                    second_val = convert_english_num(9-global_col_after)
                else:
                     second_val = convert_english_num(diff)
            else:
                second_val = convert_english_num(9-global_col_after)
            
            move_text = conver_english_chess(chess).decode('utf-8')
            move_text = move_text + col_before.decode('utf-8')
            move_text = move_text + convert_direction(direction).decode('utf-8')
            move_text = move_text + second_val.decode('utf-8')
        else:
            col_before = global_col_before+1
            col_after  = global_col_after+1
            if chess.lower() == 'p' or chess.lower() == 'c' or chess.lower() == 'r' or chess.lower() == 'k' :
                if direction == 0:
                    second_val = col_after
                else:
                    second_val = diff
            else:
                second_val = col_after
        
            move_text = conver_english_chess(chess).decode('utf-8')
            move_text = move_text + str(col_before)
            move_text = move_text + convert_direction(direction).decode('utf-8')
            move_text = move_text + str(second_val)
    else:
        move_text = convert_front(pos_ind).decode('utf-8')
        move_text = move_text + conver_english_chess(chess).decode('utf-8')
        if is_red:
            col_before = convert_english_num(9-global_col_before) 
            col_after  = convert_english_num(9-global_col_after)            
            if chess.lower() == 'p' or chess.lower() == 'c' or chess.lower() == 'r' or chess.lower() == 'k' :
                if direction == 0:
                    second_val = convert_english_num(9-global_col_after)
                else:
                     second_val = convert_english_num(diff)
            else:
                second_val = convert_english_num(9-global_col_after)
            
            move_text = convert_front(pos_ind).decode('utf-8')
            move_text = move_text + conver_english_chess(chess).decode('utf-8')
            move_text = move_text + convert_direction(direction).decode('utf-8')
            move_text = move_text + second_val.decode('utf-8')
        else:
            col_before = global_col_before+1
            col_after  = global_col_after+1
            if chess.lower() == 'p' or chess.lower() == 'c' or chess.lower() == 'r' or chess.lower() == 'k' :
                if direction == 0:
                    second_val = col_after
                else:
                    second_val = diff
            else:
                second_val = col_after
        
            move_text = convert_front(pos_ind).decode('utf-8')
            move_text = move_text + conver_english_chess(chess).decode('utf-8')
            move_text = move_text + convert_direction(direction).decode('utf-8')
            move_text = move_text + str(second_val)
            
        #print(move_text)
        #print(conver_english_chess(chess).decode('utf-8'))
        #print(int(col_before))
        #print(convert_direction(direction).decode('utf-8'))
        #print(int(second_val))
        
    #else:
    #    if pos_ind > 0:
    #        move_text = conver_english_chess(chess)　
    #    else:
    #        move_text = conver_english_chess(chess)　
    
    #print(global_row_before, global_col_before, global_row_after, global_col_after, chess, direction, is_mul)
    #print(move_text.decode('utf-8'))
    return move_text
            
def apply_move(fen, chess_pos, str_move):
    is_red_turn = '%20w' in fen
    board   = FEN_to_Board(fen)
    is_red  = check_red(str_move)
    chess   = conver_chinese_chess(str_move)
    l_chess = chess.lower()
    row     = chess_pos[0]
    col     = chess_pos[1]
    if is_red:
        val = convert_chinese_num(str_move[3])
    else:
        val = int(str_move[3])
    front   = get_front(str_move)
    move    = get_direction(str_move)
    
    end_row = row
    end_col = col
    
    if move == 0: #平
        if l_chess == 'k': #帥
            if check_pos(fen, row, val, is_red) != 1: 
                end_col = val  
            else:
                return False, fen # this means that the position already exists a chess belong to same color
        elif l_chess == 'p': #兵
            if check_pos(fen, row, val, is_red) != 1: 
                if row <= 4:
                    return False, fen # this means pawn can't move before cross river
                else:
                    end_col = val  
            else:
                return False, fen # this means that the position already exists a chess belong to same color
        elif l_chess == 'r': #車
            if val > col:
                for j in range(col+1, val):
                    if check_pos(fen, row, j, is_red) != 0: 
                        return False, fen
            else:
                for j in range(col-1, val, -1):
                    if check_pos(fen, row, j, is_red) != 0: 
                        return False, fen
            if check_pos(fen, row, val, is_red) == 1: 
                return False, fen
        elif l_chess == 'c': #炮
            if check_pos(fen, row, val, is_red) == 0: # no chess between
                if val > col:
                    for j in range(col+1, val):
                        if check_pos(fen, row, j, is_red) != 0:
                            return False, fen
                else:
                    for j in range(col-1, val, -1):
                        if check_pos(fen, row, j, is_red) != 0:
                            return False, fen
            elif check_pos(fen, row, val, is_red) == 2: # 1 chess between
                num = 0
                if val > col:
                    for j in range(col+1, val):
                        if check_pos(fen, row, j, is_red) != 0:
                            num = num + 1
                else:
                    for j in range(col-1, val, -1):
                        if check_pos(fen, row, j, is_red) != 0:
                            num = num + 1
                if num != 1:
                    return False, fen
            else:
                return False, fen   
        end_col = val
    else : #進 or 退
        p_val = val*move
        if l_chess == 'p' or l_chess == 'k': #兵, 帥
            if check_pos(fen, row+p_val, col, is_red) == 0 or check_pos(fen, row+p_val, col, is_red) == 2: 
                end_row = row+p_val  
            else:
                return False, fen # this means that the position already exists a chess belong to same color
        elif l_chess == 'r': #車
            if move > 0:
                for i in range(1*move, p_val):
                    if check_pos(fen, row+i, col, is_red) != 0: 
                        return False, fen
            else:
                for i in range(1*move, p_val, -1):
                    if check_pos(fen, row+i, col, is_red) != 0: 
                        return False, fen
            if check_pos(fen, row+p_val, col, is_red) == 1 or check_pos(fen, row+p_val, col, is_red) < 0: 
                return False, fen
            end_row = row+p_val
        elif l_chess == 'c': #炮
            if check_pos(fen, row+p_val, col, is_red) == 0: # no chess between
                if move > 0:
                    for i in range(1*move, p_val):
                        if check_pos(fen, row+p_val, col, is_red) != 0:
                            return False, fen
                else:
                    for i in range(1*move, p_val, -1):
                        if check_pos(fen, row+p_val, col, is_red) != 0:
                            return False, fen
            elif check_pos(fen, row+p_val, col, is_red) == 2: # 1 chess between
                num = 0
                if move > 0:
                    for j in range(1*move, p_val):
                        if check_pos(fen, row+j, col, is_red) > 0:
                            num = num + 1
                else:
                    for j in range(1*move, p_val, -1):
                        if check_pos(fen, row+j, col, is_red) > 0:
                            num = num + 1
                if num != 1:
                    return False, fen
            else:
                return False, fen
            end_row = row + p_val
        elif l_chess == 'a': #士
            if row == 2 and p_val > 0 :
                return False, fen
            elif row == 0 and p_val < 0 :   
                return False, fen
            else:
                if p_val > 0:    
                    end_row = end_row + 1
                else:
                    end_row = end_row - 1
                end_col = abs(val)
        elif l_chess == 'b': #象
            if row == 0 and p_val < 0 :
                return False, fen
            elif row == 4 and p_val > 0 :
                return False, fen
            else:
                if val > 0:
                    end_row = end_row + 2
                else:
                    end_row = end_row - 2
                end_col = abs(val)  
        elif l_chess == 'n': #馬
            diff = abs(val - col)
            
            if diff == 1:
                if p_val > 0 : # row+2
                    if check_pos(fen, row+2, val, is_red) < 0 or check_pos(fen, row+2, val, is_red) == 1:
                        return False, fen
                    elif check_pos(fen, row+1, col, is_red) != 0:
                        return False, fen
                    end_row = row + 2 
                else:
                    if check_pos(fen, row-2, val, is_red) < 0 or check_pos(fen, row-2, val, is_red) == 1:
                        return False, fen
                    elif check_pos(fen, row-1, col, is_red) != 0:
                        return False, fen
                    end_row = row - 2 
                end_col = val
            elif diff == 2:
                if p_val > 0 : # row+1
                    if check_pos(fen, row+1, val, is_red) < 0 or check_pos(fen, row+1, val, is_red) == 1:
                        return False, fen
                    elif check_pos(fen, row, int((val+col)/2), is_red) != 0:
                        return False, fen
                    end_row = row+1 
                else:
                    if check_pos(fen, row-1, val, is_red) < 0 or check_pos(fen, row-1, val, is_red) == 1:
                        return False, fen
                    elif check_pos(fen, row, int((val+col)/2), is_red) != 0:
                        return False, fen
                    end_row = row-1
                end_col = val
            else:
                return False, fen 
    
    if is_red:
        board[9-row][9-col] = '0' 
        board[9-end_row][9-end_col] = chess 
    else:
        board[row][col-1] = '0'
        board[end_row][end_col-1] = chess 
    fen = Board_to_FEN(board)
    if is_red_turn:
        fen = fen+'%20b'
    else:
        fen = fen+'%20w'
    return True, fen 
    
def Update_FEN(fen, str_move):
    board       = FEN_to_Board(fen)
    is_red      = check_red(str_move)
    chess       = conver_chinese_chess(str_move)
    global_col  = get_global_col(board, str_move)
    val         = convert_chinese_num(str_move[3])
    front       = get_front(str_move)
    move        = get_direction(str_move)
    
    row_in_col = [i for i,x in enumerate( board[:][global_col]) if x==chess]
    index_list=[]
    for i in range(10):
        if board[i][global_col]==chess:
            index_list.append(i)
    is_mul = len(index_list) > 1
    
    if front != 0:
        if (front == 1 and is_red) or (front == -1 and not is_red):
            global_row = index_list[0] 
        elif (front == 1 and not is_red) or (front == -1 and is_red):
            global_row = index_list[1]
        if is_red:
            row = 9-global_row
            col = 9-global_col
        else:
            row = global_row
            col = global_col+1
        result, new_fen = apply_move(fen, [row, col], str_move)
        if result:
            return new_fen 
    else:
        for j in range(len(index_list)):
            global_row = index_list[j]
            if is_red:
                row = 9-global_row
                col = 9-global_col
            else:
                row = global_row
                col = global_col+1
            result, new_fen = apply_move(fen, [row, col], str_move)
            if result:
                return new_fen 
    return fen

def parsing_text(chess_manual):
    is_red_turn  = 'w - -' in chess_manual
    part_list = re.split("FEN ：| w - - | b - - |  1. ", chess_manual)
    fen = part_list[1]
    if is_red_turn:
        fen = fen + '%20w'
    else:
        fen = fen + '%20b'
    
    move_list = re.split(" |\n", part_list[3])
    move_list = [x for x in move_list if ('進' in x or '退' in x or '平' in x)]
    return fen, move_list