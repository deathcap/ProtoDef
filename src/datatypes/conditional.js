var { getField, getFieldInfo, tryDoc} = require('../utils');

module.exports = {
  'switch': [readSwitch, writeSwitch, sizeOfSwitch],
  'option': [readOption, writeOption, sizeOfOption],
};

function readSwitch(buffer, offset, typeArgs, rootNode) {
  var compareTo = getField(typeArgs.compareTo, rootNode);
  var fieldInfo;
  var resultingType;
  var caseDefault;
  if (typeof typeArgs.fields[compareTo] === 'undefined' && typeof typeArgs.default === "undefined")
    throw new Error(compareTo + " has no associated fieldInfo in switch");
  else {
    caseDefault=typeof typeArgs.fields[compareTo] === 'undefined';
    if (caseDefault)
      resultingType = typeArgs.default;
    else
      resultingType = typeArgs.fields[compareTo];
  }
  fieldInfo = getFieldInfo(resultingType);

  return tryDoc(() => this.read(buffer, offset, fieldInfo, rootNode),caseDefault ? "default" : compareTo);
}

function writeSwitch(value, buffer, offset, typeArgs, rootNode) {
  var compareTo = getField(typeArgs.compareTo, rootNode);
  var fieldInfo;
  var caseDefault;
  if (typeof typeArgs.fields[compareTo] === 'undefined' && typeof typeArgs.default === "undefined")
    throw new Error(compareTo + " has no associated fieldInfo in switch");
  else {
    caseDefault=typeof typeArgs.fields[compareTo] === 'undefined';
    if (caseDefault)
      fieldInfo = getFieldInfo(typeArgs.default);
    else
      fieldInfo = getFieldInfo(typeArgs.fields[compareTo]);
  }
  return tryDoc(() => this.write(value, buffer, offset, fieldInfo, rootNode),caseDefault ? "default" : compareTo);
}

function sizeOfSwitch(value, typeArgs, rootNode) {
  var compareTo = getField(typeArgs.compareTo, rootNode);
  var fieldInfo;
  var caseDefault;
  if (typeof typeArgs.fields[compareTo] === 'undefined' && typeof typeArgs.default === "undefined")
    throw new Error(compareTo + " has no associated fieldInfo in switch");
  else {
    caseDefault=typeof typeArgs.fields[compareTo] === 'undefined';
    if (caseDefault)
      fieldInfo = getFieldInfo(typeArgs.default);
    else
      fieldInfo = getFieldInfo(typeArgs.fields[compareTo]);
  }
  return tryDoc(() => this.sizeOf(value, fieldInfo, rootNode),caseDefault ? "default" : compareTo);
}

function readOption(buffer, offset, typeArgs, context) {
  var val = buffer.readUInt8(offset++);
  if (val !== 0) {
    var retval = this.read(buffer, offset, typeArgs, context);
    retval.size++;
    return retval;
  } else {
    return {
      size: 1
    };
  }
}

function writeOption(value, buffer, offset, typeArgs, context) {
  if (value != null) {
    buffer.writeUInt8(1, offset++);
    offset=this.write(value, buffer, offset, typeArgs, context);
  } else {
    buffer.writeUInt8(0, offset++);
  }
  return offset;
}

function sizeOfOption(value, typeArgs, context) {
  return value == null ? 1 : this.sizeOf(value, typeArgs, context) + 1;
}
