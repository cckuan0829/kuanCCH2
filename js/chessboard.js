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

