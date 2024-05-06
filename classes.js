//generates random id;
function generateID(){
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  //return id of format 'aaaa'-'aaaa'-'aaaa'
  return s4() + "-" + s4() + "-" + s4();
};

class Player {
  constructor(
    player_name,
    color,
    points,
    nick_name,
    own_tiles = [],
    own_chips = []
  ) {
    this.player_name = player_name;
    this.color = color;
    this.points = points;
    this.nick_name = nick_name;
    this.own_tiles = own_tiles;
    this.own_chips = own_chips;
  }

  get points_fertility() {
    let total = 0;
    level = 0;
    for (const tile in this.own_tiles) {
      for (const chip_id in tile.chips) {
        for (const own_chip of this.own_chips) {
          if(chip_id === own_chip.id){
            if (own_chip.properties.population != undefined && own_chip.type === 'buildings') { //level = chip.properties.population ? chip.properties.population : 0
              level = chip_id.properties.population;
              total = total + tile.properties.fertility * Math.floor(Math.random() * 6) * 10 * level;
            }
          }
        }
      }
    }
    return total;
  }
}

class Chip {
  id;
  constructor(custom_name, type, sprite, properties = {}) {
    this.id = generateID();
    this.custom_name = custom_name;
    this.type = type;
    this.sprite = sprite;
    this.properties = properties;
  }
  get id(){
    return this.id;
  }
}

class Tile {
  id;
  constructor(
    position,
    own_player,
    color_t,
    alpha_t,
    tooltip_text = generateID(),
    custom_name,
    chips = [],
    properties = {},
    stroke_weight_t = 0,
    stroke_alpha_t = 0,
    stroke_color_t = 0,
  ) {
    this.id = generateID();
    this.position = position;
    this.own_player = own_player;
    this.tooltip_text = tooltip_text;
    this.color_t = color_t;
    this.alpha_t = alpha_t;
    this.stroke_weight_t = stroke_weight_t;
    this.stroke_alpha_t = stroke_alpha_t;
    this.stroke_color_t = stroke_color_t;
    this.custom_name = custom_name;
    this.chips = chips;
    this.properties = properties;
  }
  get id(){
    return this.id;
  }
}

class Sprite {
  id;
  constructor(
    moviment_tree = {},
    scale_sprite,
    width,
    height,
    quantity_frameRate,
    src,
    author
  ) {
      this.id = generateID();
      this.moviment_tree = moviment_tree;
      this.scale_sprite = scale_sprite
      this.width = width;
      this.height = height;
      this.quantity_frameRate = quantity_frameRate;
      this.src = src;
      this.author = author;
      this.image_ = new Image();
      this.image_.src = src
    }
    get id(){
      return this.id;
    }
    scaledWidth(scale = this.scale_sprite){
      return this.width * scale;
    }
    scaledHeight(scale = this.scale_sprite){
      return this.height * scale;
    }
}

class Grid{
  defaultAngle = Math.atan(0.5); // 51,34º  
  constructor(columns, rotation = 0, angle = 0, proportion = 1, grid_width , grid_height){
    this._width = grid_width;
    this._height = grid_height;
    this.columns = columns;
    this.rotation = rotation;
    this.angle = angle;
    this.proportion = proportion;
    this.pGrid = grid_width / grid_height;
    this.cell_width = grid_width/columns;
    this.cell_height = (grid_width/columns)*proportion;
    this.padding = 0;
    this.rows = grid_height/this.cell_height;
    this.cell_color = '#0DD';
    this.lineWidth = 2;
    this.lineStyle = "black";
    this.TRANSF = angle == 0 ? [[1,0],[0,1]] : [[1,1/Math.tan(this.angle)],[0,1]];
    this.ROTA = rotation == 0 ? [[1,0],[0,1]] : [[Math.cos(this.rotation),-Math.sin(this.rotation)],[Math.sin(this.rotation),Math.cos(this.rotation)]];
  }
  get id(){
    return this.id;
  }
  get vectorUnitX(){
    return math.dotMultiply(math.multiply(this.ROTA, math.multiply(this.TRANSF,[1,0])), this.cell_width);
  }
  get vectorUnitY(){
    return math.dotMultiply(math.multiply(this.ROTA, math.multiply(this.TRANSF,[0,1])),this.cell_height);
  }
  deploy() {
    //select the layer for paint the grid
    let elemnt_grid = document.getElementById("lay01");
    elemnt_grid.height = this._height;
    elemnt_grid.width = this._width;
    let c = elemnt_grid.getContext("2d");
    
    //paint the grid
    let k = 0;
    if(0!=Math.tan(this.angle)){
      k =  this.rows * this.cell_height / Math.tan(this.angle)//bug corregido
    }
    c.rotate(this.rotation);//rotation of canvas
    c.beginPath();
    c.lineWidth = grid.lineWidth;
    c.lineStyle = grid.lineStyle;
    for (let j = 0; j < grid._height * 2; j = j + grid.cell_height) {
      c.moveTo(-grid._width, j);
      c.lineTo(grid._width, j);
    }
    for (let i = -grid._width; i < grid._width; i = i + grid.cell_width) {
      c.moveTo(i, 0);
      c.lineTo( i + k * 2,(this.rows * 2) * this.cell_height); //bug corregido el mapa (grid) es el doble de grande de lo que se ve en pantalla (*2)
    }
    c.stroke();
  }
  populateTiles(tiles, tileColor = 50, tileAlpha = 60){
        //array de todos los tiles, compilacion de datos.
    for (let i = 0; i < this.rows * 2; i++) {
      tiles.push( [] );
    }
    for(let i = 0; i < this.rows * 2;i++){
      for(let j = -this.columns; j < this.columns; j++){
        //obtencion del punto arriba izquierda y despues la transformación lineal.
        let vector = [grid.cell_width * j, grid.cell_height * i];
        vector = math.multiply(this.TRANSF,vector);
        vector = math.multiply(this.ROTA,vector);
        //utilizo dos pocisiones una discreta para la cantidad de tiles y otra de la cantida de pixeles.
        let position = {column: j, row: i, xCanvas: vector[0], yCanvas: vector[1]}
        //creacion del tile una ves obtenidos la posión, el alpha y el color.
        let tile = new Tile();
        tiles[i].push(tile);
        tiles[i][j + this.columns].position = position;
        tiles[i][j + this.columns].color_t = tileColor;
        tiles[i][j + this.columns].alpha_t = tileAlpha;
      }
    }
       // tiles[3][21].color_t = "red";
      //tiles[3][20].color_t = "blue"; 
    return tiles;
  }
  computeHoverTile(tiles, x, y){
    //search and def t → f(tiles,x,y) = t[i][j]
    let invTransf = math.inv(this.TRANSF);
    let vector = math.multiply(invTransf,math.multiply(math.transpose(this.ROTA),[x,y]));
    //console.log('vector x y : ' + vector);
    //console.log('vector i j : ' + math.floor(vector[1]/this.cell_height) + ', ' + math.floor(vector[0]/this.cell_width));
    let i = math.floor(vector[1]/this.cell_height);
    let j = math.floor(vector[0]/this.cell_width);
    let t = tiles[i][j + this.columns];
    return t;
  }
  paintHoverTile(tile,tile_color = 50, tile_alpha = 60, stroke_color='white', stroke_alpha=90, stroke_Weight=4){
    //paint quad
    let upleft = new Array();
    if(tile != undefined){
      upleft.push(tile.position.xCanvas);
      upleft.push(tile.position.yCanvas);
      
      //noStroke();
      let parametersStroke = color(tile.stroke_color_t || stroke_color);
      parametersStroke.setAlpha(tile.stroke_alpha_t || stroke_alpha);
      strokeWeight(tile.stroke_weight_t || stroke_Weight);
      stroke(parametersStroke);
      let parametersTile = color(tile.color_t || tile_color);
      parametersTile.setAlpha(tile.alpha_t || tile_alpha);
      fill(parametersTile);
      
      //4 puntos del quad: asigno el primero con la transformación lineal y la rotación
      //y despues agrego la cantidad unitaria de la transformacion lineal
      //punto(x,y)→punto(x,y)↓punto(x,y)←punto(x,y)
      let vectorUnitX = math.dotMultiply(math.multiply(this.ROTA, math.multiply(this.TRANSF,[1,0])), this.cell_width);
      //console.log('lx: ' + lx);
      let vectorUnitY = math.dotMultiply(math.multiply(this.ROTA, math.multiply(this.TRANSF,[0,1])),this.cell_height);
      //console.log('ly: ' + ly);

      let upright = math.add(upleft,vectorUnitX);
      let bottomleft = math.add(upleft,vectorUnitY);
      let bottomright = math.add(upright,vectorUnitY);
      quad(
        upleft[0], upleft[1],
        upright[0], upright[1],
        bottomright[0], bottomright[1],
        bottomleft[0], bottomleft[1]);
    }
  }
}
