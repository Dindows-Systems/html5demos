$(function(){
  function hideModal(modalwindow){
    $(modalwindow).modal('hide');
  }
  
  $('#okwin01').on('click', function(e){
    e.preventDefault();
    hideModal('#modalwin');
  });
  
  $('#okwin02').on('click', function(e){
    e.preventDefault();
    updateBGColor();  
    hideModal('#bgchangemodal');  
  });
  
  $('#closewin02').on('click', function(e){
    e.preventDefault();
    
    var currentbg = rgb2hex($('body').css('backgroundColor'));
    resetRadioBtns(currentbg);
    hideModal('#bgchangemodal');
  });
});

/** 
 * Convert RGB() to Hexadecimal via JS
 * Source: http://stackoverflow.com/a/3627747/477958
**/
function rgb2hex(rgb) {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  function hex(x) {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  }
  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

/**
 * We need to see which radio button is currently selected by the user
 * then if different from the current BG we change the color
**/
function updateBGColor() {

  var currentid = $('input[name=bgradio]:checked').attr('id');
  if(currentid == 'bgdefault') {
    $('body').css('backgroundColor', '#eef3f6');
  }
  if(currentid == 'bgpalegreen') {
    $('body').css('backgroundColor', '#98fb98');  
  }
  if(currentid == 'bgwisteria') {
    $('body').css('backgroundColor', '#c9a0dc');    
  }
  if(currentid == 'bgsaffron') {
    $('body').css('backgroundColor', '#f4c430'); 
  }
  if(currentid == 'bgcarnation') {
    $('body').css('backgroundColor', '#ffa6c9');
  }
}

/**
 * When updating radios without saving we need to reset back to the previous state
 * This function will check the current BG and set the appropriate radio btn
**/
function resetRadioBtns(currbg) {
  if(currbg == '#eef3f6') {
    $('#bgdefault').prop('checked', true);
  }
  if(currbg == '#98fb98') {
    $('#bgpalegreen').prop('checked', true);
  }
  if(currbg == '#c9a0dc') {
    $('#bgwisteria').prop('checked', true);
  }
  if(currbg == '#f4c430') {
    $('#bgsaffron').prop('checked', true);
  }
  if(currbg == '#ffa6c9') {
    $('#bgcarnation').prop('checked', true);
  }
}
