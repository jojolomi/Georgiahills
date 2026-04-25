const mock = {
  Module: require('module'),
  setup: function() {
    const originalRequire = this.Module.prototype.require;
    const handler = {
      get: (target, prop) => {
        if (prop === 'then') return undefined;
        const fn = () => fn;
        Object.setPrototypeOf(fn, new Proxy({}, handler));
        return fn;
      },
      apply: (target, thisArg, argumentsList) => {
        const fn = () => fn;
        Object.setPrototypeOf(fn, new Proxy({}, handler));
        return fn;
      }
    };
    const proxyFn = () => proxyFn;
    Object.setPrototypeOf(proxyFn, new Proxy({}, handler));

    const zodMock = {
      z: proxyFn
    };
    this.Module.prototype.require = function(path) {
      if (path === 'firebase-functions/v2/https') return { onRequest: (o, h) => h || o };
      if (path === 'firebase-functions/v2/firestore') return { onDocumentCreated: () => () => {} };
      if (path === 'firebase-functions/v2/storage') return { onObjectFinalized: () => () => {} };
      if (path === 'firebase-functions/logger') return { info: () => {}, warn: () => {}, error: () => {}, debug: () => {} };
      if (path === 'firebase-admin') return {
        initializeApp: () => {},
        auth: () => ({}),
        firestore: Object.assign(() => ({}), { FieldValue: { serverTimestamp: () => ({}), increment: () => ({}), arrayUnion: () => ({}) } }),
        storage: () => ({ bucket: () => ({}) }),
        appCheck: () => ({})
      };
      if (path === 'sharp') return () => ({});
      if (path === 'zod') return zodMock;
      return originalRequire.apply(this, arguments);
    };
  }
};

module.exports = mock;
