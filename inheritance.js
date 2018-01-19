function Foo(name) {
	this.name = name;
}

Foo.prototype.myName = function() {
	return this.name;
};

function Bar(name,label) {
	Foo.call( this, name );
	this.label = label;
}

// здесь мы создаем `Bar.prototype`
// связанный с `Foo.prototype`
Bar.prototype = Object.create( Foo.prototype );

// Осторожно! Теперь `Bar.prototype.constructor` отсутствует,
// и это придется "пофиксить" вручную, 
// если вы привыкли полагаться на подобные свойства!

Bar.prototype.myLabel = function() {
	return this.label;
};

var a = new Bar( "a", "obj a" );

a.myName(); // "a"
a.myLabel(); // "obj a"

//******* es6 */
// пред-ES6
// выбрасывает стандартный существующий `Bar.prototype`
Bar.prototype = Object.create( Foo.prototype );

// ES6+
// изменяет существующий `Bar.prototype`
Object.setPrototypeOf( Bar.prototype, Foo.prototype );


// wrong 
//*************
// работает не так, как вы ожидаете!
Bar.prototype = Foo.prototype;

// работает почти так, как нужно,
// но с побочными эффектами, которые возможно нежелательны :(
Bar.prototype = new Foo();