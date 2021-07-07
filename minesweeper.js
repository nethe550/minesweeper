// ===================== //
//     Minesweeper       //
//  by nethe550 (2021)   //
// under GPL-3.0 license //
// ===================== //

const board_wrapper = document.getElementById("field");

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

    static updateSprite(obj, sprite_offset) {
        obj.style.background = 'url("spritemap.gif")';
        obj.style.backgroundPosition = Utils.getBackgroundOffset(sprite_offset);
    }

    static getBoardDimensions() {
        return [Board.width, Board.height];
    }

    static getTileFromIndex(i, board_obj, return_coords=false) {
        let d = this.getBoardDimensions();
        let row = i / d[0];
        let column = i % d[0];
        let tile = board_obj.getTile(Math.trunc(row), Math.trunc(column));
        if (return_coords) {
            return [Math.trunc(row), Math.trunc(column)];
        }
        return tile;
    }

    static floodFill(board_obj, x, y, adjacent_limit=8) {
        let tile = board_obj.getTile(x, y, true);
        if (tile != null && !tile.open && !tile.is_bomb) {
            if (tile.neighbouring_bombs == 0 && adjacent_limit >= 0) {
                Utils.updateSprite(tile.dom_obj, 'open0');
            }
            if (tile.neighbouring_bombs == 1 && adjacent_limit >= 1) {
                Utils.updateSprite(tile.dom_obj, 'open1');
            }
            if (tile.neighbouring_bombs == 2 && adjacent_limit >= 2) {
                Utils.updateSprite(tile.dom_obj, 'open2');
            }
            if (tile.neighbouring_bombs == 3 && adjacent_limit >= 3) {
                Utils.updateSprite(tile.dom_obj, 'open3');
            }
            if (tile.neighbouring_bombs == 4 && adjacent_limit >= 4) {
                Utils.updateSprite(tile.dom_obj, 'open4');
            }
            if (tile.neighbouring_bombs == 5 && adjacent_limit >= 5) {
                Utils.updateSprite(tile.dom_obj, 'open5');
            }
            if (tile.neighbouring_bombs == 6 && adjacent_limit >= 6) {
                Utils.updateSprite(tile.dom_obj, 'open6');
            }
            if (tile.neighbouring_bombs == 7 && adjacent_limit >= 7) {
                Utils.updateSprite(tile.dom_obj, 'open7');
            }
            if (tile.neighbouring_bombs == 8 && adjacent_limit >= 8) {
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
}

class Tile {
    index = -1;
    dom_obj = null;
    is_bomb = false;
    neighbouring_bombs = 0;
    open = false;
    is_flagged = false;

    constructor(index, is_bomb, neighbouring_bombs, open=false, is_flagged=false) {
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
    }
}

class Board {
    static width = 40;
    static height = 30;
    bombs = 175;
    board = {};

    constructor(width=40, height=30, bombs=175) {
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

        for (let i = 0; i < _neighbours.length; i++) {
            if (_neighbours[i] == null) continue;
            if (_neighbours[i].is_bomb) {
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
                this.board[x][y] = new Tile(
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
        for (let x = 0; x < this.height; x++) {
            for (let y = 0; y < this.width; y++) {
                board_wrapper.appendChild(this.board[x][y].dom_obj);
                if (debug) {
                    if (this.board[x][y].is_bomb) {
                        Utils.updateSprite(this.board[x][y].dom_obj, 'bombdied');
                    } else {
                        switch (this.board[x][y].neighbouring_bombs) {
                            case 0:
                                Utils.updateSprite(this.board[x][y].dom_obj, 'open0');
                                break;
                            case 1:
                                Utils.updateSprite(this.board[x][y].dom_obj, 'open1');
                                break;
                            case 2:
                                Utils.updateSprite(this.board[x][y].dom_obj, 'open2');
                                break;
                            case 3:
                                Utils.updateSprite(this.board[x][y].dom_obj, 'open3');
                                break;
                            case 4:
                                Utils.updateSprite(this.board[x][y].dom_obj, 'open4');
                                break;
                            case 5:
                                Utils.updateSprite(this.board[x][y].dom_obj, 'open5');
                                break;
                            case 6:
                                Utils.updateSprite(this.board[x][y].dom_obj, 'open6');
                                break;
                            case 7:
                                Utils.updateSprite(this.board[x][y].dom_obj, 'open7');
                                break;
                            case 8:
                                Utils.updateSprite(this.board[x][y].dom_obj, 'open8');
                                break;
                            default:
                                alert(`Unexpected Error: Too many bombs surrounding tile (${x}, ${y}).`)
                                throw new Exception(`Too many neighboring bombs! (${x}, ${y}) (drawBoard)`);
                        }
                    }
                }
            }
        }
    }

    updateBoard = () => {
        for (let x = 0; x < this.height; x++) {
            for (let y = 0; y < this.width; y++) {
                if (this.board[x][y].open) {
                    switch (this.board[x][y].neighbouring_bombs) {
                        case 0:
                            Utils.updateSprite(this.board[x][y].dom_obj, 'open0');
                            break;
                        case 1:
                            Utils.updateSprite(this.board[x][y].dom_obj, 'open1');
                            break;
                        case 2:
                            Utils.updateSprite(this.board[x][y].dom_obj, 'open2');
                            break;
                        case 3:
                            Utils.updateSprite(this.board[x][y].dom_obj, 'open3');
                            break;
                        case 4:
                            Utils.updateSprite(this.board[x][y].dom_obj, 'open4');
                            break;
                        case 5:
                            Utils.updateSprite(this.board[x][y].dom_obj, 'open5');
                            break;
                        case 6:
                            Utils.updateSprite(this.board[x][y].dom_obj, 'open6');
                            break;
                        case 7:
                            Utils.updateSprite(this.board[x][y].dom_obj, 'open7');
                            break;
                        case 8:
                            Utils.updateSprite(this.board[x][y].dom_obj, 'open8');
                            break;
                        default:
                            alert(`Unexpected Error: Too many bombs surrounding tile (${x}, ${y}).`)
                            throw new Exception(`Too many neighboring bombs! (${x}, ${y}) (drawBoard)`);
                    }
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

    constructor(debug=false) {
        this.debug = debug;
    }

    init = () => {
        this.board = new Board();
        this.board.createBoard();
        this.board.drawBoard(this.debug);
        this.updateUI(this.board.bombs);
    }

    cleanup = () => {
        this.board = {};
        board_wrapper.innerHTML = '';
    }

    gameOver = () => {
        alert('Game Over!');
        console.log('Game Over!');
        this.cleanup();
        this.init();
    }

    updateUI = () => {
        let num_of_flags = 0;
        for (let x = 0; x < game.board.height; x++) {
            for (let y = 0; y < game.board.width; y++) {
                let tile = game.board.getTile(x, y);
                if (tile.is_flagged) {
                    num_of_flags++;
                }
            }
        }

        let sign = document.getElementById('sign');
        let h = document.getElementById('h');
        let t = document.getElementById('t');
        let o = document.getElementById('o');

        let bombs_left = this.board.bombs - num_of_flags;

        let _sign, _h, _t, _o = 0;
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

        

        Utils.updateSprite(sign, _sign);
        Utils.updateSprite(h, _h.toString());
        Utils.updateSprite(t, _t.toString());
        Utils.updateSprite(o, _o.toString());
    }
}


// Driver Code
let game = new Game();
game.init();

document.addEventListener('click', (e) => {
    if (e.target.hasAttribute('pos')) {
        let tile = Utils.getTileFromIndex(parseInt(e.target.getAttribute('pos')), game.board);
        if (tile.is_bomb) {
            Utils.updateSprite(tile.dom_obj, 'bombdied');
            game.gameOver();
        }
        else {
            let coords = Utils.getTileFromIndex(parseInt(e.target.getAttribute('pos')), game.board, true);

            if (tile.open) return;
            if (tile.is_flagged) return;

            Utils.floodFill(game.board, coords[0], coords[1]);
        }
    }
});

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();

    if (e.target.hasAttribute('pos')) {
        let tile = Utils.getTileFromIndex(parseInt(e.target.getAttribute('pos')), game.board);
        
        if (!tile.open) {
            tile.is_flagged = !tile.is_flagged;
        }

        if (tile.is_flagged) {
            Utils.updateSprite(tile.dom_obj, 'flagged');
        }
        else {
            if (tile.open) {
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
                        alert(`Unexpected Error: Too many bombs surrounding tile (${x}, ${y}).`)
                        throw new Exception(`Too many neighboring bombs! (${x}, ${y}) (onclick)`);
                }
            }
            else {
                Utils.updateSprite(tile.dom_obj, 'blank');
            }
        }
    }
    return false;
});

// ui update independent of game
let fps = 1000 / 10; // 10 fps
setInterval(() => {
    game.updateUI();
}, fps);