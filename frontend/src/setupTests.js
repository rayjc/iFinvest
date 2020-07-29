// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

const createContextualFragment = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.children[0]; // so hokey it's not even funny
};

global.document.createRange = () => ({
  setStart: () => { },
  setEnd: () => { },
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
  createContextualFragment,
});