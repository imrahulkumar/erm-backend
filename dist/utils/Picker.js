"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Picker = void 0;
const _ = require("lodash");
class Picker {
    static objPicker(wholeObj, selectiveObj) {
        let response = _.pick(wholeObj, selectiveObj);
        return response;
    }
}
exports.Picker = Picker;
