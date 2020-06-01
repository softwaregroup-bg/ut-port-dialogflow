module.exports = {
    'intent.detect': () => require('./intent/detect'),
    deleteContexts: () => require('./deleteContexts'),
    'context.create': () => require('./context/create'),
    'context.delete': () => require('./context/delete'),
    'context.get': () => require('./context/get'),
    'context.list': () => require('./context/list'),
    'context.patch': () => require('./context/patch'),
    'entityType.batchDelete': () => require('./entityType/batchDelete'),
    'entityType.batchUpdate': () => require('./entityType/batchUpdate'),
    'entityType.create': () => require('./entityType/create'),
    'entityType.delete': () => require('./entityType/delete'),
    'entityType.get': () => require('./entityType/get'),
    'entityType.list': () => require('./entityType/list'),
    'entityType.patch': () => require('./entityType/patch')

};
