// DOM

const playground = document.querySelector(".playground > ul");

// Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

// variables
let score =0;
let duration = 500;
let downInterval;
let tempMovingItem;

const BLOCKS = {
    tree: [
        [[2,1], [0,1], [1,0], [1,1]], 
        [[1,2], [0,1], [1,0], [1,1]],
        [[1,2], [0,1], [2,1], [1,1]],
        [[2,1], [1,2], [1,0], [1,1]],
    ]
}

const MovingItem = {
    type: "tree",
    direction: 0,
    top: 0,
    left: 0,
};

init();

// functions
function init(){
    tempMovingItem = {...MovingItem};
    for(let i=0; i<GAME_ROWS;i++){
       prependNewLine()
    }
    renderBlocks();
}
function prependNewLine(){
    const li = document.createElement("li");
    const ui = document.createElement("ui");
    for(let j=0;j<10;j++){
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul)
    playground.prepend(li)
}
function renderBlocks(){
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");
    })
    BLOCKS[type][direction].forEach(block=>{
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvilable = checkEmpty(target);
        if(isAvilable){
           target.classlist.add(type, "moving")
        } else {
            tempMovingItem = {...MovingItem}
            setTimeout(()=>{
                renderBlocks()
                if(moveType === "top"){
                    seizeBlock();
                }
            }, 0)
        }
    }) 
    MovingItem.left = left;
    MovingItem.top = top;
    MovingItem.direction = direction;
}
function seizeBlock(){
    console.log('seize block')
}
function checkEmpty(target){
    if(!target){
        return false;
    }
    return true;
}
function moveBlock(moveType, amount){
    tempMovingItem[moveType] += amount;
    renderBlocks();
}
function chageDirection(){
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction =0 : tempMovingItem.direction += 1;
    renderBlocks()
}

// event handling
document.addEventListener("keydown", e=>{
    switch(e.keyCode){
        case 39:
            moveBlock("left", 1);
            break;
        case 37:
            moveBlock("left", -1);
            break;
        case 40:
            moveBlock("top", 1);
            break;
        case 38:
            chageDirection();
            break;
        default:
            break;
    }
})