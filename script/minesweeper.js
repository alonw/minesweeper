window.onload = function (){
  var game = MineSweeper(14,14,15);
};

crazy = 0;

var vintageDigitsDisaply = function(defaultNum){
  var numberDisplayed = defaultNum || 0;

}

var dashboard = function(numOfMines, rows, cols){
  var dash = createElement("div");
  dash.setAttribute("class", "dashboard");
}

var mineCell = function(index, isMine, grid){
  var _cellStatus = 'untouched'; //can become either revealed / flag / mine
  var _isMine = isMine;
  var _isFlagged = false;
  var _index = index;
  // console.log("after setting this: index is " + index + ", isMine is " + isMine);

  function getCellStatus() {
    // console.log("_cellStatus of " + _index + " IS " + _cellStatus);
    return _cellStatus;
  }

  function setCellStatus(newStatus){
    _cellStatus = newStatus;
  };

  var cellDom = document.createElement("div");
  cellDom.setAttribute("class", "cell");
  cellDom.setAttribute("id", _index);
  cellDom.addEventListener("click", function(ind){
    if( _isMine ){
      this.setAttribute("class", "cell emptyCell mine");
      grid.gameOver();
    }
    else{
      this.setAttribute("class", "cell emptyCell");
    }
    _cellStatus = 'revealed';
    grid.handleCellClick(this, _index);
  });

  cellDom.addEventListener("contextmenu", function( e ) {
    e.preventDefault();
    if( _cellStatus == "revealed"){
      return;
    }
    toggleFlag(this);
    // this.setAttribute("class", "cell flag");
  });

  function toggleFlag(cellDom){
    // _isFlagged = _isFlagged ? false : true;
    if(_isFlagged){
      _isFlagged = false;
      cellDom.setAttribute("class" , "cell");
      grid.updateFlagsFound(-1);
    } else {
      _isFlagged = true;
      cellDom.setAttribute("class" , "cell flag");
      grid.updateFlagsFound(1);
      // grid.checkFlags(index);
    }
  }

  return {
    cellDom: cellDom,
    isMine: _isMine,
    getCellStatus: getCellStatus,
    setCellStatus: setCellStatus
  };
}



var MineSweeper = function(clmns, rows, numOfMines){
  //console.log('MineSweeper constructor setting ' + clmns + 'X' + rows);
  this.configCols = clmns;
  this.congfigRows = rows,
  this.numOfMines = numOfMines || 5;
  var mineCellNums = [];
  this.cells = [];
  var foundFlags = 0;

  var rnd;
  do {
    rnd = Math.floor( Math.random(i) * this.configCols * this.congfigRows);
    //if num is not in arr of mines
    if( mineCellNums.indexOf( rnd ) === -1 ) {
      //console.log("pushing " + rnd + " to numOfMines");
      mineCellNums.push(rnd);
    } else {
      //console.log("not pushing " + rnd  + " to numOfMines");
    }
  } while( mineCellNums.length < this.numOfMines );
  console.log("mine nums: " + mineCellNums + "***************");
  //var grid = document.getElementById("container");
  var grid = document.createElement("div");
  var dashboard = document.createElement("div");
  dashboard.setAttribute("class", "dashboard");

  //console.log('document.body is ' + document.body);
  //console.log("grid is " + grid);
  document.getElementById('container').appendChild( grid );
  //console.log("next log is get elem for container");
  //console.log(document.getElementById("container"));

  this.grid = grid;
  grid.setAttribute("class", "grid");

  //console.log("this.grid is " + this.grid);
  for(var i=0, genInd =0; i < this.congfigRows; i++){
    for(var j=0; j < this.configCols; j++,  genInd++){
      //console.log("mineCellNums:" + mineCellNums);
      var isMine = (mineCellNums.indexOf(genInd) > -1) ? true : false;
      //console.log("MineSweeper about to create mineCell(" + genInd + "," + isMine + ")");
      var cell = new mineCell(genInd, isMine, this);

      // console.log("cell.cellDom is " + cell.cellDom);
      if(j === 0){
        cell.cellDom.style.clear = "left";
      }
      this.cells[genInd] = cell;

      /*(function(index){

      }(genInd));*/

      this.grid.appendChild(cell.cellDom);

    }
  }

  this.handleCellClick = function(cell, index){

    var inds = []; //[index - rows -1 , index - rows  , index - rows + 1 , index -1 , index + 1 , index + rows -2,  index + rows - 1, index + rows ];
    var rows = this.congfigRows;
    var cols = this.configCols;
    var row =  1 + Math.floor(index / cols);
    // console.log("handleCellClick for index " + index);
    var col = index  % cols + 1;
    var surroundingBombs = 0;

    for(var r=row -1; r<= row +1; r++){
      for( var c=col -1 ; c<= col +1; c++){
        if( (r != row || c != col ) && r > 0 && c > 0 && r <= rows && c <= cols){
          var cellIndex = (r -1) * cols + c - 1;
          if( this.cells[cellIndex].isMine ){
            surroundingBombs++;
            console.log('added surrounding bombs');
          }
          else if( this.cells[cellIndex].getCellStatus() === 'untouched' ){
            console.log("about to call countBombs for cellIndex" + cellIndex);
            this.countBombs(this.cells[cellIndex], cellIndex);
          }
        }
      }
    }

    console.log("surroundingBombs=" + surroundingBombs);
    if(surroundingBombs > 0 ){
      this.cells[index].cellDom.innerHTML = surroundingBombs;
    }
  }

  this.countBombs = function(cell, index){
    // console.log("calculateBombCount for " + cell + "," + index);
    var inds = []; //[index - rows -1 , index - rows  , index - rows + 1 , index -1 , index + 1 , index + rows -2,  index + rows - 1, index + rows ];
    var rows = this.congfigRows;
    var cols = this.configCols;
    var row =  1 + Math.floor(index / cols);
    // console.log(row);
    var col = index  % cols + 1;
    var bombs = 0;

     console.log("countBombs for cell " + index);
    // console.log('row is ' + row + ', col is ' + col);
    // if( this.cells[index].getCellStatus === 'untouched'){
      // console.log('index ' + index + ' still unouched');
      for(var r=row -1; r<= row +1; r++){
        for( var c=col -1 ; c<= col +1; c++){
          if( (r != row || c != col ) && r > 0 && c > 0 && r <= rows && c <= cols){
            var cellIndex = (r -1) * cols + c - 1;
            // console.log('r=' + r + ', c=' + c + ', check bombs in ' + cellIndex);
            // console.log('this.cells[' + cellIndex + '].isMine is ' + this.cells[cellIndex]);
            // console.log('mineCellNums is ' + mineCellNums);
            //  if( mineCellNums.indexOf(cellIndex) > -1 ){
            if(this.cells[cellIndex].isMine){
              bombs++;
            }
          } else{
            // console.log('r=' + r + ', c=' + c + ' no check' );
          }
        }
      }
    // }

    this.cells[index].cellDom.setAttribute("class", "cell emptyCell");
    if(bombs > 0){
      console.log("bombs>0 - it is " + bombs);
      this.cells[index].setCellStatus("numbered");
      // this.cells[cellIndex].cellDom.setAttribute("class", "cell emptyCell");
      console.log('about to udpate cell ' + index + ' to ' + bombs);
      this.cells[index].cellDom.innerHTML = bombs;
    } else{
      this.cells[index].setCellStatus("revealed");
      for(var r=row -1; r<= row +1; r++){
        for( var c=col -1 ; c<= col +1; c++){
          if( (r != row || c != col ) && r > 0 && c > 0 && r <= rows && c <= cols){
            var cellIndex = (r -1) * cols + c - 1;

            // console.log('!!!add call for this.countBombs for index' + cellIndex + ' _cellStatus = ' + this.cells[cellIndex].getCellStatus()  );
            if(this.cells[cellIndex].getCellStatus() == 'untouched' && !this.cells[cellIndex].isMine){
              this.countBombs( this.cells[cellIndex], cellIndex);
            }
          }
        }
      }
    }
    // console.log("indexes for bomb check: " + inds);
    return bombs;
  }

  this.gameOver = function(){
    for(var i=0; i<mineCellNums.length; i++){
      this.cells[mineCellNums[i]].cellDom.setAttribute("class", 'cell emptyCell mine gameover');
    }
  };

  this.gameWon = function(){
    document.querySelector('h1').innerHTML = "You Won!";
  };

  this.updateFlagsFound = function(addition){
    foundFlags += addition;
    console.log('foundFlags updated to ' + foundFlags);
    if( foundFlags === this.numOfMines ){
      this.gameWon();
    }
  };


  return {
    countBombs: this.countBombs
  }
};
