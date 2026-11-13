// Sprout reads the traceback: one plain-language hint per error, never blaming the learner.
// Grown from the prototype's explain(); now matches real CPython messages.

import type { PyError } from './protocol';
import type { RunResult } from './PythonRuntime';

export function explain(e: PyError): string {
  const m = e.message, at = e.line ? ` on line ${e.line}` : '';
  switch (e.type) {
    case 'TypeError':
      if (/can only concatenate str|must be str, not|unsupported operand.*'str'/.test(m)) return 'You are gluing text to a number. Python will not guess which one you meant. Convert one side first: int(...) to make a number, or str(...) to make text.';
      if (/unsupported operand/.test(m)) return `Those two types cannot be combined with that operator. Check which value${at} is which type; type() will tell you.`;
      if (/not callable/.test(m)) return 'Something is being called with () that is not a function. Did a variable reuse the name of a function, like print or input?';
      if (/missing \d+ required positional argument|takes \d+ positional argument/.test(m)) return 'The function got a different number of values than it expects. Count the arguments in the call and in the def line.';
      return `The value${at} is the wrong type for what you asked it to do. Try type() on it to see what you are holding.`;
    case 'NameError': return 'Python has never seen that name. Check the spelling (capitals count), or give it a value on an earlier line.';
    case 'SyntaxError':
      if (/never closed|unterminated string/.test(m)) return `Something was opened and never closed${at}: a bracket or a quote. Find its partner.`;
      if (/expected ':'/.test(m)) return `Lines that start a block (if, for, while, def) end with a colon${at}.`;
      if (/invalid syntax\. Perhaps you forgot a comma/.test(m)) return `Two values sit side by side${at}. Python wants a comma between them.`;
      return `Python could not read${at || ' a line'}. Look for a missing value after =, an unclosed quote or bracket, or a missing colon.`;
    case 'IndentationError':
    case 'TabError': return `The spaces at the start of line ${e.line ?? '?'} do not line up. Lines in the same block need exactly the same indent; four spaces is the custom.`;
    case 'ValueError':
      if (/invalid literal for int\(\)|could not convert string to float/.test(m)) return 'The type is right but the value is not: that text cannot become a number. Check what is inside the quotes, or what was typed.';
      return 'The value has the right type but an unusable value. The message after ValueError says which.';
    case 'ZeroDivisionError': return 'Dividing by zero has no answer, even aboard the Hortensia. Check the value on the right of / or %.';
    case 'AttributeError': return 'That value does not have that ability. Try type() on it to see what you are holding, then check the spelling of the method.';
    case 'IndexError': return 'You asked for a position past the end. Positions start at 0, so the last one is len(...) - 1.';
    case 'KeyError': return 'That key is not in the dictionary. Check its spelling, or use .get() to supply a default.';
    case 'RecursionError': return 'A function kept calling itself and never stopped. Make sure there is a case that returns without calling again.';
    case 'ModuleNotFoundError':
    case 'ImportError': return 'That module is not available in this in-browser Python. The standard library is here; most outside packages are not.';
    case 'EOFError': return 'input() wanted a line but none came. Type an answer in the console when it asks.';
    case 'KeyboardInterrupt': return 'Stopped. If the program was stuck, look for a loop whose condition never becomes False.';
    case 'MemoryError': return 'The program tried to hold more than the browser allows. Look for a list or string that grows forever.';
    default: return 'Read the last line of the traceback first. It names the problem and usually the line.';
  }
}

/** One-line note for runs that did not finish normally. */
export function interruptionNote(r: RunResult, timeoutMs: number): string | null {
  if (r.interrupted === 'timeout') return `Stopped after ${Math.round(timeoutMs / 1000)} seconds. Long or endless loops are the usual cause.` + (r.restarted ? ' The interpreter was restarted, so earlier variables are gone.' : '');
  if (r.interrupted === 'stopped') return 'Stopped.' + (r.restarted ? ' The interpreter was restarted, so earlier variables are gone.' : '');
  return null;
}
