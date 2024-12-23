import * as Y from 'yjs'

const TOPIC = 'default-room';

const doc = new Y.Doc();

console.log("Bun WS server");

const server = Bun.serve({
    fetch(req, server) {
        // upgrade the request to a WebSocket
        if (server.upgrade(req)) {
            return; // do not return a Response
        }
        return new Response("Upgrade failed", { status: 500 });
    },
    websocket: {
        open(ws) {
            ws.subscribe(TOPIC);
            ws.send(Y.encodeStateAsUpdate(doc));
            console.log("connecting client");
        },
        message(_ws, message) {
            if (typeof message === 'string') {
                throw new Error(':(');
            }
            Y.applyUpdate(doc, new Uint8Array(message));
            server.publish(TOPIC, message);

            const defaultArray = doc.getArray('default');
            console.log(defaultArray.toJSON());
        },
        close(ws, _code, _reason) {
            ws.unsubscribe(TOPIC);
        },
    },

    port: 5800,
});
