export default class ExArray<T> extends Array<any> {

    findById = (
        id
    ) => {
        return this.find((obj) => obj.id === id);
    };

    removeItem = (
        item
    ) => {
        return this.splice(this.indexOf(item), 1)
    };

    wipeItem = (
        item
    ) => {
        return this[this.indexOf(item)] = null
    };
}