Рассмотрим:

function Foo() {
	// ...
}

//Foo.prototype.blah = ...;

var a = new Foo();
//Как выполнить интроспекцию a, чтобы найти его "предка" (делегирующую связь)? 
//Первый подход использует путаницу с "классами":

a instanceof Foo; // true
//Оператор instanceof принимает в качестве операнда слева обычный объект,
// а в качества операнда справа — функцию. instanceof отвечает на следующий вопрос:
// присутствует ли где-либо в цепочке [[Prototype]] объекта a объект, на который указывает Foo.prototype?

Этот фрагмент кода показывает нелепость попыток рассуждать об отношениях между двумя объектами используя семантику "классов" и instanceof:

// вспомогательная утилита для проверки
// связан ли `o1` (через делегирование) с `o2`
function isRelatedTo(o1, o2) {
	function F(){}
	F.prototype = o2;
	return o1 instanceof F;
}

var a = {};
var b = Object.create( a );

isRelatedTo( b, a ); // true
//Внутри isRelatedTo(..) мы временно используем функцию F, 
//меняя значение её свойства .prototype на объект o2, а затем спрашиваем, 
//является ли o1 "экземпляром" F. Ясно, что o1 на самом деле не унаследован 
//от и даже не создан с помощью F, поэтому должно быть понятно, 
//что подобные приемы бессмысленны и сбивают с толку. 
//Проблема сводится к несуразности семантики классов, навязываемой JavaScript, 
//что наглядно показано на примере косвенной семантики instanceof.

//Второй подход к рефлексии [[Prototype]] более наглядный:

Foo.prototype.isPrototypeOf( a ); // true
//Заметьте, что в этом случае нам неинтересна (и даже не нужна) Foo. 
//Нам просто нужен объект (в данном случае произвольный объект с именем Foo.prototype) 
//для сопоставления его с другим объектом. isPrototypeOf(..) отвечает на вопрос: 
//присутствует ли где-либо в цепочке [[Prototype]] объекта a объект Foo.prototype?

//Тот же вопрос, и в точности такой же ответ. Но во втором подходе нам не нужна функция 
//(Foo) для косвенного обращения к её свойству .prototype.

//Нам просто нужны два объекта для выявления связи между ними. Например:

// Просто: присутствует ли `b` где-либо
// в цепочке [[Prototype]] объекта `c`
b.isPrototypeOf( c );
//Заметьте, что в этом подходе вообще не требуется функция ("класс"). 
//Используются прямые ссылки на объекты b и c, чтобы выяснить нет ли между ними связи. 
//Другими словами, наша утилита isRelatedTo(..) уже встроена в язык и называется isPrototypeOf(..).

//Мы можем напрямую получить [[Prototype]] объекта. В ES5 появился стандартный способ сделать это:

Object.getPrototypeOf( a );
//Здесь видно, что ссылка на объект является тем, что мы и ожидаем:

Object.getPrototypeOf( a ) === Foo.prototype; // true
//В большинстве браузеров (но не во всех!) давно добавлена поддержка нестандартного альтернативного способа доступа к [[Prototype]]:

a.__proto__ === Foo.prototype; // true
//Загадочное свойство .__proto__ (стандартизовано лишь в ES6!) "магически" возвращает ссылку на внутреннее 
//свойство [[Prototype]] объекта, что весьма полезно, 
//если вы хотите напрямую проинспектировать (или даже обойти: .__proto__.__proto__...) цепочку.



var foo = {
	something: function() {
		console.log( "Скажи что-нибудь хорошее..." );
	}
};

var bar = Object.create( foo );

bar.something(); // Скажи что-нибудь хорошее...
// Object.create(..) создает новый объект (bar), связанный с объектом, 
// который мы указали (foo), и это дает нам всю мощь (делегирование) механизма [[Prototype]], 
// но без ненужных сложностей вроде функции new, выступающей в роли классов и вызовов 
// конструктора, сбивающих с толку ссылок .prototype и .constructor, и прочих лишних вещей.

// Примечание: Object.create(null) создает объект с пустой (или null) ссылкой [[Prototype]], 
// поэтому этот объект не сможет ничего делегировать. Поскольку у такого объекта нет цепочки прототипов, 
// оператору instanceof (рассмотренному ранее) нечего проверять, и он всегда вернет false. Эти специальные 
// объекты с пустым [[Prototype]] часто называют "словарями", поскольку они обычно используются исключительно 
// для хранения данных в свойствах, потому что у них не может быть никаких побочных эффектов от делегируемых
//  свойств/функций цепочки [[Prototype]], и они являются абсолютно плоскими хранилищами данных.

// Для создания продуманных связей между двумя объектами нам не нужны классы. 
// Нам нужно только лишь связать объекты друг с другом для делегирования, и Object.create(..) дает нам эту связь 
// без лишней возни с классами.

// Полифилл для Object.create()
// Object.create(..) была добавлена в ES5. Вам может понадобиться поддержка пред-ES5 окружения 
// (например, старые версии IE), поэтому давайте рассмотрим простенький частичный полифилл для Object.create(..):

if (!Object.create) {
	Object.create = function(o) {
		function F(){}
		F.prototype = o;
		return new F();
	};
}


// Наиболее популярный способ связать два объекта друг с другом — использовать ключевое слово new с вызовом функции, 
// что помимо четырех шагов (см. главу 2) создаст новый объект, привязанный к другому объекту.

// Этим "другим объектом" является объект, на который указывает свойство .prototype функции, вызванной с new. 
// Функции, вызываемые с new, часто называют "конструкторами", несмотря на то что они не создают экземпляры классов,
//  как это делают конструкторы в традиционных класс-ориентированных языках.