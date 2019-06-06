
  function hash2INT32(mystr) {
    var hash = 0;
    var	i;
    if (mystr.length === 0) return hash;
    for (i = 0; i < mystr.length; i++) {
      chr   = mystr.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash+2147483648;
  };