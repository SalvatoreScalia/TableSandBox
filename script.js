var TILES = new Array();
var SELECT = false;
var T;
var X=0;
var Y=0;
var TICK = 5;
/* Grid properties →
    Columns: Cantidad de cuadrados a lo ancho.
    Rotation canvas: -0.4636476090008061 = -26.56º
    Inclination angle: 0.9272952180016122 = 51,34º
    Proportion tile cell: 0.8
    Canvas measurements: width height
 */






const grid = new Grid(40,-0.4636476090008061,0.9272952180016122,0.8,canvas.width,canvas.height);
const sprite_character_kinght = new Sprite(moviment,1,132,86,10,".\\asstes\\img\\characters\\characters_knight_sprites.png","AntonioScalia");
console.log('θ: ' + grid.defaultAngle);

function setup() {
  frameRate(60);
  //paint the grid
  grid.deploy();
  
  //capa tiles
  let tc = createCanvas(grid._width,grid._height);
  tc.id("lay02");
  tc.parent("wrapper");

  TILES = grid.populateTiles(TILES);
}

let currentLoopIndex = 0;
let frame = 0;
function draw() {
  frame++;
  if(frame % sprite_character_kinght.q_frameRate == 0){
    drawFrameInMenu(
      sprite_character_kinght.image_,
      sprite_character_kinght.width, 
      sprite_character_kinght.height,
      sprite_character_kinght.moviment_tree.run.sprite[currentLoopIndex],
      sprite_character_kinght.moviment_tree.run.rowSprite,
      10,  //X in canvas menu
      10); //Y in canvas menu
    currentLoopIndex++;
    if (currentLoopIndex >= sprite_character_kinght.moviment_tree.run.sprite.length) {
      currentLoopIndex = 0;
    }
  }
  if(frame == 100000){
    frame = 0;
  }
}

function checkSelection(){
  if(SELECT){
    T = TILES[X][Y];
    grid.paintHoverTile(T);
  }
  else
  {
    try {
      document.getElementById("hovertooltip").remove();
    } catch (ex) {
      console.warn('-',ex.message);
    }
  }
}

////FUNCIONAMIENTO DEL TOOLTIP
let tooltip; // Variable global para el tooltip
let isDragging = false;
let offsetX, offsetY;

function displayTooltip() {
  tooltip = createDiv('Id:' + T.id); // Usa la variable global aquí
  tooltip.id("hovertooltip");
  tooltip.class("tooltip");
  tooltip.position(T.position.xCanvas + grid.lx[0], T.position.yCanvas + grid.lx[1] - 30);
  let span = createSpan(T.tooltip_text);
  span.class("tooltiptext");
  span.parent(tooltip);

  // Hacer el tooltip arrastrable
  tooltip.mousePressed(startDragging);
  tooltip.mouseReleased(stopDragging);
}

function startDragging() {
  isDragging = true;
  offsetX = mouseX - tooltip.position().x;
  offsetY = mouseY - tooltip.position().y;
}

function stopDragging() {
  isDragging = false;
}

function draw() {
  if (isDragging && tooltip) {
    tooltip.position(mouseX - offsetX, mouseY - offsetY);
  }
}




window.addEventListener('mousemove',(evt)=>{
  if(Math.abs(evt.movimentX) > 0 || Math.abs(evt.movementY) > 0 ){
    clear();
    T = grid.computeHoverTile(TILES,mouseX,mouseY);
    grid.paintHoverTile(T);
  }
  /*
  clear();
  fill("black");
  textSize(40);
  text('X: ' + mouseX, width/2, height/2); // + Math.abs(pmouseX)
  text('Y: ' + mouseY, width/2, height/2 + 40); // + Math.abs(pmouseY) */
});

window.addEventListener('click',(evt)=>{
  SELECT = true;
  let hovertooltip = document.getElementById("hovertooltip");
  let clicked_element = evt.target;
  do {
    if(clicked_element == hovertooltip) {
      // This is a click inside, does nothing, just return.
      console.log('click hovertooltip');
      
      return;
    }
    // Go up the DOM
    clicked_element = clicked_element.parentNode;
  } while (clicked_element);
  // This is a click outside.            
  clear();
  try {
    document.getElementById("hovertooltip").remove();
  } catch (ex) {
    console.warn('-',ex.message);
  }
  T = grid.computeHoverTile(TILES,mouseX,mouseY);
  X = T.position.row;
  Y = T.position.column + grid.columns;
  grid.paintHoverTile(T);
  displayTooltip();
})

window.addEventListener('keydown',(evt)=>{
  //console.log('key: ' + evt.key);
  clear();
  switch(evt.key){
    case 'd':
      X+=1;
      SELECT = true;
      break;
    case 'a':
      X-=1;
      SELECT = true;
      break;
    case 'w':
      Y+=1;
      SELECT = true;
      break;
    case 's':
      Y-=1;
      SELECT = true;
      break;
    case 'Escape':
      SELECT = false;
      break;
    case ' ':
      evt.preventDefault();
      break;
    default:
      break;
  }
  checkSelection();
})