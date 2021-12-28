const btnContainer = document.querySelector('.btn-container');
const imgContainer = document.querySelector('.img-container');
const nextLevelContainer = document.querySelector('.next-level-container');
const questionContainer = document.querySelector('.question-container');
const currentLevel = document.querySelector('.current-level');
const question = document.querySelector('.question');
const wrongAnswersNumber = document.querySelector('.wrong-answers-number');
const nextLevelBtn = document.querySelector('.next-level');
const restartGameBtn = document.createElement('button');
const hintContainer = document.querySelector('.hint-container');
let showHintBtn = document.querySelector('.show-hint');
let wrongAnswers = 0;
let counter = 0;
let level = 1;
let letterBtns = [];
let letters = [];
let imgCounter = 0;
let imageElements = [];
let words = ['kuni', 'diune', 'chereft', 'guze-char'];
let hasWon = false;


btnContainer.style.cssText = 'display: flex; justify-content: center; align-items: center; flex-wrap: wrap; padding: 2em;'
currentLevel.textContent = `Level ${level}`;

//Creating the hagman images and giving an id to each element using a counter (imgCounter)
function createImages() {
    for (let i = 0; i < 7; i++) {
        let img = document.createElement('img');
        img.setAttribute('src', `images/${imgCounter}.jpg`);
        img.setAttribute('id', imgCounter);
        img.classList.add('hangman', 'd-none');
        imgContainer.appendChild(img);
        imageElements.push(img);
        imgCounter++
    }
}
createImages();

// All images got d-none besides the first one
imageElements[0].classList.remove('d-none');


// Creating the buttons of which each one will contain a letter of the alfabet
function createButtons() {
    let alfabet = 'abcdefghijklmnopqrstuvwxyz-';
    let splitAlfabet = alfabet.split('');
    for (let i = 0; i < splitAlfabet.length; i++) {
        let letterBtn = document.createElement('button');
        letterBtn.textContent = splitAlfabet[i];
        letterBtn.classList.add('btn-primary', 'btn', 'm-1', 'fs-4');
        btnContainer.appendChild(letterBtn);
        letterBtns.push(letterBtn);
    }
}

createButtons();

//Adding event listeners to all the button detecting clicks and refereing to the checkLetter function
for (let i = 0; i < letterBtns.length; i++) {
    letterBtns[i].addEventListener('click', checkLetter);
}

// Check whether the clicked letter exist in the hidden word
function checkLetter(e) {
    let selectedLetter = e.target.textContent;
    let splittedWord = words[counter].split("");
    let selectedBtn = e.target;
    selectedBtn.style.cursor = 'not-allowed';
    //If the user clicks a correct letter the color of the button changes to green, it becomes unclickable, and we go to an inner loop
    if (splittedWord.includes(selectedLetter)) {
        selectedBtn.classList.remove('btn-primary');
        selectedBtn.classList.add('btn-success');
        //A loop goes through the hidden word's array to find the letter matching to the selected one. Once it's found, it is displayed. Then 
        // we check if the user won the game. 
        for (let i = 0; i < splittedWord.length; i++) {
            if (splittedWord[i] == selectedLetter) {
                letters[i].textContent = selectedLetter;
                checkForWin();
            }
        }
    // If the user chooses a wrong letter, the wrongAnswers number incremates, the button color changes to red, the current image 
    // gets d-none, and the next image is displayed. The clicked button becomes unclickable.   
    } else {
        wrongAnswers++
        wrongAnswersNumber.textContent = wrongAnswers;
        imageElements[wrongAnswers].classList.remove('d-none');
        imageElements[wrongAnswers - 1].classList.add('d-none');
        selectedBtn.classList.remove('btn-primary');
        selectedBtn.classList.add('btn-danger');
        
        // Once the user makes 6 mistakes, he looses. All letter button become unclickable, and he can only restart the game. 
        if (wrongAnswers === 6) {
            question.textContent = "You have made 6 mistakes. You lost. Press 'Restart' and try again!";
            for (let j = 0; j < letterBtns.length; j++) {
                letterBtns[j].removeEventListener('click', checkLetter);
                letterBtns[j].style.cursor = 'not-allowed';
            }
        }
        selectedBtn.removeEventListener('click', checkLetter);
    }
}

// Once the user has found of the letters of the hidden words (iterating thourgh the letters array and there are no empty strings), he has won.
function checkForWin() {
    let emptyStringsCounter = 0;
    for (let i = 0; i < letters.length; i++) {
        if (letters[i].textContent == "") {
            emptyStringsCounter++
        }
    }
    if (emptyStringsCounter === 0) {

        if(words.length == level){
            question.textContent = 'Cheili chub! You have found all the words! You won the game!';

        }else{
            question.textContent = "Cheili chub! You have found the word! You win!";
            nextLevelBtn.classList.add('animate');
            level++
            for (let j = 0; j < letterBtns.length; j++) {
                letterBtns[j].removeEventListener('click', checkLetter);
                letterBtns[j].style.cursor = 'not-allowed';
            }
            
            //Only if the user has won he can move on to the next level
            hasWon = true;
            activateNextLevelBtn();
        }
    }
}


// Creating the hidden word
function createQuestions(word) {
    let splittedWord = word.split("");
    console.log(splittedWord);
    for (let i = 0; i < splittedWord.length; i++) {
        let letter = document.createElement('p');
        letter.textContent = "";
        letter.style.cssText = "width: 1em; height:1.5em; border-bottom: 1px solid #FEE3EC; margin: 5px;";
        letter.classList.add('letter');
        questionContainer.appendChild(letter);
        letters.push(letter);

    }
}

createQuestions(words[counter]);

nextLevelBtn.classList.add('fs-lg-4');

//Moveing to the next level is possible only if the user won 
function activateNextLevelBtn(){
if(hasWon===true){
    nextLevelBtn.addEventListener('click', goToNextLevel);
    }
};

// clearing out the score and the word  
function goToNextLevel(){
    nextLevelBtn.classList.remove('animate');
    counter++;
    letters = [];
    questionContainer.innerHTML = "";
    question.textContent = "Guess the persian word!"
    currentLevel.textContent = `Level ${level}`;
    wrongAnswers = 0;
    wrongAnswersNumber.textContent = 0;
    
    //Removing current hint and loading the next one
    let currentHint = document.getElementById(hintCounter);
    currentHint.style.display= 'none';
    hintCounter++;

    // Loading the next hidden word
    createQuestions(words[counter]);
    for (let i = 0; i < letterBtns.length; i++) {
        letterBtns[i].addEventListener('click', checkLetter);
        letterBtns[i].style.cursor = 'pointer';
        letterBtns[i].classList.remove('btn-danger', 'btn-success');
        letterBtns[i].classList.add('btn-primary');
    }

    // Removing the images and displaying the first one
    removeImages();
    imageElements = [];
    imgCounter = 0;
    createImages();
    imageElements[0].classList.remove('d-none');

    // Since the user started the next level, hasWon is set to false
    hasWon = false;
    nextLevelBtn.removeEventListener('click', goToNextLevel); 
};


// The removing images logic. Looping through the image elements array and removing all the elements from the html.
function removeImages() {
    imgCounter = 0;
    for (let i = 0; i < imageElements.length; i++) {
        let removeImg = document.getElementById(imgCounter);
        removeImg.remove();
        imgCounter++;
    }
};


restartGameBtn.textContent = "Restart Game";
restartGameBtn.classList.add('btn', 'btn-info', 'restart-button');
nextLevelContainer.appendChild(restartGameBtn);
restartGameBtn.addEventListener('click', restartGame);

// Restart game functionality. Initializing the score
function restartGame() {
    wrongAnswersNumber.textContent = 0;
    wrongAnswers = 0;
    question.textContent = "Guess the programming language!"
    for (let i = 0; i < letters.length; i++) {
        letters[i].remove();

    }

    // Reloading the hidden word
    letters = [];
    createQuestions(words[counter]);

    //Adding the event listeners to the button and changing the color to the original one (blue)
    for (let j = 0; j < letterBtns.length; j++) {
        letterBtns[j].addEventListener('click', checkLetter);
        letterBtns[j].style.cursor = 'pointer';
        letterBtns[j].classList.remove('btn-danger', 'btn-success');
        letterBtns[j].classList.add('btn-primary');
    }

    //Reloading the images
    removeImages();
    imageElements = [];
    imgCounter = 0;
    createImages();
    imageElements[0].classList.remove('d-none');

    //Changing the hint to display none
    let currentHint = document.getElementById(hintCounter);
    currentHint.style.display = 'none';
}


//Creating the hint images
let hintCounter = 7;

function createHintImgs(){
    for(let i=0; i<words.length; i++){
        let hintImage = document.createElement('img'); 
        hintImage.src = `images/${hintCounter}.jpg`;
        hintImage.setAttribute('id', hintCounter);
        hintImage.style.cssText = 'width: 25%; position:absolute; display:none;'
        hintImage.classList.add('hint-img');
        hintContainer.appendChild(hintImage);
        hintCounter++;
    }
    hintCounter = 7
}

createHintImgs();


//Creating the show hint functionality
showHintBtn.addEventListener('click', showHint);
function showHint(){
    let currentHint = document.getElementById(hintCounter);
    currentHint.style.display= 'block';
}