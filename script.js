const authContainer = document.getElementById("auth-container");
const typingApp = document.getElementById("typing-app");
const authTitle = document.getElementById("auth-title");
const authAction = document.getElementById("auth-action");
const toggleAuth = document.getElementById("toggle-auth");
const signupLink = document.getElementById("signup-link");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

let isLogin = true;

signupLink.addEventListener("click", () => {
    isLogin = !isLogin;
    if (isLogin) {
        authTitle.innerText = "Login";
        authAction.innerText = "Login";
        toggleAuth.innerHTML = `Don't have an account? <span id="signup-link">Sign Up</span>`;
    } else {
        authTitle.innerText = "Sign Up";
        authAction.innerText = "Sign Up";
        toggleAuth.innerHTML = `Already have an account? <span id="signup-link">Login</span>`;
    }
});

authAction.addEventListener("click", () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (isLogin) {
        const storedUser = localStorage.getItem(username);
        if (storedUser && storedUser === password) {
            alert("Login successful!");
            authContainer.style.display = "none";
            typingApp.style.display = "block";
        } else {
            alert("Invalid credentials.");
        }
    } else {
        if (username && password) {
            localStorage.setItem(username, password);
            alert("Signup successful! Please log in.");
            isLogin = true;
            authTitle.innerText = "Login";
            authAction.innerText = "Login";
        } else {
            alert("Please fill in both fields.");
        }
    }
});

// Typing App Code
let errorElement = document.getElementById("error");
let timerElement = document.getElementById("timer");
let accuElement = document.getElementById("accu");
let wpmElement = document.getElementById("wpm");
let textElement = document.getElementById("text");
let inputElement = document.getElementById("input");
let startButton = document.getElementById("start");
let resetButton = document.getElementById("reset");
let easyButton = document.getElementById("easy-btn");
let mediumButton = document.getElementById("medium-btn");
let hardButton = document.getElementById("hard-btn");

// Difficulty levels with different sentence arrays
let easyArr = [
    "The sun sets in the west.",
    "I love ice cream.",
    "She is reading a book.",
    "He runs fast.",
    "The cat is cute."
];
let mediumArr = [
    "Learning to code is both fun and challenging.",
    "The quick brown fox jumps over the lazy dog.",
    "It is important to stay hydrated during the summer.",
    "She enjoys painting in her free time.",
    "They traveled to the mountains last weekend."
];
let hardArr = [
    "Artificial intelligence is revolutionizing various industries globally.",
    "There are two types of clauses: independent and non-independent/interdependent. An independent clause realises a speech act such as a statement, a question, a command or an offer.",
    "A non-independent clause does not realise any act. A non-independent clause (simplex or complex) is usually logically related to other non-independent clauses.",
    "Together, they usually constitute a single independent clause (complex). For that reason, non-independent clauses are also called interdependent.",
    "Understanding machine learning involves mastering both theory and practical implementation."
];

// Default text array
let arr = easyArr; // Start with easy level
let isModeSelected = false; // Track if a mode has been selected

// Timer functionality
let timeElapsed = 0;
let interval;
let text = "";
let errors = 0;
let typedChars = 0;
let correctWords = 0;
let accuracy = 0;
let wpm = 0;
let typingStarted = false;

const updateUI = () => {
    errorElement.innerText = errors;
    accuElement.innerText = accuracy + "%";
    wpmElement.innerText = wpm;
};

const highlightText = (inputText) => {
    let highlightedText = "";
    for (let i = 0; i < text.length; i++) {
        if (inputText[i] === text[i]) {
            highlightedText += `<span class="correct">${inputText[i]}</span>`;
        } else if (i < inputText.length) {
            highlightedText += `<span class="incorrect">${inputText[i]}</span>`;
        } else {
            highlightedText += text[i]; // Append remaining correct text without highlighting
        }
    }
    textElement.innerHTML = highlightedText;
};

// Difficulty buttons functionality
easyButton.addEventListener("click", () => {
    arr = easyArr;
    isModeSelected = true;
    alert("Easy mode selected");
});

mediumButton.addEventListener("click", () => {
    arr = mediumArr;
    isModeSelected = true;
    alert("Medium mode selected");
});

hardButton.addEventListener("click", () => {
    arr = hardArr;
    isModeSelected = true;
    alert("Hard mode selected");
});

// Start typing functionality
startButton.addEventListener("click", () => {
    if (!isModeSelected) {
        alert("Please select a difficulty mode (Easy, Medium, or Hard) before starting.");
        return;
    }

    inputElement.value = "";
    inputElement.disabled = false;
    inputElement.focus();
    text = arr[Math.floor(Math.random() * arr.length)];
    textElement.innerText = text;
    errors = 0;
    typedChars = 0;
    correctWords = 0;
    accuracy = 0;
    wpm = 0;
    typingStarted = false;
    updateUI();
});

resetButton.addEventListener("click", resetApp);

inputElement.addEventListener("input", (e) => {
    const typedText = e.target.value;

    if (!typingStarted) {
        typingStarted = true;
        // Start timer based on difficulty
        switch (arr) {
            case easyArr:
                startTimer(60); // 60 seconds for easy
                break;
            case mediumArr:
                startTimer(45); // 45 seconds for medium
                break;
            case hardArr:
                startTimer(30); // 30 seconds for hard
                break;
        }
    }

    typedChars++;
    errors = 0;

    highlightText(typedText);

    // Check if the typed text exceeds the original text
    if (typedText.length > text.length) {
        alert("You have typed more than the given text");
        inputElement.value = typedText.substring(0, text.length);
        return; // Prevent further processing
    }

    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] !== text[i]) {
            errors++;
        }
    }

    if (typedText.length >= text.length) {
        if (typedText.trim() === text.trim()) {
            const formattedAlert = `You have entered the correct text! Moving to the next text..\n` +
                `Accuracy: ${accuracy}%\n` +
                `WPM: ${wpm}\n` +
                `Time Elapsed: ${timerElement.innerText}`;
            alert(formattedAlert);

            resetApp();
            startButton.click();
            return;
        }
    }

    if (typedText.endsWith(' ') || typedText.length >= text.length) {
        const wordsTyped = typedText.trim().split(' ').length;
        correctWords = Math.min(wordsTyped, text.trim().split(' ').length);
        wpm = Math.round((correctWords / (timeElapsed / 60)) || 0);
    }

    accuracy = Math.round(((typedChars - errors) / typedChars) * 100) || 0;
    updateUI();
});

function startTimer(duration) {
    timeElapsed = 0;
    timerElement.innerText = "00:00";
    interval = setInterval(() => {
        timeElapsed++;
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        timerElement.innerText = `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;

        // Stop the timer after the specified duration and alert the user
        if (timeElapsed >= duration) {
            clearInterval(interval);
            alert(`Time is up! Your typing session has ended. Retry once again \nAccuracy: ${accuracy}%\nWPM: ${wpm}`);
            resetApp();
        }
    }, 1000);
}

function resetApp() {
    clearInterval(interval);
    inputElement.value = "";
    inputElement.disabled = true;
    textElement.innerText = "Sample text goes here....";
    errorElement.innerText = "0";
    timerElement.innerText = "00:00";
    accuElement.innerText = "0%";
    wpmElement.innerText = "0";
    typingStarted = false;
}
