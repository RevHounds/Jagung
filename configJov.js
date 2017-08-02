function preload(){
  currProvince = localStorage.getItem("province");
  HAHAHAHHAAHAAAA
  MAMPUS AJA LO HH
}

function setup(){
  var containerDiv = createDiv("");
  containerDiv.style("height", "100%");
  containerDiv.style("width", "100%");
  containerDiv.style("display", "flex");
  containerDiv.position(0,0);

  var rightDiv = createDiv("");
  rightDiv.style("width", "50%");
  rightDiv.style("height", "100%");

  var leftDiv = createDiv("");
  leftDiv.style("width", "50%");
  leftDiv.style("height", "100%");

  containerDiv.child(leftDiv);
  containerDiv.child(rightDiv);

  var provinceNameDiv = createDiv(currProvince);
  rightDiv.child(provinceNameDiv);

  var provinceLoc = '';
  for(var i=0; i<currProvince.length; i++){
    if(currProvince[i] != " ") {
      provinceLoc += currProvince[i];
      continue;
    }
    provinceLoc += '-';
    console.log(provinceLoc);
  }
  var imageLocation = 'url("' + 'image/' + provinceLoc + '.png") no-repeat center';
  leftDiv.style("background", imageLocation);
  leftDiv.style("background-size", "contain");

  provinceNameDiv.class('provinceName');

  var provinceDescription = 'ini cobain aja sih';
  provinceDetailDiv = createDiv(provinceDescription);
  provinceDetailDiv.class('provinceDetail');
  rightDiv.child(provinceDetailDiv);
}
