var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz?-';
function CharsToBits(chars){
  var bits = '';
  chars.split('').forEach(function(_char) {
    var i = characters.indexOf(_char);
    if (i != -1)
      bits += (64 + i).toString(2).substring(1);
  });
  if (bits.length < 144 || bits.length % 144 != 0)
    return 'invalid';
  bits = bits.split('');
  var lines = [];
  while(bits.length > 0)
    lines.push(ParseFrom144(bits.splice(0, 144)));
  return lines.join('\n');
}
function GetCheckByte(bytes){
  // do the check digit
  var sum = 0;
  for (let i = 0; i < 17; i++)
    sum += parseInt(bytes[i], 2);
  sum %= 256;
  var checkByte = (256 + sum).toString(2).substring(1);
  return checkByte;
}
function ParseFrom144(bits){
  var checkByte = bits.splice(bits.length - 8).join(''); // splice off the last 8 bits
  var shiftCountByte = bits.splice(bits.length - 8).join(''); // splice off the last 8 bits
  // now for the de-shifting of the bits
  var shiftCount = parseInt(shiftCountByte, 2);
  for (let i = 0; i < shiftCount; i++)
    bits.push(bits.shift());
  var bytes = [];
  while(bits.length > 0)
    bytes.push(bits.splice(0, 8).join(''));
  bytes.push(shiftCountByte);

  // calculate the check digit
  var checkByteValid = (checkByte == GetCheckByte(bytes));
  var sum = 0;
  for (let i = 0; i < 17; i++)
    sum += parseInt(bytes[i], 2);
  sum %= 256;

  // throw out the shifting (but might want to keep this in the future; would need to add shifting below though)
  bytes[16] = bytes[16].substring(0,4) + '0000';
  // update the checkByte
  checkByte = GetCheckByte(bytes);

  bytes.push(checkByte);
  var concat = bytes.join(' ');

  if (!checkByteValid)
    concat += ' invalid!'; // not invalid now, but the input was

  var chars = BytesToChars(bytes);
  concat += ' ' + chars.splice(0, 6).join('');
  concat += ' ' + chars.splice(0, 6).join('');
  concat += ' ' + chars.splice(0, 6).join('');
  concat += ' ' + chars.splice(0, 6).join('');
  return concat;
}

function BytesToChars(bytes){ // input: array of 18 bytes. output: array of 24 chars.
  var bytes = bytes.slice(); // clone the array so we do not modify the original
  var bits = bytes.join('');
  bits = bits.split('');
  var chars = [];
  for (let i = 0; i < 24; i++)
    chars.push(characters[parseInt(bits.splice(0,6).join(''), 2)]);
  return chars;
}