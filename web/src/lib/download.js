/**
 * The download endpoint is behind authMiddleware, so a plain `<a href>` would
 * be sent without the Authorization header and 401. Fetch the bytes with the
 * token, then hand the browser an object URL to save.
 */
export async function fetchAttachmentBlob({ baseUrl, taskId, attachmentId, token }) {
  const response = await fetch(
    `${baseUrl}/tasks/${taskId}/attachments/${attachmentId}/download`,
    { headers: token ? { authorization: `Bearer ${token}` } : {} }
  );

  if (!response.ok) {
    let message = `Download failed (${response.status})`;

    try {
      const payload = await response.json();
      message = payload?.error?.message ?? message;
    } catch {
      // Non-JSON error body; keep the status-based message.
    }

    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response.blob();
}

export function saveBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName || "download";
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Give the browser a tick to start the save before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
