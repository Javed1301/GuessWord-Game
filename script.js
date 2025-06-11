document.addEventListener("DOMContentLoaded", () => {

    const words = ["example", "javascript", "coding", "challenge"];
    const used = new Set(); // To keep track of used words
    let currentWord = "";
    let tries = 0;
    let mistakes = 0;
    let mistake = "";
    let scrambledWord = "";
    let inputCount = 0;
    // console.log("Script loaded");
    const resultDiv = document.getElementById('result');
    const randomButton = document.getElementById('randomButton');
    

    function scrambleWord(word) {
    // Scramble and return the scrambled word
         let tmpWord = word.split('');
        while(tmpWord.length > 0) {
            let idx = Math.floor(Math.random()*tmpWord.length);
            scrambledWord += tmpWord[idx];
            tmpWord.splice(idx, 1); // Remove the letter to avoid duplicates
        }
        
    }

    function generateRandomWord() {
        inputCount = 0;
    
        resultDiv.classList.remove("success", "fail");                            
        if (used.size === words.length) {
        // console.log("All words used, resetting used set");
        used.clear();
        }
        let candidate;
        do {
            const randomIdx = Math.floor(Math.random() * words.length);
            candidate = words[randomIdx];
        } while (used.has(candidate));
        currentWord = candidate;
        used.add(currentWord);
        scrambledWord = ""; // Reset scrambledWord before scrambling
        scrambleWord(currentWord);

        // console.log(`Current word: ${currentWord}`);
        // console.log(scrambledWord);
        document.getElementById("d2").innerHTML = `<h2>${scrambledWord}</h2>`;
        fitTextToContainer();
        document.querySelector("#left-3rd p").innerHTML =`<p>Tries(${tries}/5)</p>`;

        let boxCount = 0;
        const boxes = document.querySelectorAll('.check')
        boxes.forEach(box => {
            boxCount++;
            if(boxCount <= tries) {
                box.style.backgroundColor = '#C951E7';
            }else{
                box.style.backgroundColor = '#97A3B6';
            }
        })
        document.querySelector("#right-3rd p").innerHTML = `Mistakes : ${mistake}`
        
        createInputFields(currentWord.length);
    }

    function createInputFields(length) {
    // Create number of input fields according to the number of letters
        const container = document.getElementById('d4');
        container.innerHTML = ''; // Clear previous inputs

        for(let i = 0;i<length;i++){
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `input-${i}`;
            input.className = 'input-field';
            input.maxLength = 1;
            input.addEventListener('input',handleInput) // Limit to one character
            container.appendChild(input);
        }
        
        fitInputsToContainer();
        const firstInput = container.querySelector('.input-field');
        if (firstInput) firstInput.focus();
        // Focus on the first input field
    }
    
   
    let played = 0;
    

    function handleInput(event) {
        // console.log('Input changed:', event);
        let input = event.target.value.toLowerCase();
        input === "" ?inputCount--: inputCount++;

        const inputs = Array.from(document.querySelectorAll('.input-field'));
       const currentInputIndex = inputs.indexOf(event.target);
       if(input.length === 1){
            if(currentInputIndex<inputs.length-1){
                inputs[currentInputIndex +1].focus();
            }else{
                inputs[0].focus();
            }
       }
        
        console.log(`Input: ${input}, InputCount : ${inputCount}`);

        if(inputCount == currentWord.length) {
            // console.log("All inputs filled");
            checkWord();
        }

    }
   
    function checkWord(){
        console.log("Checking word");
        played++;
        let inputWord = '';
        const inputs = document.querySelectorAll('.input-field');
        inputs.forEach(input => {
            inputWord += input.value.toLowerCase();
        })
        console.log(`Input word: ${inputWord}`);
        if(inputWord === currentWord) {
            // console.log("Correct word!");
            if (played === words.length) {
                resultDiv.innerHTML = `Congratulations! You solved all the words! Your score : ${played*10 - mistakes*3}<br><button id="nextLevelBtn">Next Level</button>`;
                resultDiv.classList.remove("fail");
                resultDiv.classList.add("success");

                // Add event listener for the button
                setTimeout(() => {
                    const nextBtn = document.getElementById("nextLevelBtn");
                    nextBtn.focus(); // Focus on the next button
                    if (nextBtn) {
                        nextBtn.onclick = function() {
                            // Reset all game variables and UI
                            tries = 0;
                            mistakes = 0;
                            mistake = "";
                            played = 0;
                            used.clear();
                            resultDiv.classList.remove("success", "fail");
                            resultDiv.textContent = "";
                            generateRandomWord();
                        };
                    }
                }, 0);
            }
            else{
                resultDiv.textContent = "";
                // console.log("Correct word!YouSolved it!");
                resultDiv.textContent = "Congratulations! You solved it!";
                resultDiv.classList.remove("fail");
                resultDiv.classList.add("success");
                randomButton.focus(); // Focus on the random button
                // generateRandomWord();
            }

            
        }
        else{
            console.log("Incorrect word!");
            tries++;
            for(let i = 0;i<inputWord.length;i++) {
                if(inputWord[i] !== currentWord[i]){
                    mistakes++;
                    mistake += inputWord[i]+", ";
                }
            }

            if(tries > 5 || mistakes >5){
                resultDiv.textContent = "";
                resultDiv.textContent = `Game Over! The correct word was "${currentWord}".`;
                resultDiv.classList.remove("success");
                resultDiv.classList.add("fail"); // or "fail"
                
            }else{
                resultDiv.textContent = "";
                // console.log("Incorrect word!");
                resultDiv.textContent = `Incorrect! You have ${5 - tries} tries left. Mistakes: ${mistake}`;
                resultDiv.classList.remove("success");
                resultDiv.classList.add("fail"); // or "fail"
                document.getElementById("resetButton").focus(); // Focus on the reset button
                

                // resetGame();
            }
           
        }
    }

    function resetGame() {
        inputCount =0;
        resultDiv.classList.remove("success", "fail");  // if you want to hide it
        played--;
        scrambledWord = ""; // Reset scrambledWord before scrambling
        scrambleWord(currentWord);

        // console.log(`Current word: ${currentWord}`);
        // console.log(scrambledWord);
        document.getElementById("d2").innerHTML = `<h2>${scrambledWord}</h2>`;
        fitTextToContainer();
        document.querySelector("#left-3rd p").innerHTML =`<p>Tries(${tries}/5)</p>`;

        let boxCount = 0;
        const boxes = document.querySelectorAll('.check')
        boxes.forEach(box => {
            boxCount++;
            if(boxCount <= tries) {
                box.style.backgroundColor = '#C951E7';
            }
        })
        document.querySelector("#right-3rd p").innerHTML = `Mistakes : ${mistake}`
        
        createInputFields(currentWord.length);
    }

    document
    .getElementById("randomButton")
    .addEventListener("click", generateRandomWord);
    document.getElementById("resetButton").addEventListener("click", resetGame);

    // // Initial load
   

    // Place this at the end of your HTML file, before </body>, or in a script file after the DOM loads
    function fitTextToContainer() {
        const container = document.getElementById('d2');
        const heading = container.querySelector('h2');
        if (!heading) return;

        // Reset font size to maximum
        heading.style.fontSize = '2rem';

        // Reduce font size until it fits
        while (
            (heading.scrollWidth > container.clientWidth || heading.scrollHeight > container.clientHeight) &&
            parseFloat(heading.style.fontSize) > 0.5
        ) {
            heading.style.fontSize = (parseFloat(heading.style.fontSize) - 0.05) + 'rem';
        }
    }

    // Run on page load and whenever the word changes
    // window.addEventListener('DOMContentLoaded', fitTextToContainer);
    // If the word changes dynamically, call fitTextToContainer() after updating the word.

    
    function fitInputsToContainer() {
        // console.log("Fitting inputs to container");
        const container = document.getElementById('d4');
        if (!container) return;
        const inputs = container.querySelectorAll('input[type="text"]');
        if (!inputs.length) return;

        // Reset input size to maximum
        inputs.forEach(input => {
            input.style.width = '3rem';
            input.style.height = '3rem';
            input.style.fontSize = '2rem';
        });

        // Reduce size until all inputs fit within the container's height (single or multiple lines)
        let inputSize = 3; // rem
        let fontSize = 2; // rem
        while (
            container.scrollHeight > container.clientHeight &&
            inputSize > 1
        ) {
            inputSize -= 0.05;
            fontSize -= 0.03;
            inputs.forEach(input => {
                input.style.width = inputSize + 'rem';
                input.style.height = inputSize + 'rem';
                input.style.fontSize = fontSize + 'rem';
            });
        }
    }
    generateRandomWord();
    fitTextToContainer();
    fitInputsToContainer();
    // window.addEventListener('DOMContentLoaded', fitInputsToContainer);
}
);