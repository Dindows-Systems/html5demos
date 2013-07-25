var isMuted = false
var isBgMenuMusicPlaying = false;

function loadAudio() {
    Crafty.audio.add({
              PenguinJump: [
              "audio/Sfx_Jump.wav",
              "audio/Sfx_Jump.mp3",
              "audio/Sfx_Jump.ogg",
              ],
              BgmMenu: [
              "audio/Bgm_Menu.wav",
              "audio/Bgm_Menu.mp3",
              "audio/Bgm_Menu.ogg",
              ],

              GameMusic: [
              "audio/Bgm_Gameplay.wav",
              "audio/Bgm_Gameplay.mp3",
              "audio/Bgm_Gameplay.ogg",
              ],

              GameWin: [
              "audio/Sfx_LevelClear.wav",
              "audio/Sfx_LevelClear.mp3",
              "audio/Sfx_LevelClear.ogg",
              ],

              PenguinFall: [
              "audio/Sfx_Fall.wav",
              "audio/Sfx_Fall.mp3",
              "audio/Sfx_Fall.ogg",
              ],
            });
    console.log("AAAUUUUUUUDDDDDDDDDDDIIIIIIIIIIIOOOOOOOOOOO LOADED")
}

function setAudioIsMuted(pBool) {
    // console.log("set the audio to ", pBool)
    isMuted = pBool
}

function getAudioIsMuted() {
    // console.log(" returning get audio is muted function with ", isMuted)
    return isMuted
}

//the following function will convert all floating point numbers to integers example 3.99 to 3
function playSfxAudio(pAudioName) {
    // console.log("float to int", value|0)

    if(isMuted) {  return true; }
    if(pAudioName==undefined) return true;
    Crafty.audio.play(pAudioName)
    // console.log("audio muted ", isMuted)
}

function playBgMusic(pAudioName) {
    if(isMuted) {  return true; }
    if(pAudioName==undefined) return true;
    if(pAudioName=="BgmMenu" ) { 
      if(isBgMenuMusicPlaying) { return true ; } else { isBgMenuMusicPlaying=true; }
    }
    Crafty.audio.stop();
    Crafty.audio.play(pAudioName, -1)
}

function setBgMusicPlaying() {
  isBgMenuMusicPlaying=false;
}

