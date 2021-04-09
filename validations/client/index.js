module.exports = joi => Object.assign(
    {},
    require('./context.create')(joi),
    require('./context.delete')(joi),
    require('./context.get')(joi),
    require('./context.list')(joi),
    require('./context.patch')(joi),
    require('./deleteContexts')(joi),
    require('./entityType.batchDelete')(joi),
    require('./entityType.batchUpdate')(joi),
    require('./entityType.create')(joi),
    require('./entityType.delete')(joi),
    require('./entityType.get')(joi),
    require('./entityType.list')(joi),
    require('./entityType.patch')(joi),
    require('./intent.detect')(joi)
);
