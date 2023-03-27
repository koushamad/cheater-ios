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
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await sendTextToWS(text)
    }
}


async function connect() {
    socket = new WebSocket(serverURL);
    while (true) {
        await connectToWS(socket)
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
}

async function connectToWS(socket) {
    if (socket.readyState !== WebSocket.OPEN) {
        socket.addEventListener('open', function (event) {
            console.log('WebSocket connection established')

            var message = {
                apiKey: apiKey,
                client: client,
                content: 'register'
            };

            socket.send(JSON.stringify(message));
        });

        socket.addEventListener('message', function (event) {
            console.log('WebSocket message received:')
            console.log(event)
            let msg = JSON.parse(event.data);
            if (msg.client === client) {
                setTextarea(msg.content)
                pushButton()
                setTimeout(function () {
                    ask()
                }, 3000)
            }
        });

        socket.addEventListener('close', function (event) {
            console.log('WebSocket connection closed: ')
            console.log(event)
        });

        socket.addEventListener('error', function (event) {
            console.log('WebSocket error: ')
            console.log(event)
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
    let done = false
    let ans = ""
    do {
        let e = getAnsElement()
        let text = convertToMarkdown(e)

        console.log(ans.length === text.length, ans.length, text.length)

        if (ans.length === text.length) {
            await sendTextToWS(text)
            done = true
        } else {
            ans = text
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    } while (done)
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

    // If the element has text content, convert it to Markdown format
    if (element.textContent.trim() !== '') {
        md += element.textContent.trim();
    }

    // Convert any child elements to Markdown format
    for (let i = 0; i < element.children.length; i++) {
        md += convertToMarkdown(element.children[i]);
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
            md = `\`${md.trim()}\``;
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
}, 1000);
