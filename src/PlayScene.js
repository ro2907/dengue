export class PlayScene extends Phaser.Scene {
    platforms;
    player;
    stars;
    score = 0;
    scoreText;
    bombs;
    music;
    cursors;
    init() {
        this.score = 0;
        
        // Resto de tu código init...
    }
    constructor() {
        super({ key: 'PlayScene' });
    }

     preload ()
{
    //Carguemos los assets que necesitamos para nuestro juego. Esto se hace poniendo llamadas al Phaser Loader dentro de una función de Escena llamada preload. Phaser buscará automáticamente esta función cuando se inicie y cargará cualquier cosa definida dentro de ella.
    this.load.image('sky', 'assets/futuro2.png');
    this.load.image('ground', 'assets/platform1.png');
    this.load.image('licencia', 'assets/licencia2.png');
    this.load.spritesheet('star', 'assets/basura4.png',{ frameWidth: 56, frameHeight: 50 });
    this.load.spritesheet('bomb', 'assets/mosq4.png',{ frameWidth: 72, frameHeight: 60 });
    this.load.spritesheet('dude', 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 42 }
    );
    this.load.audio('backgroundMusic', 'assets/audio/backgroundMusic.mp3');
}


 create ()
{
    
    if (!this.sound.get('backgroundMusic')) {
        this.music = this.sound.add('backgroundMusic');
       
    }
    this.music.play({
        loop: true,
        volume: 0.5,
    });
    
    // this.add.image está creando un nuevo objeto de juego de imagen y agregándolo a la lista de visualización de escenas actual. Esta lista es donde viven todos sus objetos de juego.
    this.add.image(400,300, 'sky'); //Los valores 400 y 300 son las coordenadas x e y de la imagen. ¿Por qué 400 y 300? Es porque en Phaser 3 todos los Game Objects están posicionados en su centro por defecto. La imagen de fondo tiene un tamaño de 800 x 600 píxeles
    document.getElementById('comenzar').style.display = "none";

    //Esto crea un nuevo Grupo de Física Estática y lo asigna a la variable local platforms. En Arcade Physics existen dos tipos de cuerpos físicos: Dinámicos y Estáticos. Un cuerpo dinámico es aquel que puede moverse a través de fuerzas como la velocidad o la aceleración. Puede rebotar y chocar con otros objetos y esa colisión está influenciada por la masa del cuerpo y otros elementos.
    this.platforms = this.physics.add.staticGroup();
    

    //La primera línea de código anterior agrega una nueva imagen de suelo de 400 x 568 (recuerde, las imágenes se colocan en función de su centro); el problema es que necesitamos esta plataforma para abarcar todo el ancho de nuestro juego, de lo contrario, el jugador simplemente caerá fuera de los lados. Para ello lo escalamos x2 con la función setScale(2). Ahora tiene un tamaño de 800 x 64, que es perfecto para nuestras necesidades. La llamada a refreshBody()es obligatoria porque hemos escalado un cuerpo físico estático , por lo que debemos informarle al mundo de la física sobre los cambios que hicimos.
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody(); 

    //El proceso es exactamente el mismo que antes, solo que no necesitamos escalar estas plataformas ya que ya tienen el tamaño correcto.
    //Se colocan 3 plataformas alrededor de la pantalla, separadas las distancias correctas para permitir que el jugador salte hacia ellas.
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');
    this.platforms.create(620, 570, 'licencia');

    //Esto crea un nuevo sprite llamado player, ubicado a 100 x 450 píxeles desde la parte inferior del juego. El sprite se creó a través de Physics Game Object Factory ( this.physics.add), lo que significa que tiene un cuerpo de física dinámica de forma predeterminada.
    this.player = this.physics.add.sprite(100, 450, 'dude').setScale(1.5).refreshBody();

    //Para permitir que el jugador colisione con las plataformas, podemos crear un objeto Colisionador. Este objeto monitorea dos objetos físicos (que pueden incluir grupos) y busca colisiones o superposiciones entre ellos.
    this.physics.add.collider(this.player, this.platforms);

    

    

    this.player.setBounce(0.2); // efecto rebote al caer, a mayor valor mayor rebote
    this.player.setCollideWorldBounds(true);
    this.player.body.setGravityY(300)

//Hay 9 fotogramas en total, 4 para correr hacia la izquierda, 1 para mirar a la cámara y 4 para correr hacia la derecha. Nota: Phaser admite voltear sprites para ahorrar fotogramas de animación, pero por el bien de este tutorial lo mantendremos a la antigua.
this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10, //fotogramas por segundo
    repeat: -1 //-1 indica que se prepite
});

this.anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 4 } ],
    frameRate: 20
});

this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 20,
    repeat: -1
});
this.anims.create({
    key: 'bombAnimation',
    frames: this.anims.generateFrameNumbers('bomb', { start: 0, end: 2 }),
    frameRate: 10,
    repeat: -1
});
this.anims.create({
    key: 'bombAnimation2',
    frames: this.anims.generateFrameNumbers('bomb', { start: 3, end: 5 }),
    frameRate: 20,
    repeat: -1
});

//................Estrellas....................
//Los grupos pueden tomar objetos de configuración para ayudar en su configuración. En este caso, el objeto de configuración del grupo tiene 3 partes: Primero, establece la clave de textura para que sea la imagen de la estrella. Esto significa que todos los elementos secundarios creados como resultado del objeto de configuración recibirán la textura de estrella de forma predeterminada. Luego establece el valor de repetición en 11. Debido a que crea 1 niño automáticamente, repetir 11 veces significa que obtendremos 12 en total, que es justo lo que necesitamos para nuestro juego.

//La parte final es setXY: se usa para establecer la posición de los 12 niños que crea el Grupo. Cada niño se colocará a partir de x: 12, y: 0 y con un paso de x de 70. Esto significa que el primer niño se colocará en 12 x 0, el segundo se ubicará a 70 píxeles de 82 x 0, el tercero está en 152 x 0, y así sucesivamente. Los valores de 'paso' son una forma muy útil de espaciar los elementos secundarios de un grupo durante la creación. Se elige el valor de 70 porque significa que los 12 niños estarán perfectamente espaciados en la pantalla.
this.stars = this.physics.add.group({
    key: 'star',
    frame: [0, 1, 2, 3], // Indica los frames del spritesheet a utilizar
    repeat: 2,
    setXY: { x: 12, y: 0, stepX: 70 }
});

this.stars.children.iterate(function (child) {

    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)).setScale(1.3).refreshBody();

});
//las estrellas caerían por la parte inferior del juego y se perderían de vista. Para detener eso, debemos verificar su colisión contra las plataformas.
this.physics.add.collider(this.stars, this.platforms);
//Además de hacer esto, también verificaremos si el jugador se superpone con una estrella o no:
this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

//...............Texto y puntuación..............
//16 x 16 es la coordenada para mostrar el texto. 'score: 0' es la cadena predeterminada para mostrar y el objeto que sigue contiene un tamaño de fuente y un color de relleno. Al no especificar qué fuente, en realidad usaremos la predeterminada de Phaser, que es Courier.
this.scoreText = this.add.text(16, 550, 'score: 0', { fontSize: '32px', fill: '#4b0b57' });

 //...............Bombas...........
 this.bombs = this.physics.add.group();

 this.physics.add.collider(this.bombs, this.platforms);

 this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

}
 
 update ()
{
    
    //Phaser tiene un administrador de teclado incorporado y uno de los beneficios de usarlo es esta pequeña y práctica función:
    this.cursors = this.input.keyboard.createCursorKeys();

    //Lo primero que hace es comprobar si se mantiene pulsada la tecla izquierda. Si es así, aplicamos una velocidad horizontal negativa y comenzamos la animación de ejecución 'izquierda'. Si están presionando 'derecha' en su lugar, literalmente hacemos lo contrario. Al borrar la velocidad y configurarla de esta manera, en cada cuadro, se crea un estilo de movimiento de 'parada-arranque'.
    if (this.cursors.left.isDown)
{
    this.player.setVelocityX(-160); //mayor numero mas velocidad

    this.player.anims.play('left', true);
}
else if (this.cursors.right.isDown)
{
    this.player.setVelocityX(160);

    this.player.anims.play('right', true);
}
else
{
    this.player.setVelocityX(0);

    this.player.anims.play('turn');
}
//El cursor arriba es nuestra tecla de salto y probamos si está abajo. Sin embargo, también probamos si el jugador está tocando el suelo (player.body.touching.down), de lo contrario, podría saltar mientras está en el aire.
if (this.cursors.up.isDown && this.player.body.touching.down)
{
    this.player.setVelocityY(-530);
}
this.checkBombAnimation();
}
//Testear desde aquí
//Esto le dice a Phaser que busque una superposición entre el jugador y cualquier estrella en el grupo de estrellas. Si se encuentran, se pasan a la función 'collectStar':
collectStar (player, star)
{
    star.disableBody(true, true);

    //para que cuando el jugador recoja una estrella, su puntuación aumente y el texto se actualice para reflejar esto:
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
     console.log(this.stars.countActive(true))
    if (this.stars.countActive(true) === 0)
    {
        console.log('aquí');
        this.stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);
            console.log('aquí no');
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = this.bombs.create(x, 16, 'bomb').setScale(1.3).refreshBody();
        bomb.verificado = false;
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 10);
        bomb.setOrigin(0, 0);
        bomb.anims.play('bombAnimation');
      
    }


}

 hitBomb (player, bomb) {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');
        this.music.stop();

        this.gameOver = true;
        // Agrega un retardo antes de iniciar la escena final
    setTimeout(() => {
        this.scene.start('EndScene', { score: this.score }); // Añadir esta línea para iniciar la EndScene
    }, 3000); // Esperar 3000 milisegundos (o 3 segundos)
    }
    checkBombAnimation() {
        this.bombs.children.iterate((bomb) => {  
        // console.log(bomb.verificado)
        if (this.player.x - bomb.x < 0 && !bomb.verificado) {
          // Realizar la verificación y cambiar la animación según corresponda
            bomb.play('bombAnimation'); // Cambia 'animation1' por el nombre de tu primera animación
            // Establecer la propiedad 'verificado' como verdadera después de la verificación
            bomb.verificado = true;
          } else if (this.player.x - bomb.x > 0 && bomb.verificado) { {
            bomb.play('bombAnimation2'); // Cambia 'animation2' por el nombre de tu segunda animación
            // Establecer la propiedad 'verificado' como verdadera después de la verificación
            bomb.verificado = false;
          }
    
          
        }
      });
    }
}
   

