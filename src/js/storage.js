class Storage {
    constructor() {

    }

    set(key, value) {
        localStorage.setItem(key, value);
    }

    setAll(data) {
        var _this = this;
        localStorage.clear();
        Object.keys(data).forEach(function(key) {
            var value = data[key];
            if (typeof value === 'object') value = JSON.stringify(value);
            localStorage.setItem(key, value);
        });
    }

    get(key) {
        return localStorage.getItem(key);
    }

    getAll(filter = '') {
        var data = {};
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            var value = localStorage.getItem(key);
            if (key.startsWith(filter)) {
                if (this.isJSON(value)) data[key] = JSON.parse(value);
                else data[key] = value;
            }
        }
        return data;
    }

    getUniqueKey(key) {
        var index = 2;
        var increment;
        var uniqueKey = key;
        while (localStorage.getItem(uniqueKey) != null) {
            increment = '-' + index;
            index++;
            uniqueKey = key + increment;
        }
        return uniqueKey;
    }

    getUniqueKeyByDate(key) {
        return key + '-' + (new Date().getTime());
    }

    remove(key) {
        localStorage.removeItem(key);
    }

    sort(data, key) {
        // Convert object to array list
        if (typeof data === 'object' && !Array.isArray(data)) {
            data = Object.keys(data).map(function(k) {
                data[k]['key'] = k;
                return data[k];
            });
        }

        // Sort by value
        data.sort(function(a, b) {
            if(a[key] < b[key]) { return -1; }
            if(a[key] > b[key]) { return 1; }
            return 0;
        });
        return data;
    }

    saveToFile(data, name) {
        var blob = new Blob([JSON.stringify(data)], { type: "application/json" });
        saveAs(blob, name);
    }

    loadFromFile(callback) {
        var input = $('<input>', { type: 'file', accept: '.json', multiple: true });
        input.on('change', function(evt) {
            var files = evt.target.files;
            Object.keys(files).forEach(function(index) {
                var file = files[index];
                var reader = new FileReader();
                reader.fileName = file.name;
                reader.onload = function(e) { callback(e.target.result, e.target.fileName); };
                reader.readAsText(file);
            });
        });
        input.click();
    }

    isJSON(str) {
        try { JSON.parse(str); }
        catch (e) { return false; }
        return true;
    }
}