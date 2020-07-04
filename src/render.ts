// Define all necessary types here.

type Content = {
  blocks: unknown[];
};

export function render(content: Content | string): string {
  return '<p>\n<em>Not implemented yet. Read the instructions. &rarr;</em>\n</p>';

  // If `content` is a string, the return value should simply be the string
  // enclosed in <p></p>. Otherwise, `content` is a pre-parsed structure of
  // objects corresponding to the example JSON (for which you should have
  // defined a typing before implementing this function). In that case
  // implement the JSON parsing and rendering to (string-encoded) HTML.
}
