// ===================== //
//     Minesweeper       //
//  by nethe550 (2021)   //
// under GPL-3.0 license //
// ===================== //


// handles multiple minesweeper instances
let dom_board_wrappers = document.getElementsByClassName("field");
let dom_displays = {};

let board_wrappers = {};
for (let i = 0; i < dom_board_wrappers.length; i++) {
    board_wrappers[i] = {};
    board_wrappers[i]['obj'] = dom_board_wrappers[i];
    board_wrappers[i]['display'] = document.getElementsByClassName(i.toString());
}

class Utils {
    static getRandomIntBetweenRange(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    static getBackgroundOffset(sprite_name) {
        switch (sprite_name) {
            case 'blank':
                return '0 -39px';
            case 'open0':
                return '0 -23px';
            case 'open1':
                return '-16px -23px';
            case 'open2':
                return '-32px -23px';
            case 'open3':
                return '-48px -23px';
            case 'open4':
                return '-64px -23px';
            case 'open5':
                return '-80px -23px';
            case 'open6':
                return '-96px -23px';
            case 'open7':
                return '-112px -23px';
            case 'open8':
                return '-128px -23px';
            case 'flagged':
                return '-16px -39px';
            case 'bombdied':
                return '-32px -39px';
            case 'badflag':
                return '-48px -39px';
            case 'goodflag':
                return '-64px -39px';
            case 'question':
                return '-80px -39px';
            case 'questionpress':
                return '-96px -39px';
            case 'face':
                return '0 -55px';
            case 'facepress':
                return '-26px -55px';
            case 'faceooh':
                return '-52px -55px';
            case 'facedead':
                return '-78px -55px';
            case 'facewin':
                return '-104px -55px';
            case '0':
                return '0 0';
            case '1':
                return '-13px 0';
            case '2':
                return '-26px 0';
            case '3':
                return '-39px 0';
            case '4':
                return '-52px 0';
            case '5':
                return '-65px 0';
            case '6':
                return '-78px 0';
            case '7':
                return '-91px 0';
            case '8':
                return '-104px 0';
            case '9':
                return '-117px 0';
            case '-':
                return '-130px 0';
            default:
                return '0 0';
        }
    }

    static updateSprite(obj, sprite_name) {
        obj.style.background = 'url("spritemap.gif")';
        obj.style.backgroundPosition = Utils.getBackgroundOffset(sprite_name);
    }

    static getBoardDimensions(board_instance) {
        return [
            board_instance['game_instance']['board']['x'], 
            board_instance['game_instance']['board']['y']
        ];
    }

    static getTileFromIndex(i, board_obj, return_coords=false) {
        let row = i / board_obj.width;
        let column = i % board_obj.width;
        let tile = board_obj.getTile(Math.trunc(row), Math.trunc(column));
        if (return_coords) {
            return [Math.trunc(row), Math.trunc(column)];
        }
        return tile;
    }

    static floodFill(board_obj, x, y) {
        let tile = board_obj.getTile(x, y, true);
        if (tile != null && !tile.open && !tile.is_bomb) {
            if (tile.neighbouring_bombs == 0) {
                Utils.updateSprite(tile.dom_obj, 'open0');
            }
            if (tile.neighbouring_bombs == 1) {
                Utils.updateSprite(tile.dom_obj, 'open1');
            }
            if (tile.neighbouring_bombs == 2) {
                Utils.updateSprite(tile.dom_obj, 'open2');
            }
            if (tile.neighbouring_bombs == 3) {
                Utils.updateSprite(tile.dom_obj, 'open3');
            }
            if (tile.neighbouring_bombs == 4) {
                Utils.updateSprite(tile.dom_obj, 'open4');
            }
            if (tile.neighbouring_bombs == 5) {
                Utils.updateSprite(tile.dom_obj, 'open5');
            }
            if (tile.neighbouring_bombs == 6) {
                Utils.updateSprite(tile.dom_obj, 'open6');
            }
            if (tile.neighbouring_bombs == 7) {
                Utils.updateSprite(tile.dom_obj, 'open7');
            }
            if (tile.neighbouring_bombs == 8) {
                Utils.updateSprite(tile.dom_obj, 'open8');
            }
            if (tile.neighbouring_bombs > 8) {
                alert(`Unexpected Error: Too many bombs surrounding tile (${x}, ${y}).`)
                throw new Exception(`Too many neighboring bombs! (${x}, ${y}) (floodFill)`);
            }
                
            tile.open = true;
            if (tile.neighbouring_bombs == 0) {
                this.floodFill(board_obj, x - 1, y - 1);
                this.floodFill(board_obj, x - 1, y    );
                this.floodFill(board_obj, x - 1, y + 1);
                this.floodFill(board_obj, x    , y - 1);
                this.floodFill(board_obj, x    , y + 1);
                this.floodFill(board_obj, x + 1, y - 1);
                this.floodFill(board_obj, x + 1, y    );
                this.floodFill(board_obj, x + 1, y + 1);
            }
        }
    }

    static startupGame = (board_instance, debug=false) => {
        let game = null;
        game = new Game(board_instance, debug);
        game.init();
        return game;
    }

    static updateSpriteFromNeighbouringBombs(tile) {
        switch (tile.neighbouring_bombs) {
            case 0:
                Utils.updateSprite(tile.dom_obj, 'open0');
                break;
            case 1:
                Utils.updateSprite(tile.dom_obj, 'open1');
                break;
            case 2:
                Utils.updateSprite(tile.dom_obj, 'open2');
                break;
            case 3:
                Utils.updateSprite(tile.dom_obj, 'open3');
                break;
            case 4:
                Utils.updateSprite(tile.dom_obj, 'open4');
                break;
            case 5:
                Utils.updateSprite(tile.dom_obj, 'open5');
                break;
            case 6:
                Utils.updateSprite(tile.dom_obj, 'open6');
                break;
            case 7:
                Utils.updateSprite(tile.dom_obj, 'open7');
                break;
            case 8:
                Utils.updateSprite(tile.dom_obj, 'open8');
                break;
            default:
                alert(`Unexpected Error: Too many bombs surrounding tile (tile ${tile.index}).`)
                throw new Exception(`Too many neighboring bombs! (tile ${tile.index}) (Utils.updateSpriteFromNeighbouringBombs)`);
        }
    }

    static mapFlagCountDisplay(bombs_left) {
        let _sign, _h, _t, _o = '0';

        let remaining = bombs_left.toString().split('');
        if (remaining.length == 2 && bombs_left > 0) {
            remaining.unshift('0');
        }
        if (remaining.length == 1 && bombs_left >= 0) {
            remaining.unshift('0', '0');
        }
        if (remaining.indexOf('-') != -1) {
            _sign = '-';
        }
        else {
            _sign = '0';
        }
        if (remaining.indexOf('-') != -1 && remaining.length == 2) {
            remaining.push(remaining[remaining.length - 1]);
            remaining[1] = '0';
        }
        if (remaining.indexOf('-') != -1 && remaining.length >= 4) {
            _h = parseInt(remaining[1]);
            _t = parseInt(remaining[2]);
            _o = parseInt(remaining[3]);
        }
        else {
            _h = parseInt(remaining[0]);
            _t = parseInt(remaining[1]);
            _o = parseInt(remaining[2]);
        }
        return [_sign, _h, _t, _o];
    }

    static getDisplayObjects(id) {
        for (let element in board_wrappers[id]['display']) {
            if (board_wrappers[id]['display'][element].id == "sign") 
            { sign = board_wrappers[id]['display'][element] }

            if (board_wrappers[id]['display'][element].id == "h")
            { h = board_wrappers[id]['display'][element] }

            if (board_wrappers[id]['display'][element].id == "t")
            { t = board_wrappers[id]['display'][element] }

            if (board_wrappers[id]['display'][element].id == "o")
            { o = board_wrappers[id]['display'][element] }
        }
        return [sign, h, t, o];
    }

    static getIDFromBoardInstance(board_instance) {
        let id;
        for (let board_wrapper in board_wrappers) {
            if (board_instance.className.indexOf(board_wrapper) != -1) {
                id = board_wrapper;
            }
        }
        return id;
    }
}

class Tile {
    board = null;
    index = -1;
    dom_obj = null;
    is_bomb = false;
    neighbouring_bombs = 0;
    open = false;
    is_flagged = false;

    constructor(board, index, is_bomb, neighbouring_bombs, open=false, is_flagged=false) {
        this.board = board;
        this.index = index;
        this.createDOMObj();
        this.set(is_bomb, neighbouring_bombs, open, is_flagged);
    }

    get = () => {
        return {
            index: this.index,
            is_bomb: this.is_bomb,
            neighbouring_bombs: this.neighbouring_bombs,
            open: this.open,
            is_flagged: this.is_flagged
        };
    }

    set = (is_bomb=false, neighbouring_bombs=null, open=false, is_flagged=false) => {
        this.is_bomb = is_bomb;
        this.neighbouring_bombs = neighbouring_bombs;
        this.open = open;
        this.is_flagged = is_flagged;
    }

    createDOMObj = () => {
        this.dom_obj = document.createElement("div");
        this.dom_obj.style.width = this.dom_obj.style.height = "16px";
        this.dom_obj.style.display = 'inline-block';
        this.dom_obj.style.padding = '0px';
        this.dom_obj.style.margin = '0px';
        Utils.updateSprite(this.dom_obj, 'blank');
        this.dom_obj.setAttribute('pos', this.index);
        this.dom_obj.setAttribute('board', this.board);
    }
}

class Board {
    static width = null;
    static height = null;
    bombs = null;
    board = {};
    board_instance = -1;

    constructor(board_instance=null, width=40, height=30, bombs=175) {
        this.board_instance = board_instance;
        this.width = width;
        this.height = height;
        this.bombs = bombs;
    }

    get = () => {
        return this.board;
    }

    set = (board) => {
        this.board = board;
    }

    getTile = (x, y, suppress_null=false) => {
        try {
            return this.board[x][y];
        }
        catch (e) {
            if (!suppress_null) {
                console.log(`Could not find tile at (${x}, ${y}), probably because the tile does not exist.`);
                return null;
            }
        }
    }

    getNeighbouringTiles = (x, y) => {
        let t_l, t, t_r, l, r, b_l, b, b_r;
        t_l = t = t_r = l = r = b_l = b = b_r = null;

        let ignore = [];
        if (x - 1 < 0) {
            ignore.push('t_l');
            ignore.push('t');
            ignore.push('t_r');
        }
        if (x + 1 > this.height - 1) {
            ignore.push('b_l');
            ignore.push('b');
            ignore.push('b_r');
        }
        if (y - 1 < 0) {
            ignore.push('t_l');
            ignore.push('l');
            ignore.push('b_l');
        }
        if (y + 1 > this.width - 1) {
            ignore.push('t_r');
            ignore.push('r');
            ignore.push('b_r');
        }

        if (ignore.indexOf('t_l') == -1) {
            try { t_l = this.getTile(x - 1, y - 1, false); } catch (e) { console.log(`Missing t_l: (${x}, ${y})`) } 
        }
        if (ignore.indexOf('t') == -1) {
            try { t   = this.getTile(x - 1, y    , false); } catch (e) { console.log(`Missing t: (${x}, ${y})`)   }
        }
        if (ignore.indexOf('t_r') == -1) {
            try { t_r = this.getTile(x - 1, y + 1, false); } catch (e) { console.log(`Missing t_r: (${x}, ${y})`) }
        }
        if (ignore.indexOf('l') == -1) {
            try { l   = this.getTile(x    , y - 1, false); } catch (e) { console.log(`Missing l: (${x}, ${y})`)   }
        }
        if (ignore.indexOf('r') == -1) {
            try { r   = this.getTile(x    , y + 1, false); } catch (e) { console.log(`Missing r: (${x}, ${y})`)   }
        }
        if (ignore.indexOf('b_l') == -1) {
            try { b_l = this.getTile(x + 1, y - 1, false); } catch (e) { console.log(`Missing b_l: (${x}, ${y})`) }
        }
        if (ignore.indexOf('b') == -1) {
            try { b   = this.getTile(x + 1, y    , false); } catch (e) { console.log(`Missing b: (${x}, ${y})`)   }
        }
        if (ignore.indexOf('b_r') == -1) {
            try { b_r = this.getTile(x + 1, y + 1, false); } catch (e) { console.log(`Missing b_r: (${x}, ${y})`) }
        }

        let num_of_bombs = 0;
        let _neighbours = [t_l, t, t_r, l, r, b_l, b, b_r];

        for (let neighbour of _neighbours) {
            if ( neighbour == null) continue;
            if (neighbour.is_bomb) {
                ++num_of_bombs;
            }
        }
        return {
            neighbours: _neighbours,
            bombs: num_of_bombs
        };
    }

    createBoard = () => {
        let tileIndex = 0;

        for (let x = 0; x < this.height; x++) {
            this.board[x] = {};
            for (let y = 0; y < this.width; y++) { 
                let board_id = Utils.getIDFromBoardInstance(this.board_instance);
                this.board[x][y] = new Tile(
                    board_id,
                    tileIndex,
                    null,
                    0,
                    false,
                    false
                );
                tileIndex++;
            }
        }

        let bomb_tiles = [];
        for (let i = 0; i <= this.bombs; i++) {
            bomb_tiles.push(Utils.getRandomIntBetweenRange(0, (this.width * this.height)));
        }

        tileIndex = 0;

        for (let x = 0; x < this.height; x++) {
            for (let y = 0; y < this.width; y++) {
                let is_bomb = false;
                if (bomb_tiles.indexOf(tileIndex) != -1) {
                    is_bomb = true;
                }
                this.board[x][y].is_bomb = is_bomb;
                tileIndex++;
            }
        }

        for (let x = 0; x < this.height; x++) {
            for (let y = 0; y < this.width; y++) {
                this.board[x][y].neighbouring_bombs = this.getNeighbouringTiles(x, y).bombs;
            }
        }
    }

    drawBoard = (debug=false) => {
        if (this.board_instance == null) {
            console.log("Null board instance. (drawBoard): ", this.board_instance);
        }
        for (let x = 0; x < this.height; x++) {
            for (let y = 0; y < this.width; y++) {
                this.board_instance.appendChild(this.board[x][y].dom_obj);
                if (debug) {
                    if (this.board[x][y].is_bomb) {
                        Utils.updateSprite(this.board[x][y].dom_obj, 'bombdied');
                    } else {
                        let tile = this.board.getTile(x, y);
                        Utils.updateSpriteFromNeighbouringBombs(tile);
                    }
                }
            }
        }
    }

    updateBoard = () => {
        for (let x = 0; x < this.height; x++) {
            for (let y = 0; y < this.width; y++) {
                if (this.board[x][y].open) {
                    let tile = this.board.getTile(x, y);
                    Utils.updateSpriteFromNeighbouringBombs(tile);
                }
                else if (this.board[x][y].is_flagged) {
                    Utils.updateSprite(this.board[x][y].dom_obj, 'flagged');
                }
            }
        }
    }
}

class Game {
    board;
    debug = false;
    board_instance = null;

    num_of_flags = 0;

    constructor(board_instance=null, debug=false) {
        this.board_instance = board_instance;
        this.debug = debug;
    }

    init = () => {
        this.board = new Board(this.board_instance);
        this.board.createBoard();
        this.board.drawBoard(this.debug);
        this.updateUI(this.board.bombs);
    }

    cleanup = () => {
        this.board = {};
        this.board_instance.innerHTML = '';
    }

    gameOver = () => {
        alert('Game Over!');
        console.log('Game Over!');
        this.cleanup();
        this.init();
    }
    
    gameWin = () => {
        this.cleanup();
        this.board.drawBoard(true);
        alert('You Win!');
        console.log('You Win!');
        this.cleanup();
        this.init();
    }

    updateUI = () => {
        this.num_of_flags = 0;
        let num_of_flagged_bombs = 0;
        for (let x = 0; x < this.board.height; x++) {
            for (let y = 0; y < this.board.width; y++) {
                let tile = this.board.getTile(x, y);
                if (tile.is_flagged) {
                    this.num_of_flags++;
                    if (tile.is_bomb) {
                        num_of_flagged_bombs++;
                    }
                }
                if (this.num_of_flags == num_of_flagged_bombs == this.board.bombs) {
                    this.gameWin();
                }
            }
        }
        
        let id = Utils.getIDFromBoardInstance(this.board_instance);
        let display_objs = Utils.getDisplayObjects(id);

        let bombs_left = this.board.bombs - this.num_of_flags;
        let display_out = Utils.mapFlagCountDisplay(bombs_left);

        Utils.updateSprite(display_objs[0], display_out[0]);
        Utils.updateSprite(display_objs[1], display_out[1].toString());
        Utils.updateSprite(display_objs[2], display_out[2].toString());
        Utils.updateSprite(display_objs[3], display_out[3].toString());
    }
}

// Driver Code
for (let board_wrapper in board_wrappers) {
    let obj = board_wrappers[board_wrapper]['obj'];
    
    // start game
    board_wrappers[board_wrapper]['game_instance'] = Utils.startupGame(obj);
    
    // frame update
    let fps = 1000 / 10; // 10 fps
    setInterval(() => {
        board_wrappers[board_wrapper]['game_instance'].updateUI();
    }, fps);

    // left click detection
    board_wrappers[board_wrapper]['obj'].addEventListener('click', (e) => {
        if (e.target.hasAttribute('pos')) {
            let tile = Utils.getTileFromIndex(parseInt(e.target.getAttribute('pos')), board_wrappers[board_wrapper]['game_instance'].board);
            if (tile.is_bomb) {
                Utils.updateSprite(tile.dom_obj, 'bombdied');
                board_wrappers[board_wrapper]['game_instance'].gameOver();
            }
            else {
                let coords = Utils.getTileFromIndex(parseInt(e.target.getAttribute('pos')), board_wrappers[board_wrapper]['game_instance'].board, true);
    
                if (tile.open) return;
                if (tile.is_flagged) return;
    
                Utils.floodFill(board_wrappers[board_wrapper]['game_instance'].board, coords[0], coords[1]);
            }
        }
    });
    
    // right click detection
    board_wrappers[board_wrapper]['obj'].addEventListener('contextmenu', (e) => {
        e.preventDefault();

        if (e.target.hasAttribute('pos') && e.target.hasAttribute("board")) {
            let tile = Utils.getTileFromIndex(parseInt(e.target.getAttribute('pos')), board_wrappers[board_wrapper]['game_instance'].board);
            if (!tile.open) {
                tile.is_flagged = !tile.is_flagged;
            }
            if (tile.is_flagged) {
                Utils.updateSprite(tile.dom_obj, 'flagged');
            }
            else {
                if (tile.open) {
                    updateSpriteFromNeighbouringBombs(tile);
                }
                else {
                    Utils.updateSprite(tile.dom_obj, 'blank');
                }
            }
        }
        return false;
    });
}