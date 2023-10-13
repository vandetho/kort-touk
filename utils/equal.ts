export const shallowEqual = (object1: any, object2: any) => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (let key of keys1) {
        if (object1[key] !== object2[key]) {
            return false;
        }
    }
    return true;
};

export const deepEqual = (object1: any, object2: any) => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        if (isDate(val1)) {
            return val1.getTime() === val2.getTime();
        }
        const areObjects = isObject(val1) && isObject(val2);
        if ((areObjects && !deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
            return false;
        }
    }
    return true;
};

export const isObject = (object: any) => {
    return object != null && typeof object === 'object';
};

export const isDate = (date: any) => {
    return date != null && date instanceof Date;
};
