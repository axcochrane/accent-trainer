import { ElevenLabsClient } from "elevenlabs";

let _client: ElevenLabsClient | null = null;

function getClient(): ElevenLabsClient {
  if (!_client) {
    _client = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });
  }
  return _client;
}

export async function textToSpeech(
  text: string,
  voiceId: string,
): Promise<ArrayBuffer> {
  const audio = await getClient().textToSpeech.convert(voiceId, {
    text,
    model_id: "eleven_flash_v2_5",
  });

  const chunks: Uint8Array[] = [];
  for await (const chunk of audio) {
    chunks.push(new Uint8Array(chunk));
  }
  const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result.buffer as ArrayBuffer;
}

export async function speechToText(audioBuffer: ArrayBuffer): Promise<string> {
  const file = new File([audioBuffer], "recording.webm", {
    type: "audio/webm",
  });
  const result = await getClient().speechToText.convert({
    file,
    model_id: "scribe_v1",
  });
  return result.text;
}
