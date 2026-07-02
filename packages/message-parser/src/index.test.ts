import { describe, expect, it } from 'vitest';
import { createChunkParser, parseJson, parseMessage } from './index';

describe('@a2ui/message-parser', () => {
  it('parses a single JSON message', () => {
    expect(parseJson<{ type: string }>('{"type":"createSurface"}')).toEqual({
      ok: true,
      value: { type: 'createSurface' }
    });

    expect(parseMessage('{"type":"deleteSurface"}')).toEqual([
      { ok: true, value: { type: 'deleteSurface' } }
    ]);
  });

  it('parses JSONL and reports bad lines without stopping later lines', () => {
    const results = parseMessage('{"type":"a"}\nnot json\n{"type":"b"}');

    expect(results[0]).toMatchObject({ ok: true, value: { type: 'a' }, line: 1 });
    expect(results[1]).toMatchObject({ ok: false, raw: 'not json', line: 2 });
    expect(results[2]).toMatchObject({ ok: true, value: { type: 'b' }, line: 3 });
  });

  it('parses JSONL chunks across push calls', () => {
    const parser = createChunkParser<{ n: number }>();

    expect(parser.push('{"n":1}\n{"n"')).toEqual([{ ok: true, value: { n: 1 }, line: 1 }]);
    expect(parser.push(':2}\nnope\n')).toHaveLength(2);

    const trailing = parser.push('{"n":3}');
    expect(trailing).toEqual([]);
    expect(parser.flush()).toEqual([{ ok: true, value: { n: 3 }, line: 4 }]);
  });
});
