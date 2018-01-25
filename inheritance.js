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


/// 
// inheritance 2

// Сравнение мысленных моделей

// Мы рассмотрим абстрактный код ("Foo", "Bar"), и сравним два способа его реализации (OO против OLOO).
// Первый фрагмент кода использует классический ("прототипный") OO стиль:

function Foo(who) {
	this.me = who;
}
Foo.prototype.identify = function() {
	return "I am " + this.me;
};

function Bar(who) {
	Foo.call( this, who );
}
Bar.prototype = Object.create( Foo.prototype );

Bar.prototype.speak = function() {
	alert( "Hello, " + this.identify() + "." );
};

var b1 = new Bar( "b1" );
var b2 = new Bar( "b2" );

b1.speak();
b2.speak();

// Родительский класс Foo наследуется дочерним классом Bar, 
// после чего создаются два экземпляра этого класса b1 и b2. 
// В результате b1 делегирует Bar.prototype, который делегирует Foo.prototype. 
// Все выглядит довольно знакомо, ничего особенного.

// Теперь давайте реализуем ту же самую функциональность, используя код в стиле OLOO:

var Foo = {
	init: function(who) {
		this.me = who;
	},
	identify: function() {
		return "I am " + this.me;
	}
};

var Bar = Object.create( Foo );

Bar.speak = function() {
	alert( "Hello, " + this.identify() + "." );
};

var b1 = Object.create( Bar );
b1.init( "b1" );
var b2 = Object.create( Bar );
b2.init( "b2" );

b1.speak();
b2.speak();

// Мы используем преимущество делегирования [[Prototype]] от b1 к Bar, и от Bar к Foo, 
// аналогично тому, как сделали это в предыдущем примере с b1, Bar.prototype, и Foo.prototype. 
// У нас по-прежнему есть те же самые 3 объекта, связанные вместе.