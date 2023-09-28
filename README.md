# FastAPI WebSocket Chat Room

This project implements a chat room using a Python FastAPI server, a simple HTML/CSS/JS client, and WebSocket communication between the two.

## Getting started

### Prerequisites

- Python 3.7 or higher
- A modern web browser

### Clone the Repository

To get started, you will need to clone the repository to your local machine. Open a terminal and run the following command:

```bash
    git clone https://github.com/cmayoracurzio/websocket-chat-app.git
    cd websocket-chat-app
```

### Install Dependencies

After cloning the repository, navigate to the project's root directory and install the required Python packages using the following command:

```sh
    pip install -r requirements.txt
```

### Start the FastAPI Server

In the project's root directory, run the following command to start the FastAPI server:

```sh
uvicorn app:app --reload
```

The server will start, and you can access the chat application by opening a web browser and navigating to [http://localhost:8000](http://localhost:8000).

### License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).
