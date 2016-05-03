var isNode = window["Buffer"] && typeof Buffer !== "undefined";

if (isNode)
{
  module.exports = {
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
    },
    writeUInt32LE: function(arr, value, offset) {
      arr.writeUInt32LE(value, offset);
    },
    writeUInt16LE: function(arr, value, offset) {
      arr.writeUInt16LE(value, offset);
    },
    writeUInt8: function(arr, value, offset) {
      arr.writeUInt8(value, offset);
    },
    isBuffer: function(obj) {
      return Buffer.isBuffer(obj);
    }
  }
} else {
  module.exports = {
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
    },
    writeUInt32LE: function(arr, value, offset) {
      new DataView(arr.buffer).setUint32(offset, value, true);
    },
    writeUInt16LE: function(arr, value, offset) {
      new DataView(arr.buffer).setUint16(offset, value, true);
    },
    writeUInt8: function(arr, value, offset) {
      new DataView(arr.buffer).setUint8(offset, value);
    },
    isBuffer: function(obj) {
        return obj.byteLength !== undefined;
    }
  }
}
