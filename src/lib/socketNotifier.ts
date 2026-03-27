//src/lib/socketNotifier.ts

export async function notifySocket(event: string, data: any) {
  try {
    const serverUrl = process.env.SOCKET_SERVER_URL ?? 'http://localhost:4030/emit';
    await fetch(serverUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, data }),
    });
  } catch (err) {
    console.warn('Socket notify failed', err);
    // non-fatal in dev; if core socket down, continue gracefully
  }
}

export default notifySocket;
