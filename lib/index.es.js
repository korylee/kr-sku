import { computed } from "vue-demi";
var listHelper = {};
var is = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.isUrl = exports.isArray = exports.isRegExp = exports.isBoolean = exports.isPromise = exports.isNumber = exports.isNullOrUnDef = exports.isUndefined = exports.isNull = exports.isDate = exports.isFunction = exports.isObject = exports.isString = exports.isUnDef = exports.isDef = exports.is = void 0;
  var toString = Object.prototype.toString;
  var is2 = function(val, type) {
    return toString.call(val) === "[object ".concat(type, "]");
  };
  exports.is = is2;
  var isDef = function(val) {
    return typeof val !== "undefined";
  };
  exports.isDef = isDef;
  var isUnDef = function(val) {
    return !(0, exports.isDef)(val);
  };
  exports.isUnDef = isUnDef;
  var isString = function(val) {
    return (0, exports.is)(val, "String");
  };
  exports.isString = isString;
  var isObject = function(val) {
    return val !== null && (0, exports.is)(val, "Object");
  };
  exports.isObject = isObject;
  var isFunction = function(val) {
    return typeof val === "function";
  };
  exports.isFunction = isFunction;
  var isDate = function(val) {
    return (0, exports.is)(val, "Date");
  };
  exports.isDate = isDate;
  var isNull = function(val) {
    return val === null;
  };
  exports.isNull = isNull;
  var isUndefined = function(val) {
    return val === void 0;
  };
  exports.isUndefined = isUndefined;
  var isNullOrUnDef = function(val) {
    return (0, exports.isUndefined)(val) || (0, exports.isNull)(val);
  };
  exports.isNullOrUnDef = isNullOrUnDef;
  var isNumber = function(val) {
    return (0, exports.is)(val, "Number");
  };
  exports.isNumber = isNumber;
  var isPromise = function(val) {
    return (0, exports.is)(val, "Promise") && (0, exports.isObject)(val) && (0, exports.isFunction)(val.then) && (0, exports.isFunction)(val.catch);
  };
  exports.isPromise = isPromise;
  var isBoolean = function(val) {
    return (0, exports.is)(val, "Boolean");
  };
  exports.isBoolean = isBoolean;
  var isRegExp = function(val) {
    return (0, exports.is)(val, "RegExp");
  };
  exports.isRegExp = isRegExp;
  var isArray = function(val) {
    return val && Array.isArray(val);
  };
  exports.isArray = isArray;
  var isUrl = function(path) {
    var reg = /(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%\/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
    return reg.test(path);
  };
  exports.isUrl = isUrl;
})(is);
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.map = exports.mapSkip = exports.wrapInArray = void 0;
  var is_1 = is;
  function wrapInArray(v) {
    if ((0, is_1.isNull)(v) || (0, is_1.isUndefined)(v))
      return [];
    return Array.isArray(v) ? v : [v];
  }
  exports.wrapInArray = wrapInArray;
  exports.mapSkip = Symbol("skip");
  function map(iterable, mapper, thisArg) {
    var result = [];
    for (var i = 0; i < iterable.length; i++) {
      var item = iterable[i];
      var element = mapper.call(thisArg, item, i, iterable);
      if (element === exports.mapSkip)
        continue;
      result.push(element);
    }
    return result;
  }
  exports.map = map;
})(listHelper);
function calcDescartes(array) {
  if (!(array == null ? void 0 : array.length))
    return [];
  if (array.length === 1)
    return array[0].map((item) => [item]);
  return array.reduce((total, currentValue) => {
    const res = [];
    total.forEach((t) => {
      currentValue.forEach((cv) => {
        res.push([...listHelper.wrapInArray(t), cv]);
      });
    });
    return res;
  });
}
function isSimilarArray(a, b) {
  return !a.some((item) => !b.includes(item));
}
const noop = () => {
};
function getDescartesUidArray(variations) {
  const optionsArray = listHelper.map(variations, ({ options }) => (options == null ? void 0 : options.length) ? options.map(({ uid }) => uid) : listHelper.mapSkip);
  return calcDescartes(optionsArray);
}
function removeVariationOption(items, {
  variations,
  descartesUidArray,
  updateItem = noop
}) {
  const removeIndex = [];
  const memo = [];
  descartesUidArray = descartesUidArray != null ? descartesUidArray : getDescartesUidArray(variations);
  items.forEach((variationTableItem, index) => {
    let res = true;
    descartesUidArray.forEach((uids, index2) => {
      const result = isSimilarArray(uids, variationTableItem.uids);
      if (result) {
        if (!memo[index2])
          res = false;
        variationTableItem.uids = uids;
        updateItem == null ? void 0 : updateItem(variationTableItem, uids, variations);
        memo[index2] = true;
      }
    });
    if (res)
      removeIndex.push(index);
  });
  const len = removeIndex.length;
  for (let i = len - 1; i >= 0; i--) {
    const item = removeIndex[i];
    items.splice(item, 1);
  }
}
function addVariationOption(items, {
  variations,
  descartesUidArray,
  createItem = (uids) => ({ uids }),
  updateItem = noop,
  addItems = []
}) {
  descartesUidArray = descartesUidArray != null ? descartesUidArray : getDescartesUidArray(variations);
  descartesUidArray.forEach((uids) => {
    const findIndex = items.findIndex((variationTableItem) => {
      const res = isSimilarArray(variationTableItem.uids, uids);
      if (res) {
        variationTableItem.uids = uids;
        updateItem == null ? void 0 : updateItem(variationTableItem, uids, variations);
      }
      return res;
    });
    if (findIndex !== -1)
      return;
    const isContain = (addItems == null ? void 0 : addItems.length) ? uids.some((uid) => addItems.some((item) => uid === item.uid)) : true;
    if (!isContain)
      return;
    const addItem = createItem(uids, variations);
    items.push(addItem);
  });
}
function uidsToIndex(uids, variations) {
  return uids.map((uid, index) => variations[index].options.findIndex((option) => option.uid === uid));
}
function sortVariationOption(items, variations) {
  items.sort((a, b) => parseInt(uidsToIndex(a.uids, variations).join("")) - parseInt(uidsToIndex(b.uids, variations).join("")));
}
function useVariationOption(variations, variationSkus, createItem, updateItem, needSort = true) {
  const descartesUidArray = computed(() => getDescartesUidArray(variations.value));
  return {
    descartesUidArray,
    add: (addItems) => {
      addVariationOption(variationSkus.value, {
        variations: variations.value,
        descartesUidArray: descartesUidArray.value,
        updateItem,
        createItem,
        addItems: listHelper.wrapInArray(addItems)
      });
      if (needSort)
        sortVariationOption(variationSkus.value, variations.value);
    },
    remove: () => {
      removeVariationOption(variationSkus.value, {
        variations: variations.value,
        descartesUidArray: descartesUidArray.value,
        updateItem
      });
      if (needSort)
        sortVariationOption(variationSkus.value, variations.value);
    }
  };
}
export { addVariationOption, getDescartesUidArray, removeVariationOption, sortVariationOption, uidsToIndex, useVariationOption };
