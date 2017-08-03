/**
 * @Author    xmit
 * @DateTime  2017-08-02
 * @copyright [copyright]
 * @license   [license]
 * @version   [0.1.0]
 * @param     {[type]}    url     [jsonp link]
 * @param     {[type]}    params  [Object]
 * @param     {[type]}    timeout [number]
 * @return    {[type]}            [Promise]
 * @example
 *
 * jsonp('https://www.ip.net/json/', {units:'si',lang:'zh'}, 5000)
 *
 */
function jsonp(url, params, timeout = 5000) {
  return new Promise(function(resolve, reject) {
    let callbackname = '___JSONP_CALLBACK___' + Date.now() + Math.random().toString().substr(2)
    let script = document.createElement('script')
    script.src = url.indexOf('?') > -1 ? url + "&" + serialize(params) + '&callback=' + callbackname : url + '?' + serialize(params) + '&callback=' + callbackname
    // 加载成功
    window[callbackname] = function(data) {
      clearTimeout(timerid)
      removeScript()
      resolve(data)
    }
    // 加载失败
    script.onerror = function() {
      reject(new Error('Script loading error.'))
      clearTimeout(timerid)
      removeScript()
    }
    // 加载超时
    let timerid = setTimeout(function() {
      reject(new Error('JSONP request timed out.'))
      removeScript()
    }, timeout)
    document.body.append(script)

    // 删除script标签
    function removeScript() {
      delete window[callbackname]
      document.body.removeChild(script)
    }
    // 序列化
    function serialize(params) {
      let result = ""
      for (let key in params) {
        result += key + "=" + params[key] + '&'
      }
      return result.slice(0, result.length - 1)
    }
  })
}
