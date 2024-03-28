const chatOutput = document.getElementById('chat-output');
const submitBtn = document.getElementById('submit-button');
const newbutton=document.getElementById('new-button');

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

    fetch('/explain-program', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: programCode }),
    })
        .then((response) => response.json())
        .then((data) => {
            const explanation = data.explanation;
            displayMessage('Explanation: ' + explanation);
        });

   
}


function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    chatOutput.appendChild(messageElement);
    chatOutput.scrollTop = chatOutput.scrollHeight;
}
 // Get the copy button element
        const copyButton = document.getElementById("copy-button");

        
        copyButton.addEventListener("click", () => {
            // Get the chat output element
            const chatOutput = document.getElementById("chat-output");

            // Create a range and select the chat output content
            const range = document.createRange();
            range.selectNodeContents(chatOutput);

            // Create a selection and add the range to it
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Execute the copy command
            document.execCommand("copy");

            // Deselect the text
            selection.removeAllRanges();

            // Provide some visual feedback
            copyButton.textContent = "Copied!";
            setTimeout(() => {
                copyButton.textContent = "Copy";
            }, 2000);
        });
newbutton.addEventListener('click', () => {
    const programInput = document.getElementById('programInput');
    programInput.value = '';

    const messageElements = document.querySelectorAll('#chat-output div');
    messageElements.forEach(element => element.remove());
});