const apiKey = "test";
const client = "ios";
// Define the WebSocket URL
const serverURL = "wss://cheater-server-mbmu9.ondigitalocean.app/ws";

// Create a WebSocket connection
var socket;
var elementTextarea = null

async function connect() {
    socket = new WebSocket(serverURL);
    await connectToWS(socket);
}

async function connectToWS(socket) {
    if (socket.readyState !== WebSocket.OPEN) {
        socket.addEventListener('open', function (event) {
            console.log('WebSocket connection established');

            var message = {
                apiKey: apiKey,
                client: client,
                type: 'register',
                content: 'register'
            };

            socket.send(JSON.stringify(message));

            // Send periodic ping messages to keep the connection alive
            setInterval(function () {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({type: 'ping'}));
                    console.log('Ping sent');
                }
            }, 1000); // Send a ping message every second
        });

        socket.addEventListener('message', function (event) {
            console.log('WebSocket message received:');
            console.log(event);
            let msg = JSON.parse(event.data);
            if (msg.client === client) {
                setTextarea(msg.content);
                if (msg.type === 'ask'){
                    pushButton();
                }
            }
        });

        socket.addEventListener('close', function (event) {
            console.log('WebSocket connection closed: ');
            console.log(event);
        });

        socket.addEventListener('error', function (event) {
            console.log('WebSocket error: ');
            console.log(event);
        });
    }
}

function setTextarea(text) {
    if (elementTextarea === null) {
        elementTextarea = document.getElementsByTagName("textarea").item(0);
    }

    elementTextarea.value = text
}

function pushButton() {
    document.getElementsByTagName("textarea").item(0).nextElementSibling.click()
}


setTimeout(async function () {
    await connect();
}, 1000);
