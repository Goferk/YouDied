var myGame = new Kiwi.Game('body', 'Juego', null, {'width': 1100, 'height': 650});

var Estado1 = new Kiwi.State( "Estado1" );
var Juego = [];

for (let i = 0; i<24; i++) {
  Juego[i] = []
  for (let j=0; j<24; j++) {
    if (i==11 && j==11) Juego[i][j] = 'p1';
    else if (i==12 && j==11) Juego[i][j] = 'p2';
    else if (i==11 && j==12) Juego[i][j] = 'p3';
    else if (i==12 && j==12) Juego[i][j] = 'p4';
    else if (i==0 && j==0) Juego[i][j] = 'b';
    else Juego[i][j] = '0';
  }
}

var turno = {
  status: 0,
  numero: 0,
  mov: false,
  onSelectx: 0,
  onSelecty: 0,
  f1: 4,
  f2: 4,
  f3: 5
};

Estado1.preload = function () {
    Kiwi.State.prototype.preload.call(this);
    this.addSpriteSheet('blockSprite', 'bloque.png', 25, 25 );
    this.addSpriteSheet('bossSprite', 'b.png', 25, 25 );
    this.addSpriteSheet('heroe1Sprite', 'p1.png', 25, 25 );
    this.addSpriteSheet('heroe2Sprite', 'p2.png', 25, 25 );
    this.addSpriteSheet('heroe3Sprite', 'p3.png', 25, 25 );
    this.addSpriteSheet('heroe4Sprite', 'p4.png', 25, 25 );
    this.addImage( 'background', 'background.png' );
}

Estado1.create = function(){

  this.myButton = new Kiwi.HUD.Widget.Button( this.game, 'Finalizar Turno', 650, 25 );
  this.game.huds.defaultHUD.addWidget( this.myButton );

  this.myButton.style.color = 'white';
  this.myButton.style.fontSize = '2em';
  this.myButton.style.fontWeight = 'bold';
  this.myButton.style.padding = '0.5em 1em';
  this.myButton.style.backgroundColor = 'black';
  this.myButton.style.cursor = 'pointer';

  this.myButton.input.onDown.add( this.buttonPressed, this );
  this.myButton.input.onUp.add( this.buttonReleased, this );

  this.myButton.input.onOver.add( this.buttonOver, this );
  this.myButton.input.onOut.add( this.buttonOut, this );

  Kiwi.State.prototype.create.call( this );

  this.background = new Kiwi.GameObjects.StaticImage( this, this.textures.background, 0, 0 );
  this.p1 = new Kiwi.GameObjects.Sprite( this, this.textures.heroe1Sprite, 12*25, 12*25 );
  this.p2 = new Kiwi.GameObjects.Sprite( this, this.textures.heroe2Sprite, 13*25, 12*25 );
  this.p3 = new Kiwi.GameObjects.Sprite( this, this.textures.heroe3Sprite, 12*25, 13*25 );
  this.p4 = new Kiwi.GameObjects.Sprite( this, this.textures.heroe4Sprite, 13*25, 13*25 );
  this.b = new Kiwi.GameObjects.Sprite( this, this.textures.bossSprite, 25, 25 );

  for (let i = 1; i <= 24; i++) {
    for (let j = 1; j <= 24; j++) {
      this['tablero' + i.toString() + 'x' + j.toString()] = new Kiwi.GameObjects.Sprite( this, this.textures.blockSprite, 25*i, 25*j );
    }
  }

  this.addChild( this.background );

  for (let i = 1; i <= 24; i++) {
    for (let j = 1; j <= 24; j++) {
      this['tablero' + i.toString() + 'x' + j.toString()].animation.add("normal", [0], 0.1, false);
      this['tablero' + i.toString() + 'x' + j.toString()].animation.add("disponible", [1], 0.1, false);
      this['tablero' + i.toString() + 'x' + j.toString()].animation.play("normal");
      this['tablero' + i.toString() + 'x' + j.toString()].input.onUp.add(this.moverse, this);
      this.addChild( this['tablero' + i.toString() + 'x' + j.toString()] );
    }
  }
  this.p1.input.onUp.add(this.disponibilidad2, this);
  this.p2.input.onUp.add(this.disponibilidad2, this);
  this.p3.input.onUp.add(this.disponibilidad2, this);
  this.p4.input.onUp.add(this.disponibilidad2, this);
  this.b.input.onUp.add(this.disponibilidad1, this);

  this.addChild( this.p1 );
  this.addChild( this.p2 );
  this.addChild( this.p3 );
  this.addChild( this.p4 );
  this.addChild( this.b );
}

Estado1.moverse = function () {
  let newX = Math.floor(this.game.input.x / 25);
  let newY = Math.floor(this.game.input.y / 25);
  let mov = Math.abs(newX-turno.onSelectx) + Math.abs(newY-turno.onSelecty);

  if (turno.mov && mov && Juego[newX-1][newY-1] == '0' && mov <= turno.f1 + turno.f2 + turno.f3) {
    if (turno.f1 && mov <= turno.f1) turno.f1 = 0;
    else if (turno.f2 && mov <= turno.f2) turno.f2 = 0;
    else if (turno.f3 && mov <= turno.f3) turno.f3 = 0;
    else if (turno.f1 && turno.f2 && mov <= turno.f1 + turno.f2) {
      turno.f1 = 0;
      turno.f2 = 0;
    } else if (turno.f1 && turno.f3 && mov <= turno.f1 + turno.f3) {
      turno.f1 = 0;
      turno.f3 = 0;
    } else if (turno.f2 && turno.f3 && mov <= turno.f2 + turno.f3) {
      turno.f2 = 0;
      turno.f3 = 0;
    } else{
      turno.f1 = 0;
      turno.f2 = 0;
      turno.f3 = 0;
    }
    Juego[newX-1][newY-1] = Juego[turno.onSelectx-1][turno.onSelecty-1];
    Juego[turno.onSelectx-1][turno.onSelecty-1] = '0'
    turno.mov = false;
    this[Juego[newX-1][newY-1]].x = newX * 25;
    this[Juego[newX-1][newY-1]].y = newY * 25;
    for (let i=1; i<=24; i++) {
      for (let j=1; j<=24; j++) {
        this['tablero' + i.toString() + 'x' + j.toString()].animation.play("normal");
      }
    }
  }
}

Estado1.disponibilidad2 = function () {
  if (!turno.status) {
    let x = Math.floor(this.game.input.x / 25);
    let y = Math.floor(this.game.input.y / 25);
    turno.onSelectx = x;
    turno.onSelecty = y;
    turno.mov = false;
    for (let i=1; i<=24; i++) {
      for (let j=1; j<=24; j++) {
        if (Math.abs(i-x) + Math.abs(j-y) <= turno.f1 + turno.f2 + turno.f3) {
          turno.mov = true;
          this['tablero' + i.toString() + 'x' + j.toString()].animation.play("disponible");
        } else {
          this['tablero' + i.toString() + 'x' + j.toString()].animation.play("normal");
        }
      }
    }
  }
}

Estado1.disponibilidad1 = function () {
  if (turno.status) {
    let x = Math.floor(this.game.input.x / 25);
    let y = Math.floor(this.game.input.y / 25);
    turno.onSelectx = x;
    turno.onSelecty = y;
    turno.mov = false;
    for (let i=1; i<=24; i++) {
      for (let j=1; j<=24; j++) {
        if (Math.abs(i-x) + Math.abs(j-y) <= turno.f1 + turno.f2 + turno.f3) {
          turno.mov = true;
          this['tablero' + i.toString() + 'x' + j.toString()].animation.play("disponible");
        } else {
          this['tablero' + i.toString() + 'x' + j.toString()].animation.play("normal");
        }
      }
    }
  }
}

Estado1.buttonPressed = function() {
  this.myButton.x = 653;
  this.myButton.y = 28;
}

Estado1.buttonReleased = function() {
  if (turno.status) {
    turno.status = 0;
    turno.numero += 1;
    turno.mov = false;
    turno.f1 = 4;
    turno.f2 = 4;
    turno.f3 = 5;
  } else {
    turno.status = 1;
    turno.mov = false;
    turno.f1 = 3;
    turno.f2 = 4;
    turno.f3 = 7;
  }
  this.myButton.x = 650;
  this.myButton.y = 25;
}

Estado1.buttonOver = function() {
  this.myButton.style.backgroundColor = 'green';
}

Estado1.buttonOut = function() {
  this.myButton.style.backgroundColor = 'black';
}

Estado1.update = function() {

  Kiwi.State.prototype.update.call( this );


}

myGame.states.addState( Estado1 );
myGame.states.switchState( "Estado1" );
