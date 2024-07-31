const handler = require(".");

const obj = {
    publicName: { value: "User80lvl", type: "string" },
    _phone: { value: 79990000011, type: "number" },
    phone() {
        let phoneValue = this._phone.value.toString();
        return "+" + phoneValue.slice(0, 4) + "*****" + phoneValue.slice(-2);
    },
};

const proxy = new Proxy(obj, handler);

console.log(Reflect.ownKeys(proxy));
console.log(proxy.publicName);
console.log(proxy.phone());
console.log(proxy.phone);
proxy.phone = 2;
console.log((proxy._phone = 2));
proxy.publicName = 2;
delete proxy.publicName;
console.log(proxy);
