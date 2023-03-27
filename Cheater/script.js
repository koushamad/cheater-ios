const apiKey = "test";
const client = "ios";
// Define the WebSocket URL
const serverURL = "wss://cheater-server-mbmu9.ondigitalocean.app/ws";
//const serverURL = "ws://localhost:8080/ws";

// Create a WebSocket connection
var socket;

async function sendTextToWS(text) {
    // Check if the WebSocket connection is open before sending the message
    if (socket.readyState === WebSocket.OPEN) {
        // Create the JSON structure
        const message = {
            apiKey: apiKey,
            client: "mac",
            content: text,
        };

        // Send the JSON structure as a string
        socket.send(JSON.stringify(message));
        console.log('Message sent: ' + text)
    } else {
        console.log('WebSocket connection is not open')
    }
}


function connectToWS() {
    socket = new WebSocket(serverURL);

    socket.addEventListener('open', function(event) {
        console.log('WebSocket connection established')

        var message = {
            apiKey: apiKey,
            client: client,
            content: 'register'
        };

        socket.send(JSON.stringify(message));
    });

    socket.addEventListener('message', function(event) {
        console.log('WebSocket message received:')
        console.log(event)
    });

    socket.addEventListener('close', function(event) {
        console.log('WebSocket connection closed: ')
        console.log(event)
    });

    socket.addEventListener('error', function(event) {
        console.log('WebSocket error: ')
        console.log(event)
    });
}

setTimeout(function() {
    connectToWS();
}, 5000);

function setTextarea(text) {
    document.getElementsByTagName("textarea").item(0).textContent = text
}
