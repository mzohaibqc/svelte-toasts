import { writable, get } from 'svelte/store';
import * as uuid from 'uuid';

function notificationsStore(initialValue = []) {
  const store = writable(initialValue);
  const { set, update, subscribe } = store;
  let defaultOptions = {
    duration: 3000,
    placement: 'bottom-right',
    type: 'info',
    theme: 'dark',
  };
  function add(options) {
    const { key = uuid.v4(), duration = 3000, placement = 'bottom-right', type = 'info', theme = 'dark', ...rest } = {
      ...defaultOptions,
      ...options,
    };

    const obj = {
      ...rest,
      key,
      placement,
      type,
      theme,
      duration,
      remove: () => {
        update((v) => v.filter((i) => i.key !== key));
      },
      update: (data) => {
        delete data.key;
        const index = get(store)?.findIndex((v) => v?.key === key);
        if (index > -1) {
          update((v) => [...v.slice(0, index), { ...v[index], ...data }, ...v.slice(index + 1)]);
        }
      },
    };
    update((v) => [...v, obj]);
    if (duration > 0) {
      setTimeout(() => {
        obj.remove();
        if (typeof obj.onRemove === 'function') obj.onRemove();
      }, duration);
    }
    return obj;
  }

  function getByKey(key) {
    return get(store)?.find((v) => v?.key === key);
  }

  function clearAll() {
    set([]);
  }
  function clearLast() {
    update((v) => {
      return v.slice(0, v.length - 1);
    });
  }

  function setDefaults(options) {
    defaultOptions = { ...defaultOptions, ...options };
  }

  return {
    subscribe,
    add,
    success: getHelper('success', add),
    info: getHelper('info', add),
    error: getHelper('error', add),
    warning: getHelper('warning', add),
    clearAll,
    clearLast,
    getByKey,
    setDefaults,
  };
}
const toasts = notificationsStore([]);
export default toasts;

function getHelper(type, add) {
  return function () {
    if (typeof arguments[0] === 'object') {
      const options = arguments[0];
      return add({ ...options, type });
    } else if (typeof arguments[0] === 'string' && typeof arguments[1] === 'string') {
      const options = arguments[2] || {};
      return add({
        ...options,
        type,
        title: arguments[0],
        description: arguments[1],
      });
    } else if (typeof arguments[0] === 'string') {
      const options = arguments[1] || {};
      return add({
        ...options,
        type,
        description: arguments[0],
      });
    }
  };
}
