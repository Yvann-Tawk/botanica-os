import { describe, it, expect } from 'vitest';
import { runHtmlChecks, allPass, parseHtml, type HtmlCheck } from '../src/lithic/runtime/htmlChecks';

const run = (html: string, checks: HtmlCheck[]) => runHtmlChecks(html, checks);

describe('Lithic HTML check engine', () => {
  it('parses markup inertly without running scripts', () => {
    // a <script> that would throw if executed must simply be inert markup
    const doc = parseHtml('<p id="x">hi</p><script>throw new Error("boom")</script>');
    expect(doc.querySelector('#x')?.textContent).toBe('hi');
    expect(doc.querySelector('script')?.textContent).toContain('boom');
  });

  it('has / count assert element presence and quantity', () => {
    const html = '<ul><li>a</li><li>b</li><li>c</li></ul>';
    expect(allPass(run(html, [
      { kind: 'has', label: 'a list', sel: 'ul' },
      { kind: 'count', label: 'three items', sel: 'li', equals: 3 },
      { kind: 'count', label: 'at least two', sel: 'li', min: 2 },
    ]))).toBe(true);
    expect(run(html, [{ kind: 'count', label: 'four', sel: 'li', equals: 4 }])[0].ok).toBe(false);
    expect(run(html, [{ kind: 'has', label: 'a table', sel: 'table' }])[0].ok).toBe(false);
  });

  it('text matches equals / contains / nonEmpty, whitespace-forgiving', () => {
    const html = '<h1>  Hello   World </h1><p></p>';
    expect(run(html, [{ kind: 'text', label: 'eq', sel: 'h1', equals: 'Hello World' }])[0].ok).toBe(true);
    expect(run(html, [{ kind: 'text', label: 'has', sel: 'h1', contains: 'world' }])[0].ok).toBe(true);
    expect(run(html, [{ kind: 'text', label: 'nonempty', sel: 'p', nonEmpty: true }])[0].ok).toBe(false);
  });

  it('attr checks presence, equals and contains', () => {
    const html = '<a href="https://example.com/page">x</a>';
    expect(allPass(run(html, [
      { kind: 'attr', label: 'has href', sel: 'a', name: 'href', present: true },
      { kind: 'attr', label: 'href contains', sel: 'a', name: 'href', contains: 'example.com' },
    ]))).toBe(true);
    expect(run(html, [{ kind: 'attr', label: 'no target', sel: 'a', name: 'target', present: false }])[0].ok).toBe(true);
  });

  it('absent / every drive accessibility rules', () => {
    expect(run('<div style="color:red">x</div>', [{ kind: 'absent', label: 'no inline style', sel: '[style]' }])[0].ok).toBe(false);
    expect(run('<img src="a.png" alt="A cat"><img src="b.png" alt="A dog">', [{ kind: 'every', label: 'imgs have alt', sel: 'img', name: 'alt' }])[0].ok).toBe(true);
    expect(run('<img src="a.png" alt=""><img src="b.png">', [{ kind: 'every', label: 'imgs have alt', sel: 'img', name: 'alt' }])[0].ok).toBe(false);
  });

  it('order checks document order', () => {
    const html = '<header>h</header><main>m</main><footer>f</footer>';
    expect(run(html, [{ kind: 'order', label: 'header before main', before: 'header', after: 'main' }])[0].ok).toBe(true);
    expect(run(html, [{ kind: 'order', label: 'footer before header', before: 'footer', after: 'header' }])[0].ok).toBe(false);
  });

  it('source and doctype checks inspect raw markup', () => {
    const html = '<!doctype html>\n<html lang="en"><body><!-- a note --></body></html>';
    expect(allPass(run(html, [
      { kind: 'doctype', label: 'has doctype' },
      { kind: 'source', label: 'has a comment', matches: '<!--.*-->' },
      { kind: 'source', label: 'no deprecated center', notMatches: '<center' },
    ]))).toBe(true);
    expect(run('<html></html>', [{ kind: 'doctype', label: 'doctype' }])[0].ok).toBe(false);
  });

  it('a failed check carries a helpful detail', () => {
    const r = run('<p>x</p>', [{ kind: 'has', label: 'needs a heading', sel: 'h1', fail: 'Add an <h1>.' }])[0];
    expect(r.ok).toBe(false);
    expect(r.detail).toBe('Add an <h1>.');
  });
});
