export class StartScene extends Phaser.Scene {
   
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        // Cargar los assets para esta escena
        this.load.image('background1', 'assets/StartScene1.png');
        this.load.image('background2', 'assets/StartScene2.png');
        this.load.image('background3', 'assets/StartScene3.png');
        this.load.audio('musicIntro', 'assets/audio/intro2.mp3');
    }

    create() {
        let intro = this.sound.add('musicIntro');
            intro.play({
            loop: true,
            volume: 0.5,
        });
        let button = document.getElementById('comenzar');
        button.style.display = "block";
         // Agrega un detector de eventos de click al botón
        button.addEventListener('click', () => {
            // Oculta el botón cuando el juego está en progreso
            button.style.display = "none";

            // Reinicia el juego
            intro.stop();
            this.scene.start('PlayScene');
            });

            //Backgrounds
            this.backgrounds = [
                this.add.image(400, 300, 'background1'),
                this.add.image(400, 300, 'background2'),
                this.add.image(400, 300, 'background3')
            ];
            
            this.backgrounds[1].setVisible(false);
            this.backgrounds[2].setVisible(false);
    
            this.backgroundIndex = 0;
    
            this.time.addEvent({
                delay: 1200, // 2 segundos
                callback: this.changeBackground,
                callbackScope: this,
                loop: true
            });
    

         let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
         if (highScores.length == 0) {
            // Si el localStorage está vacío, inicialízalo con una matriz vacía
            highScores = [
                { name: 'AAA', score: 650 },
                { name: 'BBB', score: 600 },
                { name: 'CCC', score: 550 },
                { name: 'DDD', score: 500 },
                { name: 'EEE', score: 450 },
                { name: 'FFF', score: 400 },
                { name: 'GGG', score: 350 },
                { name: 'HHH', score: 300 },
                { name: 'III', score: 250 },
                { name: 'JJJ', score: 200 },
            ];
            localStorage.setItem('highScores', JSON.stringify(highScores));
        }

for (let i = 0; i < highScores.length; i++) {
    let rankingElement = document.getElementById('ranking' + (i + 1));
    let pointsElement = document.getElementById('puntos' + (i + 1));

    if (rankingElement && pointsElement) {
        rankingElement.textContent = highScores[i].name;
        pointsElement.textContent = highScores[i].score;
    }
}
       
    }
    changeBackground() {
        this.backgrounds[this.backgroundIndex].setVisible(false);
        this.backgroundIndex = (this.backgroundIndex + 1) % this.backgrounds.length;
        this.backgrounds[this.backgroundIndex].setVisible(true);
    }
}