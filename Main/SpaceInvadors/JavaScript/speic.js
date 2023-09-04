    //board
    let tileSize = 32;
    let rows = 30;
    let columns = 50;

    let board;
    let boardWidth = tileSize * columns;
    let boardHeight = tileSize * rows;
    let context;

    //ship
    let shipWidth = tileSize * 2;
    let shipHeight = tileSize;
    let shipX = tileSize * columns/2 - tileSize;
    let shipY = tileSize * rows - tileSize*2;

    let ship = {
        x : shipX,
        y : shipY,
        width : shipWidth,
        height : shipHeight,
    };

    let shipImg;
    let shipVelocityx = tileSize; //ship moving speed

    //alien
    let alienArray = [];
    let alienWidth = tileSize*2;
    let alienHeight = tileSize;
    let alienX = tileSize;
    let alienY = tileSize;
    let alienImg;

    let alienRows = 2;
    let alienColumns = 3;
    let alienCount = 0; //number of aliens to defeat
    let alienVelocityx = 1; //alien moving speed

    //bollets
    let bulletArray = [];
    let bulletVelocityy = -10; //bullet moving speed

    let score = 0;
    let gameOver = false;
    let level = 0;
    let gameStarted = false;
    let alienKilled = 0;

    const alienColors = [
    "../pictures/alien-cyan.png",
     "../pictures/alien-magenta.png",
     "../pictures/alien-yellow.png",
     "../pictures/alien.png",
     // Add more colors here as needed
    ];

    window.onload = function () {
        board = document.getElementById("board");
        board.width = boardWidth;
        board.height = boardHeight;
        context = board.getContext("2d"); //used for drawing on the board

        document.addEventListener('keydown', function (e) {
            if (e.code == "Space") {
                gameStarted = true;
                context.clearRect(0, 0, board.width, board.height);
            }
        });

        //draw initial ship
        // context.fillStyle="green";
        // context.fillRect(ship.x, ship.y, ship.width, ship.height);

        //Load images
        shipImg = new Image();
        shipImg.src = "../pictures/ship.png";
        shipImg.onload = function () {
            context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
        }
        shipImg.onerror = function () {
            console.error("Failed to load ship image.");
        }


        // alienImg = new Image();
        // alienImg.src = "../pictures/alien.png";
        // alienImg.onload = function () {
        // createAliens(); // Call createAliens only when the alien image is loaded.
        // }
        // alienImg.onerror = function () {
        //     console.error("Failed to load ship image.");
        // }

     


        requestAnimationFrame(update);
        document.addEventListener("keydown", moveShip);
        document.addEventListener("keydown", shoot);
    };

    function update() {
        requestAnimationFrame(update);

        if (!gameStarted) {

            context.fillStyle="white";
            context.font="50px courier";
            context.fillText('Press Space to start', 500, 450);

            context.font='30px courier'
            context.fillText("Press Left and Right to move", 550, 500);
            return;
        };

        if (gameOver) {
            return;
        }
    
        context.clearRect(0, 0, board.width, board.height);
    
        //ship
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    
        //aliens
        for (let i = 0; i < alienArray.length; i++) {
            let alien = alienArray[i];
            if (alien.alive) {
                alien.x += alienVelocityx;
    
                //if alien touches the borders
                if (alien.x + alien.width >= board.width || alien.x <= 0) {
                    alienVelocityx *= -1;
                    alien.x += alienVelocityx*2;
    
                    //move all aliens down by one row
                    for (let j = 0; j < alienArray.length; j++) {
                        alienArray[j].y += alienHeight;
                    }
                }
                context.drawImage(alien.img, alien.x, alien.y, alien.width, alien.height);
            };
            if (alien.y >= ship.y) {
                for (let i = 0; i < 1; i++) {
                    gameOverAlert();
                };
            };
        };

        //bullets
        for (let i = 0; i < bulletArray.length; i++){
            let bullet = bulletArray[i];
            bullet.y += bulletVelocityy;
            context.fillStyle = "red";
            context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

            //bullet collides with alien
            for (let j = 0; j < alienArray.length; j++) {
                let alien = alienArray[j];
                if (!bullet.used && alien.alive && detectCollison(bullet, alien)) {
                    bullet.used = true;
                    alien.alive = false;
                    alienCount--;
                    alienKilled++;
                    score += 50;
                }
            }
        }

        //clear bullets
        while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
            bulletArray.shift(); //remove first element of the array
        }

        //next level
        if (alienCount == 0) {
            //increase the number of aliens in columns and rows
            alienColumns = Math.min(alienColumns + 1, columns/2 -2); //cap at 16/2 -2 = 6
            alienRows = Math.min(alienRows + 1, rows-4); //cap at 16 -4 = 12
            alienVelocityx += 0.2; //increase alien speed
            alienArray = []; //clear aliens
            bulletArray = []; //clear bullets
            createAliens();
            level++;
        }

        //score
        context.fillStyle="white";
        context.font="16px courier";
        context.fillText("Score: " + score, 5, 20);
        context.fillText("Aliens left: " + alienCount, 5, 40);
        context.fillText("Aliens killed: " + alienKilled, 5, 60);
        context.fillText("Level: " + level, 5, 80);

    };
    

    function moveShip(e) {
        if (gameOver) {
            return;
        }

        if (e.code == "ArrowLeft" && ship.x - shipVelocityx >= 0) {
            ship.x -= shipVelocityx; //move left one tile
        }
        else if (e.code == "ArrowRight" && ship.x + shipVelocityx + ship.width <= board.width) {
            ship.x += shipVelocityx; //move right one tile
        }
    };
    
    function createAliens() {
    const alienGapX = 20; // Horizontal gap between aliens
    const alienGapY = 20; // Vertical gap between aliens

    const alienGrid = []; // A grid to track occupied positions

    for (let c = 0; c < alienColumns; c++) {
        for (let r = 0; r < alienRows; r++) {
            // Calculate the position of the alien
            let alienX = c * (alienWidth + alienGapX) + alienGapX;
            let alienY = r * (alienHeight + alienGapY) + alienGapY;

            // Check if the current position is already occupied by another alien
            let positionOccupied = false;
            for (let i = 0; i < alienArray.length; i++) {
                let existingAlien = alienArray[i];
                if (
                    existingAlien.x === alienX &&
                    existingAlien.y === alienY
                ) {
                    positionOccupied = true;
                    break;
                }
            }

            // If the position is not occupied, create a new alien with a random color
            if (!positionOccupied) {
                // Randomly select an alien color from the array
                const randomColorIndex = Math.floor(Math.random() * alienColors.length);
                const randomColor = alienColors[randomColorIndex];

                let alien = {
                    img: new Image(),
                    x: alienX,
                    y: alienY,
                    width: alienWidth,
                    height: alienHeight,
                    alive: true,
                };

                // Set the src of the alien image to the randomly selected color
                alien.img.src = randomColor;

                alienArray.push(alien);

                // Update the grid to mark this position as occupied
                alienGrid.push({ x: alienX, y: alienY });
            }
        }
    }
    alienCount = alienArray.length;
}


    function shoot(e) {
        if (gameOver) {
            return;
        }

        if (e.code == "Space") {
            //shoot
            let bullet = {
                x : ship.x + ship.width*15/32,
                y : ship.y,
                width : tileSize/8,
                height : tileSize/2,
                used : false,
            }
            bulletArray.push(bullet);
        }
    };

    function detectCollison(a, b) {
        return a.x < b.x +b.width &&    //a's top left corner is to the left of b's top right corner
                a.x + a.width > b.x &&  //a's top right corner passes b's top left corner
                a.y < b.y + b.height &&     //a's top left corner doesn't reach b's bottom left corner
                a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
        
    };

    button = document.getElementById('button');
    button.addEventListener('click', function() {
        gameOverAlert();
    });

    function gameOverAlert() {
        gameOver = true;
        alert('Game Over, try again! Du klarte å få ' + score + ' poeng! Du kom til level ' + level + '!');
        console.warn("Game Over")
    };