import { writable, get } from 'svelte/store';

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
    const {
      duration = 3000,
      placement = 'bottom-right',
      type = 'info',
      theme = 'dark',
      ...rest
    } = { ...defaultOptions, ...options };

    const uid = Date.now();
    const obj = {
      ...rest,
      uid,
      placement,
      type,
      theme,
      duration,
      remove: () => {
        update((v) => v.filter((i) => i.uid !== uid));
      },
      update: (data) => {
        delete data.uid;
        const index = get(store)?.findIndex((v) => v?.uid === uid);
        if (index > -1) {
          update((v) => [
            ...v.slice(0, index),
            { ...v[index], ...data },
            ...v.slice(index + 1),
          ]);
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

  function getById(uid) {
    return get(store)?.find((v) => v?.uid === uid);
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
    getById,
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
    } else if (
      typeof arguments[0] === 'string' &&
      typeof arguments[1] === 'string'
    ) {
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
