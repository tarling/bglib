define(function(){

    var isNode = typeof Buffer !== "undefined";

    if (isNode)
    {
      return {
        readUInt32LE: function(arr, offset) {
          return arr.readUInt32LE(offset);
        },
        readUInt16LE: function(arr, offset) {
          return arr.readUInt16LE(offset);
        },
        readUInt8: function(arr, offset) {
          return arr.readUInt8(offset);
        },
        readInt8: function(arr, offset) {
          return arr.readInt8(offset);
        },
        getByteArray: function(o) {
          return new Uint8Array(o);
        },
        makeBuffer: function(length) {
          return new Buffer(length);
        },
        concatBuffers: function(a, b, len) {
            if (typeof len === "undefined") len = a.byteLength + b.byteLength;
            return Buffer.concat([a,b], len);
        }
      }
    } else {
      return {
        readUInt32LE: function(arr, offset) {
          return new DataView(arr.buffer).getUint32(offset, true);
        },
        readUInt16LE: function(arr, offset) {
          return new DataView(arr.buffer).getUint16(offset, true);
        },
        readUInt8: function(arr, offset) {
          return new DataView(arr.buffer).getUint8(offset);
        },
        readInt8: function(arr, offset) {
          return new DataView(arr.buffer).getInt8(offset);
        },
        getByteArray: function(o) {
          return o;
        },
        makeBuffer: function(length) {
          return new Uint8Array(length)
        },
        concatBuffers: function(a, b, len) {
            if (typeof len === "undefined") len = a.byteLength + b.byteLength;
            var c = new Uint8Array(len);
            c.set(new Uint8Array(a),0);
            c.set(new Uint8Array(b), a.byteLength);
            return c;
        }
      }
    }
});
