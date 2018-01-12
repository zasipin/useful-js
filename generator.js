// @ts-check

function* genTest() {
  yield 1;
  yield 2;
}

var er = genTest();

console.log(er.next().value);

