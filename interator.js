var myArray = [ 1, 2, 3 ];
for (var v of myArray) {
    console.log( v );
}
// 1
// 2
// 3

var myArray = [ 1, 2, 3 ];
var it = myArray[Symbol.iterator]();
it.next(); // { value:1, done:false }
it.next(); // { value:2, done:false }
it.next(); // { value:3, done:false }
it.next(); // { done:true }


// Для перебора любого объекта можно определить свой собственный стандартный @@iterator. Например:

// Примечание: Мы использовали Object.defineProperty(..) чтобы задать свой @@iterator 
// (в основном для того, чтобы сделать его неперечисляемым), 
// но, используя Symbol как рассчитанное имя свойства (описанное ранее в этой главе), 
// мы могли бы объявить его напрямую, вроде var myObject = { a:2, b:3, [Symbol.iterator]: function(){ /* .. */ } }.


var myObject = {
    a: 2,
    b: 3
};
Object.defineProperty( myObject, Symbol.iterator, {
    enumerable: false,
    writable: false,
    configurable: true,
    value: function() {
        var o = this;
        var idx = 0;
        var ks = Object.keys( o );
        return {
            next: function() {
                return {
                    value: o[ks[idx++]],
                    done: (idx > ks.length)
                };
            }
        };
    }
} );
// перебираем `myObject` вручную
var it = myObject[Symbol.iterator]();
it.next(); // { value:2, done:false }
it.next(); // { value:3, done:false }
it.next(); // { value:undefined, done:true }
// перебираем `myObject` с помощью `for..of`
for (var v of myObject) {
    console.log( v );
}
// 2
// 3
