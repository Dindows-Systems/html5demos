//the following function will read the text file and will return the response Text as string.
function readTextFile(pPath)
{
    var file = pPath;
    var allText = "nil"
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("text/plain; charset=x-user-defined");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
                console.log("path for text file is ", pPath);
                // alert(allText);
                // var myArray = new Array()
                // myArray = allText.split(',');
                setGameLevelString(allText)
            }
        }
    }
    
    rawFile.send();
    
}

// var pTimerText1, pTimerText2

function createNumber(lNumber, pX, pY) {
    // console.log("lnumber is ", lNumber)
    
    var lNumber1, lNumber2
    lNumber1=lNumber%10; lNumber=Math.floor(lNumber/10)
    lNumber2=lNumber%10;
    console.log("the two numbers are ", lNumber2, lNumber1)
    if(lNumber2!=0) {
        var pTimerText1 = Crafty.e("2D, DOM, number"+lNumber2).attr({x:pX+15, y:pY+30});    
    }
    
    var pTimerText2 = Crafty.e("2D, DOM, number"+lNumber1).attr({x:pX+30, y:pY+30});
    if(lNumber2==0) {
      
      pTimerText2.x=pX+25;  
    } 

}

