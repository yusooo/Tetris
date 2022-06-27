import BLOCKS from "./blocks.js"

// DOM

const playground = document.querySelector(".playground > ul");
const gameText = document.querySelector(".game-Text");
const scoreDisplay = document.querySelector(".score");
const restartButton = document.querySelector(".game-text > button")


// Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

// variables
let score =0;
let duration = 500;
let downInterval;
let tempMovingItem;

const MovingItem = {
    type: "",
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
    generateNewBlock();
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
function renderBlocks(moveType=""){
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");
    })
    BLOCKS[type][direction].some(block=>{
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvilable = checkEmpty(target);
        if(isAvilable){
           target.classlist.add(type, "moving")
        } else {
            tempMovingItem = {...MovingItem}
            if(moveType === 'retry'){
                clearInterval(downInterval)
                showGameoverText()
            }
            setTimeout(()=>{
                renderBlocks('retry')
                if(moveType === "top"){
                    seizeBlock();
                }
            }, 0)
            return true;
        }
    }) 
    MovingItem.left = left;
    MovingItem.top = top;
    MovingItem.direction = direction;
}
function seizeBlock(){

    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    checkMatch()
}
function checkMatch(){
    const childNodes = playground.childNodes;
    childNodes.forEach(child=>{
        let matched = true;
        child.children[0].childNodes.forEach(li=>{
            if(!li.classList.contains("seized")){
                matched = false;
            }
        }) 
        if(matched){
            child.remove();
            prependNewLine();
            score++;
            scoreDisplay.innerText = score;
        }
    })
    generateNewBlock()
}
function generateNewBlock(){

    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock('top', 1);
    }, duration)

    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random() * blockArray.length)

    MovingItem.type = "blockArray[randomIndex][0]"
    MovingItem.top = 0;
    MovingItem.left = 3;
    MovingItem.direction = 0;
    tempMovingItem = {...MovingItem};
    renderBlocks()
}
function checkEmpty(target){
    if(!target || target.classList.contains("seized")){
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
function dropBlock(){
    clearInterval(downInterval);
    downInterval = setInterval(()=>{
        moveBlock("top, 1")
    }, 10)
}
function showGameoverText(){
    gameText.style.display = "flex"
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
        case 32:
            dropBlock();
            break;
        default:
            break;
    }
})

restartButton.addEventListener("click",()=>{
    playground.innerHTML = "";
    gameText.style.display = "none"
    init()
})