// Copyright 2014 Technical Machine, Inc. See the COPYRIGHT
// file at the top-level directory of this distribution.
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

(function (root, factory) {
  if(typeof define === "function" && define.amd) {
    define(factory);
  } else {
    module.exports = factory();
  }
}(this, function() {
    function BGLibError() {
        this.name = "BGLibError";
        this.message = "Generic BGLib Error";
        this.detail = "";
    }

    BGLibError.prototype = new Error();
    BGLibError.prototype.constructor = BGLibError;
    
    return BGLibError;
}));