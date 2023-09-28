import { noop } from 'lodash'
import { getFullUrl } from '@/utils/api'
export const chat = (data: any = {}, callbacks = {
  onMessage: noop,
  success: noop,
  fail: noop,
  complete: noop
}) => {
  const url = getFullUrl('submit') || ''
  const requestTask: any = uni.request({
    url,
    responseType: "arraybuffer",
    method: 'POST',
    enableChunked: true,
    header: {
      'content-type': 'application/json',
      token: uni.getStorageSync('token')
    },
    data,
    success: callbacks.success,
    complete: callbacks.complete,
    fail: callbacks.fail
  });
  requestTask.onChunkReceived(function (r: any) {
    const buffer = r.data instanceof ArrayBuffer ? r.data : r.data.buffer
    const text = arrayBufferToString(buffer)
    const textArr = text.split('\n\n') || []
    textArr.forEach(text => {
      if (text.startsWith('data:')) {
        try {
          const str = text.split('data:')[1].trim()
          if (str !== '[DONE]') {
            const data = JSON.parse(str)
            callbacks.onMessage(data)
          }
        } catch (e) { console.error(e) }
      }
    })
  });
}

function arrayBufferToString(arr: any) {
  if (typeof arr === 'string') {
    return arr;
  }
  var dataview = new DataView(arr);
  var ints = new Uint8Array(arr.byteLength);
  for (var i = 0; i < ints.length; i++) {
    ints[i] = dataview.getUint8(i);
  }
  arr = ints;
  var str = '',
    _arr = arr;
  for (var i = 0; i < _arr.length; i++) {
    var one = _arr[i].toString(2),
      v = one.match(/^1+?(?=0)/);
    if (v && one.length == 8) {
      var bytesLength = v[0].length;
      var store = _arr[i].toString(2).slice(7 - bytesLength);
      for (var st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2);
      }
      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      str += String.fromCharCode(_arr[i]);
    }
  }
  return str;
}