var myGame = new Kiwi.Game('body', 'You Died', null, {'width': 1100, 'height': 650});

var Estado1 = new Kiwi.State( "Estado1" );
var Juego = [];
var sprites = [];

for (let i = 0; i < 24; i++) {
  Juego[i] = []
  for (let j = 0; j < 24; j++) {
    if (i == 1 && j == 1) Juego[i][j] = 'b1';
    else if (i == 22 && j == 22) Juego[i][j] = 'b2';
    else Juego[i][j] = '0';
  }
}
var tiempo1 = 480, tiempo2 = 480;
var turno = {
  status: 0,
  numero: 0,
  mov: false,
  onSelectx: 0,
  onSelecty: 0,
  m: 10,
  enemyE: 'e1',
  b1: [1, 1, 1],
  b2: [22, 22, 3],
  chickendinner: false,
  jugadas: 2
};

Estado1.preload = function () {
    Kiwi.State.prototype.preload.call(this);
    this.addSpriteSheet('blockSprite', 'media/bloque.png', 25, 25 );
    this.addSpriteSheet('b1S', 'media/b1.png', 25, 25 );
    this.addSpriteSheet('b2S', 'media/b2.png', 25, 25 );
    this.addSpriteSheet('e1S', 'media/e1.png', 25, 25 );
    this.addSpriteSheet('e2S', 'media/e2.png', 25, 25 );
}

Estado1.create = function(){
  crearTimers(this);
  crearBoton(this);
  Kiwi.State.prototype.create.call( this );
  crearTablero(this);
  this.turnoDe = new Kiwi.GameObjects.Textfield( this, "Esta jugando el jugador 2!", 650, 100, "#000", 32, 'normal' );
  this.addChild( this.turnoDe );
  sprites.push('turnoDe');
  this.movimientos = new Kiwi.GameObjects.Textfield( this, "Te quedan 10 Movimientos", 650, 250, "#000", 32, 'normal' );
  this.addChild( this.movimientos );
  sprites.push('movimientos');
  this.winner = new Kiwi.GameObjects.Textfield( this, "", 200, 150, "#000", 50, 'normal' );
  this.addChild( this.winner );
  crearBosses(this);
  crearEsclavos(this);
}

Estado1.moverse = function () {
  let newX = Math.floor(this.game.input.x / 25);
  let newY = Math.floor(this.game.input.y / 25);
  let mov = Math.abs(newX-turno.onSelectx) + Math.abs(newY-turno.onSelecty);

  victory(this);

  if (turno.mov && mov && newX >= 1 && newY >= 1 && newX <= 24 && newY <= 24 &&
    Juego[newX-1][newY-1] == '0' && mov <= turno.m) {
    turno.m -= mov;
    turno.jugadas -= 1;
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
    this.movimientos.text = "Te quedan " + turno.m +" movimientos";
    if (!turno.m) newTurno(this);
  } else {
    for (let i=1; i<=24; i++) {
      for (let j=1; j<=24; j++) {
        this['tablero' + i.toString() + 'x' + j.toString()].animation.play("normal");
      }
    }
    turno.mov = false;
  }
}

Estado1.disponibilidad2 = function () {
  if (!turno.status) {
    disponible(this);
  }
}

Estado1.disponibilidad1 = function () {
  if (turno.status) {
    disponible(this);
  }
}

function crearTablero(Player) {
  for (let i = 1; i <= 24; i++) {
    for (let j = 1; j <= 24; j++) {
      Player['tablero' + i.toString() + 'x' + j.toString()] = new Kiwi.GameObjects.Sprite( Player, Player.textures.blockSprite, 25*i, 25*j );
      Player['tablero' + i.toString() + 'x' + j.toString()].animation.add("normal", [0], 0.1, false);
      Player['tablero' + i.toString() + 'x' + j.toString()].animation.add("disponible", [1], 0.1, false);
      Player['tablero' + i.toString() + 'x' + j.toString()].animation.play("normal");
      Player['tablero' + i.toString() + 'x' + j.toString()].input.onUp.add(Player.moverse, Player);
      Player.addChild( Player['tablero' + i.toString() + 'x' + j.toString()] );
      sprites.push('tablero' + i.toString() + 'x' + j.toString());
    }
  }
}

function crearBosses(Player) {
  Player.b1 = new Kiwi.GameObjects.Sprite( Player, Player.textures.b1S, 2*25, 2*25 );
  Player.b2 = new Kiwi.GameObjects.Sprite( Player, Player.textures.b2S, 23*25, 23*25 );

  Player.addChild( Player.b1 );
  Player.addChild( Player.b2 );
  sprites.push('b1');
  sprites.push('b2');
}

function crearEsclavos(Player) {
  for (let i = 1; i <= 6; i++) {
    Player['e1x' + i.toString()] = new Kiwi.GameObjects.Sprite( Player, Player.textures.e1S, 1*25, (i*3+1)*25 );
    Player['e2x' + i.toString()] = new Kiwi.GameObjects.Sprite( Player, Player.textures.e2S, 24*25, (24-i*3)*25 );
    Player['e1x' + i.toString()].input.onDown.add(Player.disponibilidad1, Player);
    Player['e2x' + i.toString()].input.onDown.add(Player.disponibilidad2, Player);
    Player.addChild( Player['e1x' + i.toString()] );
    Player.addChild( Player['e2x' + i.toString()] );
    sprites.push('e1x' + i.toString());
    sprites.push('e2x' + i.toString());
    Juego[0][i*3] = 'e1x' + i.toString();
    Juego[23][23-i*3] = 'e2x' + i.toString();
  }
  for (let i = 1; i <= 6; i++) {
    Player['e1x' + (i+6).toString()] = new Kiwi.GameObjects.Sprite( Player, Player.textures.e1S, (i*3+1)*25, 1*25 );
    Player['e2x' + (i+6).toString()] = new Kiwi.GameObjects.Sprite( Player, Player.textures.e2S, (24-i*3)*25, 24*25 );
    Player['e1x' + (i+6).toString()].input.onDown.add(Player.disponibilidad1, Player);
    Player['e2x' + (i+6).toString()].input.onDown.add(Player.disponibilidad2, Player);
    Player.addChild( Player['e1x' + (i+6).toString()] );
    Player.addChild( Player['e2x' + (i+6).toString()] );
    sprites.push('e1x' + (i+6).toString());
    sprites.push('e2x' + (i+6).toString());
    Juego[i*3][0] = 'e1x' + (i+6).toString();
    Juego[23-i*3][23] = 'e2x' + (i+6).toString();
  }
}

function crearTimers(Player) {
  Player.counterTextJ1 = new Kiwi.GameObjects.Textfield( Player, "TIEMPO J1: 8:00", 650, 150, "#000", 32, 'normal' );
  Player.counterTextJ2 = new Kiwi.GameObjects.Textfield( Player, "TIEMPO J2: 8:00", 650, 200, "#000", 32, 'normal' );
  Player.timerJ1 = Player.game.time.clock.createTimer('timeJ1', 1, 480, false);
  Player.timerJ1.createTimerEvent( Kiwi.Time.TimerEvent.TIMER_STOP, Player.fin1, Player );
  Player.timerJ1.createTimerEvent( Kiwi.Time.TimerEvent.TIMER_COUNT, Player.contJ1, Player );
  Player.timerJ1.start();
  Player.timerJ1.pause();

  Player.timerJ2 = Player.game.time.clock.createTimer('timeJ2', 1, 480, false);
  Player.timerJ2.createTimerEvent( Kiwi.Time.TimerEvent.TIMER_STOP, Player.fin2, Player );
  Player.timerJ2.createTimerEvent( Kiwi.Time.TimerEvent.TIMER_COUNT, Player.contJ2, Player );

  Player.timerJ2.start();

  Player.addChild( Player.counterTextJ1 );
  Player.addChild( Player.counterTextJ2 );
  sprites.push('counterTextJ1');
  sprites.push('counterTextJ2');
}

function crearBoton(Player) {
  Player.myButton = new Kiwi.HUD.Widget.Button( Player.game, 'Finalizar Turno', 650, 25 );
  Player.game.huds.defaultHUD.addWidget( Player.myButton );
  sprites.push('myButton');

  Player.myButton.style.color = 'white';
  Player.myButton.style.fontSize = '2em';
  Player.myButton.style.fontWeight = 'bold';
  Player.myButton.style.padding = '0.5em 1em';
  Player.myButton.style.backgroundColor = 'black';
  Player.myButton.style.cursor = 'pointer';

  Player.myButton.input.onDown.add( Player.buttonPressed, Player );
  Player.myButton.input.onUp.add( Player.buttonReleased, Player );

  Player.myButton.input.onOver.add( Player.buttonOver, Player );
  Player.myButton.input.onOut.add( Player.buttonOut, Player );
}

function disponible(Player) {
  let x = Math.floor(Player.game.input.x / 25);
  let y = Math.floor(Player.game.input.y / 25);
  if (turno.mov && turno.onSelectx == x && turno.onSelecty == y) {
    turno.mov = false;
    for (let i=1; i<=24; i++) {
      for (let j=1; j<=24; j++) {
        Player['tablero' + i.toString() + 'x' + j.toString()].animation.play("normal");
      }
    }
  } else {
    turno.onSelectx = x;
    turno.onSelecty = y;
    turno.mov = true;
    for (let i=1; i<=24; i++) {
      for (let j=1; j<=24; j++) {
        if (Math.abs(i-x) + Math.abs(j-y) <= turno.m) {
          Player['tablero' + i.toString() + 'x' + j.toString()].animation.play("disponible");
        } else {
          Player['tablero' + i.toString() + 'x' + j.toString()].animation.play("normal");
        }
      }
    }
  }
}

Estado1.fin1 = function() {
  this.counterTextJ1.text =  "Perdiste J1";
}
Estado1.fin2 = function() {
  this.counterTextJ2.text =  "Perdiste J2";
}

Estado1.contJ1 = function() {
  tiempo1 -= 1;
  let m = Math.floor(tiempo1/60);
  let s = tiempo1 % 60;
  if (s < 10) s = "0" + s;
  this.counterTextJ1.text =  "TIEMPO J1: " + m + ":" + s ;
  if (tiempo1 <= 0) {
    this.winner.text = 'EL GANADOR ES EL JUGADOR 2!';
    turno.chickendinner = true;
    borrarTodo(this);
  }
}

Estado1.contJ2 = function() {
  tiempo2 -= 1;
  let m = Math.floor(tiempo2/60);
  let s = tiempo2 % 60;
  if (s < 10) s = "0" + s;
  this.counterTextJ2.text =  "TIEMPO J2: " + m + ":" + s ;
  if (tiempo2 <= 0) {
    this.winner.text = 'EL GANADOR ES EL JUGADOR 1!';
    turno.chickendinner = true;
    borrarTodo(this);
  }
}

Estado1.buttonPressed = function() {
  this.myButton.x = 653;
  this.myButton.y = 28;
}

Estado1.buttonReleased = function() {
  if (!turno.chickendinner) {
    newTurno(this);
    this.myButton.x = 650;
    this.myButton.y = 25;
  }
}

Estado1.buttonOver = function() {
  this.myButton.style.backgroundColor = 'green';
}

Estado1.buttonOut = function() {
  this.myButton.style.backgroundColor = 'black';
}

function borrarTodo(Player) {
  for (let i = 0; i < sprites.length; i++) {
    Player[sprites[i]].x = 9999;
    Player[sprites[i]].y = 9999;
  }
}

function cWin(Player, b) {
  let lista = [0, 0, 0, 0];
  for (let i = turno[b][0]-1; i >= 0; i--) {
    if (Juego[i][turno[b][1]][0] == 'e') {
      lista[0] = parseInt(Juego[i][turno[b][1]][1]);
      break;
    }
  }

  for (let i = turno[b][0]+1; i < 24; i++) {
    if (Juego[i][turno[b][1]][0] == 'e') {
      lista[1] = parseInt(Juego[i][turno[b][1]][1]);
      break;
    }
  }

  for (let i = turno[b][1]-1; i >= 0; i--) {
    if (Juego[turno[b][0]][i][0] == 'e') {
      lista[2] = parseInt(Juego[turno[b][0]][i][1]);
      break;
    }
  }

  for (let i = turno[b][1]+1; i < 24; i++) {
    if (Juego[turno[b][0]][i][0] == 'e') {
      lista[3] = parseInt(Juego[turno[b][0]][i][1]);
      break;
    }
  }

  if (lista[0] == lista[1] && lista[1] == lista[2] && lista[2] == lista[3]) return lista[0];
}

function victory(Player, b1, b2) {
  let p1 = cWin(Player, 'b1');
  let p2 = cWin(Player, 'b2');
  if (p2 || b2) {
    Player.winner.text = 'EL GANADOR ES EL JUGADOR 1!';
    turno.chickendinner = true;
    borrarTodo(Player);
  } else if (p1 || b1) {
    Player.winner.text = 'EL GANADOR ES EL JUGADOR 2!';
    turno.chickendinner = true;
    borrarTodo(Player);
  }
}

function moverEstrella(b, Player) {
  let aX = turno[b][0];
  let aY = turno[b][1];
  for (let i = 0; i < 4; i++) {
    if (turno[b][2] == 1) {
      if (Juego[turno[b][0]+1][turno[b][1]] == '0' && turno[b][0] < 22) {
        Juego[turno[b][0]+1][turno[b][1]] = Juego[turno[b][0]][turno[b][1]];
        Juego[turno[b][0]][turno[b][1]] = '0';
        turno[b][0] += 1;
        Player[b].x = (turno[b][0]+1) * 25;
        return false;
      } else turno[b][2] = 2;
    } else if (turno[b][2] == 2) {
      if (Juego[turno[b][0]][turno[b][1]+1] == '0' && turno[b][1] < 22) {
        Juego[turno[b][0]][turno[b][1]+1] = Juego[turno[b][0]][turno[b][1]];
        Juego[turno[b][0]][turno[b][1]] = '0';
        turno[b][1] += 1;
        Player[b].y = (turno[b][1]+1) * 25;
        return false;
      } else turno[b][2] = 3;
    } else if (turno[b][2] == 3) {
      if (Juego[turno[b][0]-1][turno[b][1]] == '0' && turno[b][0] > 1) {
        Juego[turno[b][0]-1][turno[b][1]] = Juego[turno[b][0]][turno[b][1]];
        Juego[turno[b][0]][turno[b][1]] = '0';
        turno[b][0] -= 1;
        Player[b].x = (turno[b][0]+1) * 25;
        return false;
      } else turno[b][2] = 4;
    } else if (turno[b][2] == 4) {
      if (Juego[turno[b][0]][turno[b][1]-1] == '0' && turno[b][1] > 1) {
        Juego[turno[b][0]][turno[b][1]-1] = Juego[turno[b][0]][turno[b][1]];
        Juego[turno[b][0]][turno[b][1]] = '0';
        turno[b][1] -= 1;
        Player[b].y = (turno[b][1]+1) * 25;
        return false;
      } else turno[b][2] = 1;
    }
  }
  if (turno[b][0] == aX && turno[b][1] == aY) return true;
}

function newTurno(Player) {
  let b1 = moverEstrella('b1', Player);
  let b2 = moverEstrella('b2', Player);
  victory(Player, b1, b2);

  turno.mov = false;
  turno.m = 10;
  turno.jugadas = 2;

  Player.movimientos.text = "Te quedan 10 movimientos";
  for (let i=1; i<=24; i++) {
    for (let j=1; j<=24; j++) {
      Player['tablero' + i.toString() + 'x' + j.toString()].animation.play("normal");
    }
  }
  if (turno.status) {
    Player.turnoDe.text = "Esta jugando el jugador 2!";
    Player.timerJ2.resume();
    Player.timerJ1.pause();
    turno.status = 0;
    turno.numero += 1;
    turno.enemyE = 'e1';
  } else {
    Player.turnoDe.text = "Esta jugando el jugador 1!";
    Player.timerJ1.resume()
    Player.timerJ2.pause();
    turno.status = 1;
    turno.enemyE = 'e2';
  }
}

Estado1.update = function() {
  Kiwi.State.prototype.update.call( this );
  if (turno.chickendinner) this.myButton.x = 9999;
  if (!turno.jugadas) newTurno(this);
}

myGame.states.addState( Estado1 );
myGame.states.switchState( "Estado1" );
