document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatBox = document.getElementById('chat-box');

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        appendMessage(message, 'user');
        userInput.value = '';

        translate(message);
    }

    function appendMessage(message, sender) {
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('chat-message', `${sender}-message`);

        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message-bubble');
        messageBubble.textContent = message;

        messageWrapper.appendChild(messageBubble);
        chatBox.appendChild(messageWrapper);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function translate(text) {
        const maxChunkSize = 450;
        const chunks = [];
        for (let i = 0; i < text.length; i += maxChunkSize) {
            chunks.push(text.substring(i, i + maxChunkSize));
        }

        const context = "Translate from English to Hindi: ";
        const promises = chunks.map(chunk => {
            const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(context + chunk)}&langpair=en|hi`;
            return fetch(url)
                .then(response => response.json())
                .then(data => data.responseData.translatedText);
        });

        Promise.all(promises)
            .then(translations => {
                const translatedText = translations.join('');
                appendMessage(translatedText, 'bot');
            })
            .catch(error => {
                console.error('Error translating:', error);
                appendMessage('Sorry, something went wrong.', 'bot');
            });
    }
});
