export interface ParseSuccess<T = unknown> {
  ok: true;
  value: T;
  line?: number;
}

export interface ParseFailure {
  ok: false;
  error: SyntaxError;
  raw: string;
  line?: number;
}

export type ParseResult<T = unknown> = ParseSuccess<T> | ParseFailure;

export interface ChunkParser<T = unknown> {
  push(chunk: string): ParseResult<T>[];
  flush(): ParseResult<T>[];
  reset(): void;
}

function toSyntaxError(error: unknown): SyntaxError {
  if (error instanceof SyntaxError) {
    return error;
  }

  return new SyntaxError(error instanceof Error ? error.message : String(error));
}

export function parseJson<T = unknown>(input: unknown): ParseResult<T> {
  if (typeof input !== 'string') {
    return { ok: true, value: input as T };
  }

  try {
    return { ok: true, value: JSON.parse(input) as T };
  } catch (error) {
    return { ok: false, error: toSyntaxError(error), raw: input };
  }
}

export function parseMessage<T = unknown>(text: string): ParseResult<T>[] {
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return [];
  }

  const single = parseJson<T>(trimmed);
  if (single.ok) {
    return [single];
  }

  const lines = text.split(/\r?\n/);
  const results: ParseResult<T>[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index];
    if (raw.trim().length === 0) {
      continue;
    }

    const parsed = parseJson<T>(raw);
    results.push({ ...parsed, line: index + 1 });
  }

  return results;
}

export function createChunkParser<T = unknown>(): ChunkParser<T> {
  let buffer = '';
  let lineNumber = 1;

  const parseLine = (raw: string): ParseResult<T> | undefined => {
    const currentLine = lineNumber;
    lineNumber += 1;

    if (raw.trim().length === 0) {
      return undefined;
    }

    const parsed = parseJson<T>(raw);
    return { ...parsed, line: currentLine };
  };

  return {
    push(chunk: string): ParseResult<T>[] {
      buffer += chunk;
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? '';

      const results: ParseResult<T>[] = [];
      for (const line of lines) {
        const parsed = parseLine(line);
        if (parsed) {
          results.push(parsed);
        }
      }

      return results;
    },

    flush(): ParseResult<T>[] {
      if (buffer.length === 0) {
        return [];
      }

      const parsed = parseLine(buffer);
      buffer = '';
      return parsed ? [parsed] : [];
    },

    reset(): void {
      buffer = '';
      lineNumber = 1;
    }
  };
}
