import { BootMessage } from '@/types/effects';

export const bootMessages: BootMessage[] = [
  { text: '> Warming up the backend engines...', delay: 0 },
  { text: '> Loading Node.js runtime modules...', delay: 300 },
  { text: '> Connecting AI pipelines (OpenAI, Deepgram)...', delay: 600 },
  { text: '> Initializing SSE dashboard streams...', delay: 900 },
  { text: '> Systems operational. Ready to build something great.', delay: 1200 },
];
