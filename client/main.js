// Variables to manage the app.
const input = document.getElementById("messageText");
const submitButton = document.getElementById("submitButton");
const messages = document.getElementById("messages");
const activeUsersDiv = document.getElementById("activeUsers");

// Initially disable the button.
submitButton.disabled = true;

input.addEventListener("input", function () {
  // Disable form while input value (after trimming) is empty.
  submitButton.disabled = !input.value.trim();
});

function sendMessage(event) {
  ws.send(input.value);
  input.value = "";
  submitButton.disabled = true;
  event.preventDefault();
}

// Variables to manage the websocket.
const ws = new WebSocket(`ws://localhost:8000/ws/`);
let client_id;

ws.onopen = function () {
  // Provide UI feedback that connection is open.
};

ws.onclose = handleClose;
ws.onerror = handleError;

function handleClose(event) {
  input.disabled = true;
  submitButton.disabled = true;

  if (event.wasClean) {
    alert("Connection closed cleanly");
  } else {
    alert("Connection died");
  }
}

function handleError(error) {
  input.disabled = true;
  submitButton.disabled = true;
  alert("Something unexpected happened");
}

ws.onmessage = function (event) {
  const data = JSON.parse(event.data);

  // If the message type is 'connect' or 'disconnect', update and render active users list
  if (data.type === "connect" || data.type === "disconnect") {
    renderActiveUsers(data.message);
    if (!client_id) {
      client_id = data.sender_id;
      document.querySelector("#ws-id").textContent = client_id;
    }
  } else {
    // For 'message' type, render the message
    renderMessage(data);
  }
};

function renderActiveUsers(activeUsersList) {
  // Clear the active users div
  activeUsersDiv.innerHTML = "";

  // Render the updated list of active users
  activeUsersList.forEach((userId) => {
    const userDiv = document.createElement("div");
    userDiv.textContent = userId === client_id ? `You (${userId})` : userId;
    activeUsersDiv.appendChild(userDiv);
  });
}

function renderMessage(data) {
  const messageDiv = document.createElement("div");
  const content = document.createTextNode(data.message);

  if (data.type === "message") {
    const clientIdElement = document.createElement("div");
    clientIdElement.classList.add("text-sm", "font-bold");
    const clientIdText = document.createTextNode(
      data.sender_id === client_id ? `You (${data.sender_id})` : data.sender_id
    );
    clientIdElement.appendChild(clientIdText);
    messageDiv.appendChild(clientIdElement);
  }

  const messageContent = document.createElement("p");
  messageContent.classList.add("mt-1", "px-4", "py-2", "rounded");

  if (data.type !== "message") {
    messageContent.classList.add("bg-gray-200");
  } else if (data.sender_id === client_id) {
    messageContent.classList.add("bg-green-200");
  } else {
    messageContent.classList.add("bg-blue-200");
  }

  messageContent.appendChild(content);
  messageDiv.appendChild(messageContent);
  messages.appendChild(messageDiv);
}
