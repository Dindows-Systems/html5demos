//initialize the game database with name of the game


function initializeDB() {
    // Crafty.storage.open('SoccerFling');
    console.log("db is initialized or opened");
    if(typeof(Storage)!=="undefined")
      {
      // Yes! localStorage and sessionStorage support!
      // Some code.....
        // alert("can storage")
        if(localStorage.getItem("PenguinJump_isLocalStorageCreated")=="undefined")
        {
            localStorage.setItem("PenguinJump_isLocalStorageCreated", 0)
            createLocalStorage()
        }
            

        
        console.log(" is created or not ", localStorage.getItem("PenguinJump_isLocalStorageCreated"))
        // alert("local storage and sessionStorage supports"+ localStorage.getItem("isLocalStorageCreated"))
      }
    else
      {
      // Sorry! No web storage support..
      alert("no web storage support")
      }
}

function createLocalStorage() {
    //1 means unlocked, 0 means locked 
    console.log("create local starage function called ", localStorage.getItem("PenguinJump_isLocalStorageCreated"))
    if(localStorage.getItem("PenguinJump_isLocalStorageCreated")==1) return true;
    localStorage.setItem("PenguinJump_isLocalStorageCreated", 1)
    // alert("local storage initialized")
    localStorage.setItem("PenguinJump_LevelId1", 1)
    localStorage.setItem("PenguinJump_LevelId2", 0)
    localStorage.setItem("PenguinJump_LevelId3", 0)
    localStorage.setItem("PenguinJump_LevelId4", 0)
    localStorage.setItem("PenguinJump_LevelId5", 0)
    localStorage.setItem("PenguinJump_LevelId6", 0)
    localStorage.setItem("PenguinJump_LevelId7", 0)
    localStorage.setItem("PenguinJump_LevelId8", 0)
    localStorage.setItem("PenguinJump_LevelId9", 0)
    localStorage.setItem("PenguinJump_LevelId10", 0)
    localStorage.setItem("PenguinJump_LevelId11", 0)
    localStorage.setItem("PenguinJump_LevelId12", 0)
    localStorage.setItem("PenguinJump_LevelId13", 0)
    localStorage.setItem("PenguinJump_LevelId14", 0)
    localStorage.setItem("PenguinJump_LevelId15", 0)
    localStorage.setItem("PenguinJump_LevelId16", 0)
    localStorage.setItem("PenguinJump_LevelId17", 0)
    localStorage.setItem("PenguinJump_LevelId18", 0)
    localStorage.setItem("PenguinJump_LevelId19", 0)
    localStorage.setItem("PenguinJump_LevelId20", 0)
    localStorage.setItem("PenguinJump_LevelId21", 0)
    localStorage.setItem("PenguinJump_LevelId22", 0)
    localStorage.setItem("PenguinJump_LevelId23", 0)
    localStorage.setItem("PenguinJump_LevelId24", 0)
    localStorage.setItem("PenguinJump_LevelId25", 0)
    
    
    console.log("local storage created ", localStorage.getItem("PenguinJump_LevelId25"))
}

function getStorageItem(pKey) {
//    alert(localStorage.getItem(pKey))
    // alert(pKey)
    // alert("pkey is ", pKey)
    if(localStorage.getItem(pKey) != undefined)
        return localStorage.getItem(pKey)
    else {
        if(pKey=="PenguinJump_LevelId1") {
            localStorage.setItem("pKey",1);   
            return 1;
        } else {
            localStorage.setItem(pKey,0);   
        }
        
        return 0;
    }
}

function setStorageItem(pKey, pValue) {
    // if(localStorage.getItem(pKey) < pValue)
        localStorage.setItem(pKey, pValue);
}


