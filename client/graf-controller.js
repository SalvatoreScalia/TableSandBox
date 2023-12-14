var HEIGHT_MENU = 250;
const moviment = {
  idle: { sprite: [1, 2, 3, 4], rowSprite: 0 },
  attack1: { sprite: [0, 1, 2, 3, 4], rowSprite: 1 },
  attack2: { sprite: [0, 1, 2, 3], rowSprite: 2 },
  attack3: { sprite: [0, 1, 2, 3], rowSprite: 3 },
  dead: { sprite: [0, 1, 2, 3, 4, 5], rowSprite: 4 },
  defender: { sprite: [0, 1, 2, 3, 4], rowSprite: 5 },
  hurt: { sprite: [0, 1], rowSprite: 6 },
  jump: { sprite: [0, 1, 2, 3, 4, 5], rowSprite: 7 },
  block: { sprite: [0], rowSprite: 8 },
  run: { sprite: [0, 1, 2, 3, 4, 5, 6], rowSprite: 9 },
  runattack: { sprite: [0, 1, 2, 3, 4, 5, 6], rowSprite: 10 },
  blanck: { sprite: [0], rowSprite: 0 },
};

const map_image = new Image();
map_image.src = ".\\asstes\\img\\maps\\map_laurawithouttext.jpg";
map_image.alt = "map-laura";

const gui_bisel_start = new Image();
gui_bisel_start.src = ".\\asstes\\img\\gui\\gui_menu_bisel_start.png";

const gui_bisel_end = new Image();
gui_bisel_end.src = ".\\asstes\\img\\gui\\gui_menu_bisel_end.png";

const gui_bisel_body = new Image();
gui_bisel_body.src = ".\\asstes\\img\\gui\\gui_menu_bisel_body.png";


const canvas = document.getElementById("lay00");
canvas.width = map_image.width;
canvas.height = map_image.height;

const menu = document.getElementById("menu0");
menu.width = canvas.width;
menu.height = HEIGHT_MENU;

map_image.onload = function() {
  let ctx = canvas.getContext("2d");
  ctx.drawImage(map_image,0,0);
};

gui_bisel_body.onload = function() {
  let ctx = menu.getContext("2d");
  ctx.drawImage(gui_bisel_start,0,0,gui_bisel_start.width,gui_bisel_start.height,0,0,menu.width * 0.01,menu.height);
  ctx.drawImage(gui_bisel_body,0,0,gui_bisel_body.width,gui_bisel_body.height,menu.width * 0.01,0,menu.width*0.98,menu.height);
  ctx.drawImage(gui_bisel_end,0,0,gui_bisel_end.width,gui_bisel_end.height,menu.width*0.99,0,menu.width * 0.01,menu.height);
};

function drawFrameInCanvas(image_,id, width,height, frameColumnX, frameRowY, canvasX, canvasY) {
  let c = document.getElementById(id);
  c.width = canvas.width;
  c.height = canvas.height;
  let context = c.getContext("2d");
  context.clearRect(canvasX, canvasY, width,height);
  context.drawImage(image_,
                frameColumnX * width, frameRowY * height, width, height,
                canvasX, canvasY, scaledWidth, scaledHeight);
}
function drawFrameInMenu(image_, width, height, frameColumnX, frameRowY, canvasX, canvasY) {
  let c = document.getElementById("menu1");
  c.width = menu.width;
  c.height = menu.height;
  let context = c.getContext("2d");
  context.clearRect(canvasX, canvasY, width,height);
  context.drawImage(image_,
                frameColumnX * width, frameRowY * height, width, height,
                canvasX, canvasY, width, height);
}

