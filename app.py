from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
import uuid

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket) -> str:
        client_id = str(uuid.uuid4())
        await websocket.accept()
        self.active_connections[client_id] = websocket
        return client_id

    def disconnect(self, client_id: str):
        del self.active_connections[client_id]

    async def broadcast(self, type: str, client_id: str, message):
        for websocket in self.active_connections.values():
            await websocket.send_json(
                {"type": type, "sender_id": client_id, "message": message}
            )


manager = ConnectionManager()

app = FastAPI()


@app.websocket("/ws/")
async def websocket_endpoint(websocket: WebSocket):
    # Connect new websocket and inform all clients.
    client_id = await manager.connect(websocket)
    active_clients = list(manager.active_connections.keys())
    await manager.broadcast(
        type="connect",
        client_id=client_id,
        message=active_clients,
    )

    try:
        while True:
            # Broadcast messages to all clients.
            message = await websocket.receive_text()
            # OPTIONAL: validate message here before broadcasting to all clients.
            await manager.broadcast(
                type="message", client_id=client_id, message=message
            )

    except WebSocketDisconnect:
        # Disconnect websocket and inform all clients.
        manager.disconnect(client_id)
        active_clients = list(manager.active_connections.keys())
        await manager.broadcast(
            type="disconnect",
            client_id=client_id,
            message=active_clients,
        )

    except Exception as e:
        await websocket.close()


# Order matters: endpoint for static files should be after websocket endpoint
app.mount("/", StaticFiles(directory="client", html=True), name="client")
