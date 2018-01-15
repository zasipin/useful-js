// function f(x) {
//   alert( x );
// }

// var f1000 = delay(f, 5000);
// var f1500 = delay(f, 1500);

// f1000("тест"); // выведет "тест" через 1000 миллисекунд
// f1500("тест2"); // выведет "тест2" через 1500 миллисекунд

// function delay(fn, time){
//   var context = this;
//   return function(...args) {
//     setTimeout(function(){ fn.call(context, ...args); }, time);
//   }
// }



// f = debounce(f, 1000);

// f(1); // вызов отложен на 1000 мс
// f(2); // предыдущий отложенный вызов игнорируется, текущий (2) откладывается на 1000 мс

// // через 1 секунду будет выполнен вызов f(1)

// setTimeout( function() { f(3) }, 1100); // через 1100 мс отложим вызов еще на 1000 мс
// setTimeout( function() { f(4) }, 1200); // игнорируем вызов (3)

// // через 2200 мс от начала выполнения будет выполнен вызов f(4)
// function debounce(fn, time){
//   var timerId;
//   var context = this;
//    return function(...args) {
//      if(timerId) clearTimeout(timerId);
//      timerId = setTimeout(function(){ 
//        fn.call(context, ...args);
//        timerId = null;
//      }, time);
//    }
  
// }              


var f = function(a) {
  console.log(a)
};

// затормозить функцию до одного раза в 1000 мс
var f1000 = throttle(f, 1000);

f1000(1); // выведет 1
f1000(2); // (тормозим, не прошло 1000 мс)
f1000(3); // (тормозим, не прошло 1000 мс)
// f1000(4); // (тормозим, не прошло 1000 мс)

//повторяем цикл начиная с 4
setTimeout(f1000.bind(null,4), 1200);//выполнится
setTimeout(f1000.bind(null,5), 2600);//игнорится
setTimeout(f1000.bind(null,6), 2700);//выполнится ч/з 1 сек

// когда пройдёт 1000 мс...
// выведет 3, промежуточное значение 2 игнорируется

function throttle(fn, time){
  var isThrottled;
  
  var lastArgs;
   return function executor(...args) {
     var context = this;
     lastArgs = args;
     if(isThrottled) return;
     
     fn.call(context, ...args);
     isThrottled = true;
     
     timerId = setTimeout(function(){ 
       isThrottled = false;
       
       if(lastArgs !== null){
         executor.call(context, ...lastArgs);
         lastArgs = null;
       }
     }, time);
   }
}