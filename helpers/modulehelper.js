module.exports = {
    section: function (name, options) {
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
    },
    ifeq: function (a, b, options) {
        if (a == b) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    ifneq: function (a, b, options) {
        if (a != b) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    jsonparse: function (content) {
        return JSON.stringify(content);
    }
}