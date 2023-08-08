
export class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScene' });
    }

    preload() {
        // Cargar los assets para esta escena
         // Cargar los assets para esta escena
         this.load.image('endScreen', 'assets/EndScene.png');
         this.load.audio('musicGanador', 'assets/audio/ganador.mp3');
    
    }

    init(data) {
            this.score = data.score;
            this.playerName = '';
            this.blink = true;
            this.timer = null;
            this.nameEntered = false;
        }
    
    create() {
        let intro = this.sound.add('musicGanador');
           
        this.add.image(400, 300, 'endScreen');
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
        console.log(highScores)
        if (highScores.length < 10 || this.score >= highScores[highScores.length - 1].score) {
            intro.play({
                volume: 1,
            });
            // El jugador ha conseguido un puesto en la lista de los 10 mejores
            this.eligibleForHighScore = true;
    
            // Obtenemos el lugar en la lista de mejores puntuaciones
            this.rank = 1;
            for (let i = 0; i < highScores.length; i++) {
                if (this.score < highScores[i].score) {
                    this.rank++;
                }
            }
            //textos
            this.add.text(405, 213, this.rank, { fontSize: '45px', fill: '#206ebc', fontStyle: 'bold', fontFamily: 'Sans-serif' }).setOrigin(0.5, 0.5);
            this.add.text(405, 322, this.score, { fontSize: '45px', fill: '#206ebc', fontStyle: 'bold', fontFamily: 'Sans-serif' }).setOrigin(0.5, 0.5);
    
            this.input.keyboard.on('keydown', this.handleKey, this);
            this.nameText = this.add.text(405, 434, `AAA`, { fontSize: '45px', fill: '#206ebc', fontStyle: 'bold', fontFamily: 'Sans-serif' }).setOrigin(0.5, 0.5);
            this.timer = this.time.addEvent({ delay: 500, callback: this.toggleBlink, callbackScope: this, loop: true });
    
            // Después de 15 segundos, guarda la puntuación y el nombre del jugador y cambia a la siguiente escena
            this.time.delayedCall(15000, () => {
                this.nameEntered = true;
                this.input.keyboard.off('keydown', this.handleKey, this);
    
                // Guarda la puntuación y el nombre del jugador
                let newScore = { name: this.playerName, score: this.score };
                let existingScoreIndex = highScores.findIndex(highScore => highScore.score == this.score);
    if (existingScoreIndex !== -1) {
        // Si el puntaje ya existe en highScores, reemplaza la entrada existente
        highScores[existingScoreIndex] = { name: this.playerName, score: this.score };
    } else {
        // Si no, agrega una nueva entrada
        highScores.push({ name: this.playerName, score: this.score });
    }
                highScores.sort((a, b) => b.score - a.score);
                highScores = highScores.slice(0, 10); // Mantén solo los 10 mejores
                
                localStorage.setItem('highScores', JSON.stringify(highScores));
                for (let i = 0; i < highScores.length; i++) {
                    let rankingElement = document.getElementById('ranking' + (i + 1));
                    let pointsElement = document.getElementById('puntos' + (i + 1));
                
                    if (rankingElement && pointsElement) {
                        rankingElement.textContent = highScores[i].name;
                        pointsElement.textContent = highScores[i].score;
                    }
                }
                       
                    
    
                // Reinicia la puntuación y cambia a la escena de inicio
                this.score = 0;
                this.scene.start('StartScene');
            }, [], this);
        } else {
            // La puntuación no es suficiente para estar en el top 10
            this.score = 0;
            this.scene.start('StartScene');
        }
        }
    
        handleKey(event) {
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.BACKSPACE || event.keyCode === Phaser.Input.Keyboard.KeyCodes.DELETE) {
                this.playerName = this.playerName.substr(0, this.playerName.length - 1);
            } else if (this.playerName.length < 3) {
                // Solo acepta letras
                if ((event.keyCode >= Phaser.Input.Keyboard.KeyCodes.A && event.keyCode <= Phaser.Input.Keyboard.KeyCodes.Z) ||
                    (event.keyCode >= Phaser.Input.Keyboard.KeyCodes.ZERO && event.keyCode <= Phaser.Input.Keyboard.KeyCodes.NINE)) {
                    this.playerName += event.key.toUpperCase();
                }
            }
        }
    
        toggleBlink() {
            this.blink = !this.blink;
        }
    
        update() {
            if (!this.nameEntered) {
                if (this.playerName.length < 3) {
                    this.nameText.setText(this.playerName + (this.blink ? '_' : ' '));
                } else {
                    this.nameText.setText(this.playerName);
                }
            }
            
        }
     }
