import { highlight } from 'highlight.js';
import { render } from './render';

import 'highlight.js/styles/dark.css';

const EXAMPLE_JSON = './example.json';
const EXAMPLE_HTML = './example.html';
const TOGGLE_$ = '#preview-toggle';
const PREVIEW_SS_KEY = 'previews';
const PREVIEW_SS_HIDDEN = 'hidden';
const PREVIEW_CLASS = 'previews-shown';

const ELEMENT_$S = {
  inputJson: '#input-json',
  outputHtml: '#output-html',
  outputPreview: '#output-preview',
  expectedHtml: '#expected-html',
  expectedPreview: '#expected-preview',
};

window.addEventListener('load', async () => {
  const [inputJson, expectedHtml] = await fetchExample();
  const outputHtml = render(JSON.parse(inputJson));
  renderContent(inputJson, outputHtml, expectedHtml);
  activateToggle();
});

async function fetchExample(): Promise<[string, string]> {
  const [jsonRes, htmlRes] = await Promise.all([fetch(EXAMPLE_JSON), fetch(EXAMPLE_HTML)]);

  return [await jsonRes.text(), await htmlRes.text()];
}

function renderContent(inputJson: string, outputHtml: string, expectedHtml: string): void {
  type ElementMap = { [K in keyof typeof ELEMENT_$S]: HTMLElement };
  const elements: ElementMap = Object.entries(ELEMENT_$S)
    .map(([key, selector]) => {
      const element = document.querySelector(selector);
      if (element == null) {
        throw new Error(`Element with selector "${selector} not found"`);
      }
      return [key, element] as const;
    })
    .reduce((acc, [key, element]) => ({ ...acc, [key]: element }), {} as ElementMap);

  elements.inputJson.innerHTML = highlight('json', inputJson, true).value;
  elements.outputHtml.innerHTML = highlight('html', outputHtml, true).value;
  elements.outputPreview.innerHTML = outputHtml;
  elements.expectedHtml.innerHTML = highlight('html', expectedHtml, true).value;
  elements.expectedPreview.innerHTML = expectedHtml;
}

function activateToggle(): void {
  const toggle: HTMLInputElement | null = document.querySelector(TOGGLE_$);
  if (toggle == null) {
    throw new Error('Preview activation toggle not found');
  }

  toggle.checked = sessionStorage.getItem(PREVIEW_SS_KEY) !== PREVIEW_SS_HIDDEN;
  if (toggle.checked) {
    document.body.classList.add(PREVIEW_CLASS);
  }

  toggle.addEventListener('change', handleToggle);
}

function handleToggle(event: Event): void {
  const toggle = event.target as HTMLInputElement;

  if (toggle.checked) {
    sessionStorage.removeItem(PREVIEW_SS_KEY);
    document.body.classList.add(PREVIEW_CLASS);
  } else {
    sessionStorage.setItem(PREVIEW_SS_KEY, PREVIEW_SS_HIDDEN);
    document.body.classList.remove(PREVIEW_CLASS);
  }
}
