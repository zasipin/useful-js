
var myObject = {
  // определим геттер для `a`
  get a() {
      return this._a_;
  },
  // определим сеттер для `a`
  set a(val) {
      this._a_ = val * 2;
  }
  };
  myObject.a = 2;
  console.log(myObject._a_); // 4