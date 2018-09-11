var url = 'https://api.chessdb.cn:81/chessdb.php?action=queryall&board=rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR%20w';
var data = httpGet(url);
var queryBtn = document.getElementById("queryBtn");
queryBtn.addEventListener("click", showResult);


function showResult(){
    document.getElementById("demo").innerHTML = data;
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}