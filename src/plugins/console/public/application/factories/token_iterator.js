"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_iterator_1 = require("../../lib/token_iterator");
function createTokenIterator({ editor, position }) {
    const provider = editor.getTokenProvider();
    return new token_iterator_1.TokenIterator(provider, position);
}
exports.createTokenIterator = createTokenIterator;
