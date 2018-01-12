function delay(timeout){
  return new Promise((resolve, reject)=>{
    setTimeout(function(){ resolve(new Date());}, timeout);
})
}

async function deleayTest(){
let v1 = delay(30);
let v2 = delay(40);
console.log(await v1, (await v2).toString());
}

deleayTest();
