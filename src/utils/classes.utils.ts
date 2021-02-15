export function _class(defaultClasses: string, otherClasses: string, bool: boolean): string {
    let classes = defaultClasses;
    if (bool) {
        classes = classes + " " + otherClasses;
    }
    return classes;
}