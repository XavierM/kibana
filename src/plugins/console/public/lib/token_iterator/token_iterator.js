"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
function isColumnInTokenRange(column, token) {
    if (column < token.position.column) {
        return false;
    }
    return column <= token.position.column + token.value.length;
}
class TokenIterator {
    constructor(provider, startPosition) {
        this.provider = provider;
        this.currentTokenIdx = -1;
        this.currentPosition = { lineNumber: -1, column: -1 };
        this.tokensLineCache = this.provider.getTokens(startPosition.lineNumber) || [];
        const tokenIdx = this.tokensLineCache.findIndex(token => isColumnInTokenRange(startPosition.column, token));
        if (tokenIdx > -1) {
            this.updatePosition({
                tokenIdx,
                position: this.tokensLineCache[tokenIdx].position,
            });
        }
        else {
            this.updatePosition({ tokenIdx: -1, position: startPosition });
        }
    }
    updateLineTokens(tokens) {
        this.tokensLineCache = tokens;
    }
    updatePosition(info) {
        this.currentTokenIdx = info.tokenIdx;
        this.currentPosition = { ...info.position };
    }
    step(direction) {
        const nextIdx = this.currentTokenIdx + direction;
        let nextToken = this.tokensLineCache[nextIdx];
        // Check current row
        if (nextToken) {
            this.updatePosition({
                tokenIdx: nextIdx,
                position: nextToken.position,
            });
            return nextToken;
        }
        // Check next line
        const nextLineNumber = this.currentPosition.lineNumber + direction;
        const nextLineTokens = this.provider.getTokens(nextLineNumber);
        if (nextLineTokens) {
            this.updateLineTokens(nextLineTokens);
            let idx;
            if (direction > 0) {
                nextToken = nextLineTokens[0];
                idx = 0;
            }
            else {
                nextToken = nextLineTokens[nextLineTokens.length - 1];
                idx = nextToken ? nextLineTokens.length - 1 : 0;
            }
            const nextPosition = nextToken
                ? nextToken.position
                : { column: 1, lineNumber: nextLineNumber };
            this.updatePosition({ tokenIdx: idx, position: nextPosition });
            return nextToken || null;
        }
        // We have reached the beginning or the end
        return null;
    }
    /**
     * Report the token under the iterator's internal cursor.
     */
    getCurrentToken() {
        return this.tokensLineCache[this.currentTokenIdx] || null;
    }
    /**
     * Return the current position in the document.
     *
     * This will correspond to the position of a token.
     *
     * Note: this method may not be that useful given {@link getCurrentToken}.
     */
    getCurrentPosition() {
        return this.currentPosition;
    }
    /**
     * Go to the previous token in the document.
     *
     * Stepping to the previous token can return null under the following conditions:
     *
     * 1. We are at the beginning of the document.
     * 2. The preceding line is empty - no tokens.
     * 3. We are in an empty document - not text, so no tokens.
     */
    stepBackward() {
        return this.step(-1);
    }
    /**
     * See documentation for {@link stepBackward}.
     *
     * Steps forward.
     */
    stepForward() {
        return this.step(1);
    }
    /**
     * Get the line number of the current token.
     *
     * Can be considered a convenience method for:
     *
     * ```ts
     * it.getCurrentToken().lineNumber;
     * ```
     */
    getCurrentTokenLineNumber() {
        const currentToken = this.getCurrentToken();
        if (currentToken) {
            return currentToken.position.lineNumber;
        }
        return null;
    }
    /**
     * See documentation for {@link getCurrentTokenLineNumber}.
     *
     * Substitutes `column` for `lineNumber`.
     */
    getCurrentTokenColumn() {
        const currentToken = this.getCurrentToken();
        if (currentToken) {
            return currentToken.position.column;
        }
        return null;
    }
}
exports.TokenIterator = TokenIterator;
