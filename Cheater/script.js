const apiKey = "test";
const client = "ios";
// Define the WebSocket URL
const serverURL = "wss://cheater-server-mbmu9.ondigitalocean.app/ws";
//const serverURL = "ws://localhost:8080/ws";

// Create a WebSocket connection
var socket;
var ans = "";
var asked = true;

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
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await sendTextToWS(text)
    }
}

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
                content: 'register'
            };

            socket.send(JSON.stringify(message));

            // Send periodic ping messages to keep the connection alive
            setInterval(function () {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({type: 'ping'}));
                    console.log('Ping sent');
                }
            }, 1000); // Send a ping message every 30 seconds
        });

        socket.addEventListener('message', function (event) {
            console.log('WebSocket message received:');
            console.log(event);
            let msg = JSON.parse(event.data);
            if (msg.client === client) {
                setTextarea(msg.content);
                pushButton();
                setTimeout(function () {
                    ask();
                }, 3000);
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
    document.getElementsByTagName("textarea").item(0).textContent = text
}

function pushButton() {
    document.getElementsByTagName("textarea").item(0).nextElementSibling.click()
}

async function ask() {
    ans = ""
    asked = true
    setInterval(checkAns, 5000);
}

function checkAns() {
    if (asked) {
        asked = false
        let e = getAnsElement()
        let text = convertToMarkdown(e) + "\n\n"

        console.log(ans.length === text.length, ans.length, text.length)

        if (ans.length === text.length) {
            sendTextToWS(text)
            console.log('Answer sent: ' + text)
        } else {
            ans = text
            asked = true
            console.log('Waiting for answer...');
        }
    }
}

function getAnsElement() {
    var elements = document.getElementsByClassName("flex flex-col items-center text-sm");
    if (elements.length > 0) {
        var childNodes = elements[0].childNodes;
        return childNodes[childNodes.length - 2];
    } else {
        return ""
    }
}

function convertToMarkdown(element) {
    let md = '';

    // Get the element's tag name
    let tagName = element.tagName.toLowerCase();

    if (tagName === 'button' || tagName === 'spam') {
        return ""
    }

    // If the element has text content, convert it to Markdown format
    if (element.textContent.trim() !== '') {
        md += element.textContent.trim();
    }

    // Convert any child elements to Markdown format
    for (let i = 0; i < element.children.length; i++) {
        let result = convertToMarkdown(element.children[i]);

        if (!md.includes(result)) {
            md += result;
        }
    }

    // Add Markdown formatting based on the element's tag name
    switch (tagName) {
        case 'h1':
            md = `# ${md.trim()}\n\n`;
            break;
        case 'h2':
            md = `## ${md.trim()}\n\n`;
            break;
        case 'h3':
            md = `### ${md.trim()}\n\n`;
            break;
        case 'h4':
            md = `#### ${md.trim()}\n\n`;
            break;
        case 'h5':
            md = `##### ${md.trim()}\n\n`;
            break;
        case 'h6':
            md = `###### ${md.trim()}\n\n`;
            break;
        case 'p':
            md = `${md.trim()}\n\n`;
            break;
        case 'ul':
            md = `${md.trim()}\n`;
            break;
        case 'li':
            md = `- ${md.trim()}\n`;
            break;
        case 'br':
            md = `${md.trim()}\n`;
            break;
        case 'blockquote':
            md = `> ${md.trim()}\n\n`;
            break;
        case 'code':
            md = `\n\n\`${md.trim()}\n\n\``;
            break;
        case 'pre':
            md = `\`\`\`\n${md.trim()}\n\`\`\`\n\n`;
            break;
        case 'strong':
            md = `**${md.trim()}**`;
            break;
        case 'em':
            md = `*${md.trim()}*`;
            break;
        case 'a':
            md = `[${md.trim()}](${element.getAttribute('href')})`;
            break;
    }

    return md;
}

setTimeout(async function () {
    await connect();
}, 5000);
