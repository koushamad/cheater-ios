const socket = new WebSocket('ws://192.168.178.74:8081/ws');

socket.addEventListener('open', function (event) {
  console.log('WebSocket connection opened!');
});

socket.addEventListener('message', function (event) {
  console.log('Received message from server:', event.data);
});

socket.addEventListener('close', function (event) {
  console.log('WebSocket connection closed:', event);
});

socket.addEventListener('error', function (event) {
  console.log('WebSocket error:', event);
});

setTimeout(function() {
    console.log("kousha");
    
    // Send a message to the server
    const message = 'Hello, server!';
    socket.send(message);
    console.log('Sent message to server:', message);
    
    document.getElementsByTagName("textarea").item(0).textContent = "kousha";
    
}, 5000);
