const chatOutput = document.getElementById('chat-output');
const submitBtn = document.getElementById('submit-button');
const remainingContent = document.getElementById('remaining-content');
const newButton = document.getElementById('new');

window.onload = function () {
    const programInput = document.getElementById('programInput');
    programInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
};

submitBtn.addEventListener('click', () => {
    const programCode = document.getElementById('programInput').value;
    explainProgram(programCode);
});

function explainProgram(programCode) {
    fetch('/code-debug', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: programCode }),
    })
        .then((response) => response.json())
        .then((data) => {
            const debug = data.debugged;
            const codeRegex = /```([\s\S]+)```/;
            const codeMatch = debug.match(codeRegex);
            const indentedCode = codeMatch[1].replace(/ /g, '&nbsp;');

            const codeSnippet = document.createElement('pre');
            codeSnippet.innerHTML = indentedCode;

            // Extract the remaining content
            const remainingContentText = debug.replace(codeMatch[0], '');

            displayCodeSnippet(codeSnippet);
            displayRemainingContent(remainingContentText);
        });
}

function displayCodeSnippet(codeSnippet) {
    const codeContainer = document.createElement('div');
    codeContainer.appendChild(codeSnippet);

    const codeElement = document.createElement('div');
    codeElement.appendChild(codeContainer);
    chatOutput.appendChild(codeElement);
    chatOutput.scrollTop = chatOutput.scrollHeight;
}

function displayRemainingContent(content) {
    remainingContent.textContent = content;
    remainingContent.style.marginTop = '10px';
}

// Get the copy button element
const copyButton = document.getElementById('copy-button');

// Add a click event listener to the copy button
copyButton.addEventListener('click', () => {
    const codeContainer = chatOutput.querySelector('pre');
    const range = document.createRange();
    range.selectNodeContents(codeContainer);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    selection.removeAllRanges();
    copyButton.textContent = 'Copied!';
    setTimeout(() => {
        copyButton.textContent = 'Copy';
    }, 2000);
});

newButton.addEventListener('click', () => {
    document.getElementById('programInput').value = '';
    remainingContent.textContent = '';
    chatOutput.innerHTML = '';
});
