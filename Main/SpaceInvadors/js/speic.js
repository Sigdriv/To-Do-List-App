    //board
    let tileSize = 32;
    let rows = 16;
    let columns = 16;

    let board;
    let boardWidth = tileSize * columns; // 32 * 16
    let boardHeight = tileSize * rows; // 32 * 16
    let context;

    //ship
    let shipWidth = tileSize*2;
    let shipHeight = tileSize;
    let shipX = tileSize * columns/2 - tileSize;
    let shipY = tileSize * rows - tileSize*2;

    let ship = {
        x : shipX,
        y : shipY,
        width : shipWidth,
        height : shipHeight,
    }

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

    window.onload = function () {
        board = document.getElementById("board");
        board.width = boardWidth;
        board.height = boardHeight;
        context = board.getContext("2d"); //used for drawing on the board

        //draw initial ship
        // context.fillStyle="green";
        // context.fillRect(ship.x, ship.y, ship.width, ship.height);

        //Load images
        shipImg = new Image();
        shipImg.src = "../bilder/ship.png";
        shipImg.onload = function () {
            context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
        }

        alienImg = new Image();
        alienImg.src = "../bilder/alien-cyan.png";
        alienImg.onload = function () {
        createAliens(); // Call createAliens only when the alien image is loaded.
        };

        requestAnimationFrame(update);
        document.addEventListener("keydown", moveShip);
    }

    function update() {
        requestAnimationFrame(update);

        context.clearRect(0, 0, board.width, board.height)

        //ship
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

        //aliens
        for (let i = 0; i < alienArray.length; i++) {
            let alien = alienArray[i];
            if (alien.alive) {
                context.drawImage(alien.img, alien.x, alien.y, alien.width, alien.height);
            }
        }
    }

    function moveShip(e) {
        if (e.code == "ArrowLeft" && ship.x - shipVelocityx >= 0) {
            ship.x -= shipVelocityx; //move left one tile
        }
        else if (e.code == "ArrowRight" && ship.x + shipVelocityx + ship.width <= board.width) {
            ship.x += shipVelocityx; //move right one tile
        }
    }
    
    function createAliens() {
        for (let c = 0; c < alienColumns; c++) {
            for (let r = 0; r < alienRows; r++) {
                let alien = {
                    img : alienImg,
                    x : alienX + c*alienWidth,
                    y : alienY + r*alienHeight,
                    width : alienWidth,
                    height : alienHeight,
                    alive : true,
                }
                alienArray.push(alien);
            }
        }
        alienCount = alienArray.length;
    }