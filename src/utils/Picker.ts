import * as _ from "lodash";

export class Picker {

    static objPicker(wholeObj, selectiveObj) {
        let response = _.pick(wholeObj, selectiveObj);
        return response;

    }

}