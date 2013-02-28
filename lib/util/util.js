/**
 * TUNA FRAMEWORK
 *
 * Copyright (c) 2012, Sergey Kononenko
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * * Names of contributors may be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL SERGEY KONONENKO BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


/**
 * @namespace
 */
var util = {};


/**
 * Версия библиотеки.
 *
 * @const
 * @type {string}
 */
util.VERSION = '0.0.1';


/**
 * Является ли текущий браузер Internet Explorer'ом.
 *
 * @const
 * @type {boolean}
 */
util.IS_IE = !!eval("'\v' == 'v'");


/**
 * @namespace
 */
util.dom = {};



/**
 * @constructor
 */
util.__ExtendLink = function() {};


/**
 * Наследование типа.
 *
 * Передает прототип родительского класса дочернему классу без ссылки на
 * него, сохраняя конструктор.
 *
 * @param {!Object} Class Класс который должен наследовать тип.
 * @param {!Object} Parent Родительский класс.
 */
util.inherits = function(Class, Parent) {
  util.__ExtendLink.prototype = Parent.prototype;

  Class.prototype = new util.__ExtendLink();
  Class.prototype.constructor = Class;
};


/**
 * Привязывание определенного контекста к функции или методу.
 *
 * @param {!Function} func Функция.
 * @param {Object} context Контекст.
 * @return {!Function} Привязанная к контексту функция.
 */
util.bind = function(func, context) {
  return function() {
    return func.apply(context, arguments);
  };
};


/**
 * Отложенное выполнение функции.
 *
 * @param {function()} callback Функция.
 */
util.async = function(callback) {
  setTimeout(callback, 0);
};


/**
 * Ничего не выполняющая функция.
 */
util.nop = function() {};


/**
 * Клонирование объекта.
 *
 * @param {*} object Объект.
 * @return {*} Копия объекта.
 */
util.clone = function(object) {
  try {
    return JSON.parse(JSON.stringify(object));
  } catch (error) {
    console.error(error);
  }

  return null;
};


/**
 * @param {!Object} base Базовый объект.
 * @param {!Object} target Объект для наложения на базовый.
 */
util.merge = function(base, target) {
  for (var key in target) {
    base[key] = target[key];
  }
};


/**
 * @param {Object} first Объект для сравнения.
 * @param {Object} second Другой объект для сравнения.
 * @return {boolean} Результат сравнения.
 */
util.areEqual = function(first, second) {
  try {
    return first === second || JSON.stringify(first) === JSON.stringify(second);
  } catch (error) {
    console.error(error);
  }

  return false;
};


/**
 * Преобразование объекта с индесами в массив.
 *
 * @param {!Object} list Объект похожий на массив.
 * @return {!Array} Массив.
 */
util.toArray = function(list) {
  return Array.prototype.slice.call(list);
};


/**
 * Клонирование массива.
 *
 * @param {!Array} array Массив.
 * @return {!Array} Копия массива.
 */
util.cloneArray = function(array) {
  return array.slice(0);
};


/**
 * Поиск индекса объекта в массиве.
 *
 * @param {*} element Объект поиска.
 * @param {!Array} array Массив.
 * @return {number} Индекс найденного элемента.
 */
util.indexOf = function(element, array) {
  if (array.indexOf !== undefined) {
    return array.indexOf(element);
  } else {
    var i = 0,
        l = array.length;

    while (i < l) {
      if (array[i] === element) {
        return i;
      }

      i++;
    }
  }

  return -1;
};


/**
 * @param {Object} object Объект кодирования.
 * @return {string} Кодированный в строку объект.
 */
util.encodeJsonData = function(object) {
  try {
    return JSON.stringify(object);
  } catch (error) {
    console.error(error);
  }

  return '';
};


/**
 * @param {string} data Закодированный объект.
 * @return {*} Раскодированный объект.
 */
util.decodeJsonData = function(data) {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
  }

  return null;
};


/**
 * Кодирование объекта в x-www-form-urlencoded форму.
 *
 * @param {!Object} object Объект кодирования.
 * @return {string} Перекодированный в строку объект.
 */
util.encodeFormData = function(object) {
  return util.tokenizeUrlData(object).join('&');
};


/**
 * Рекурсивное разбиение объекта н данные для кодирования в
 * x-www-form-urlencoded.
 *
 * @param {!Object} object Объект кодирования.
 * @param {!Array.<string>=} opt_path Путь к элементарной единице данных.
 * @return {!Array.<string>} Массив элементарных данных составляющих объект.
 */
util.tokenizeUrlData = function(object, opt_path) {
  var result = [];

  if (opt_path === undefined) {
    opt_path = [];
  }

  if (typeof object === 'object') {
    for (var key in object) {
      var newPath = opt_path.length === 0 ?
          [key] : (opt_path.join(',') + ',' + key).split(',');

      result = result.concat(util.tokenizeUrlData(object[key], newPath));
    }
  } else if (object !== undefined) {
    result = [
      opt_path.shift() +
          (opt_path.length > 0 ? '[' + opt_path.join('][') + ']=' : '=') +
              encodeURIComponent(String(object))
    ];
  }


  return result;
};


/**
 * @param {string} data Закодированный объект.
 * @return {*} Раскодированный объект.
 */
util.decodeFormData = function(data) {
  var result = new util.SafeObject({});

  var values = decodeURIComponent(data).split('&');
  var i = 0,
      l = values.length;

  var pair = [];
  while (i < l) {
    pair = values[i].split('=');

    if (pair[1] !== undefined) {
      result.setByPath(pair[1], util.parseUrlPathToken(pair[0]));
    }

    i++;
  }

  return result.getCore();
};


/**
 * @param {string} token Имя элементарного узла данных.
 * @return {!Array.<string>} Массив строк пути к узлу.
 */
util.parseUrlPathToken = function(token) {
  if (token.charAt(token.length - 1) !== ']') {
    return [token];
  }

  var nameLength = token.indexOf('[');
  return [token.substring(0, nameLength)].concat(
      token.substring(nameLength + 1, token.length - 1).split(']['));
};


/**
 * @param {string} name Имя переменной.
 * @param {string} value Значение.
 * @param {number=} opt_time Время хранения.
 */
util.setCookie = function(name, value, opt_time) {
  var expires = '';

  if (typeof opt_time === 'number') {
    var date = new Date();
    date.setTime(opt_time + date.getTime());

    expires = '; expires=' + date.toGMTString();
  }

  document.cookie = name + '=' + value + expires + '; path=/';
};


/**
 * @param {string} name Имя переменной.
 * @return {string} Значение переменной.
 */
util.getCookie = function(name) {
  var cookies = document.cookie;

  var token = name + '=';
  var tokenIndex = cookies.indexOf(token);
  if (tokenIndex !== -1) {
    var semicolonIndex = cookies.indexOf(';', tokenIndex);
    if (semicolonIndex === -1) {
      return cookies.substring(tokenIndex + token.length);
    } else {
      return cookies.substring(tokenIndex + token.length, semicolonIndex);
    }
  }

  return '';
};


/**
 * @param {string} name Имя переменной.
 */
util.removeCookie = function(name) {
  var date = new Date();
  date.setTime(date.getTime() - 1000);

  document.cookie = name + '=0; expires=' + date.toGMTString() + '; path=/';
};
