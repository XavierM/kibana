"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
function createResponseStub(response) {
    const resp = new stream_1.Readable({
        read() {
            if (response) {
                this.push(response);
            }
            this.push(null);
        },
    });
    resp.statusCode = 200;
    resp.statusMessage = 'OK';
    resp.headers = {
        'content-type': 'text/plain',
        'content-length': String(response ? response.length : 0),
    };
    return resp;
}
exports.createResponseStub = createResponseStub;
