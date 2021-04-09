const authClientFactory = require('./authClientFactory');
const getAuthHeader = async auth => 'Bearer ' + (await authClientFactory(auth).getAccessToken()).token;
const errors = require('./errors');
module.exports = function dialogflow(...params) {
    const {registerErrors, joi} = params[0];
    return class dialogflow extends require('ut-port-webhook')(...params) {
        get defaults() {
            return {
                path: '/dialogflow/{appId}/{clientId}',
                mode: 'reply',
                async: 'client',
                server: {
                    port: 8084
                },
                namespace: 'dialogflow',
                hook: 'dialogflowIn',
                validations: require('./validations')(joi)
            };
        }

        handlers() {
            const {namespace, hook} = this.config;
            const getSessionPath = ({receiver}, auth) => {
                return `projects/${auth.appId}/agent/sessions/${receiver.conversationId}`;
            };
            const getContextsPath = (msg, auth) => `${getSessionPath(msg, auth)}/contexts`;

            return {
                start() {
                    Object.assign(this.errors, registerErrors(errors));
                },
                [`${hook}.identity.request.receive`]: (msg, {params = {}}) => {
                    return params;
                },
                [`${hook}.identity.response.send`]: msg => {
                    return msg;
                },
                [`${hook}.message.request.receive`]: (msg, $meta) => {
                    if (msg.queryResult && msg.queryResult.action) {
                        const contextParams = msg.queryResult.outputContexts && msg.queryResult.outputContexts.reduce((prev, context) => ({...context.parameters, ...prev}), {});
                        $meta.opcode = msg.queryResult.action;
                        return {
                            type: 'action',
                            text: msg.queryResult.action,
                            details: {
                                session: msg.session,
                                ...contextParams,
                                ...msg.queryResult.parameters,
                                ...msg.originalDetectIntentRequest.payload
                            }
                        };
                    }
                },
                [`${hook}.message.response.send`]: (msg, {opcode}) => {
                    if (typeof msg === 'string') {
                        return {
                            body: {
                                fulfillmentText: msg
                            },
                            code: 200
                        };
                    }
                    const {event = 'success', details = {}} = msg;
                    if (event === 'reply') {
                        return {
                            body: details,
                            code: 200
                        };
                    } else {
                        return {
                            body: {
                                followupEventInput: {
                                    name: opcode.replace(/\./g, '-') + '-' + event,
                                    parameters: details,
                                    languageCode: 'en-US'
                                }
                            },
                            code: 200
                        };
                    }
                },
                [`${hook}.message.error.send`]: (msg, $meta) => {
                    if (typeof msg === 'string') {
                        return {
                            body: {
                                fulfillmentText: msg
                            },
                            code: 200
                        };
                    }
                    const {event = 'fail', details = {}} = msg;
                    $meta.mtid = 'response';
                    return {
                        body: {
                            followupEventInput: {
                                name: $meta.opcode.replace(/\./g, '-') + '-' + event,
                                parameters: details,
                                languageCode: 'en-US'
                            }
                        },
                        code: 200
                    };
                },
                [`${namespace}.intent.detect.response.receive`]: msg => {
                    if (!msg || !msg.queryResult) return false;
                    let result = {};
                    if (msg.queryResult.fulfillmentMessages && msg.queryResult.fulfillmentMessages.length && !msg.queryResult.fulfillmentText) {
                        const {payload, text} = msg.queryResult.fulfillmentMessages[0];
                        // The default response could contain either payload: {...} or text: {text: [...]}
                        // Ref: https://cloud.google.com/dialogflow-enterprise/docs/reference/rest/v2/projects.agent.intents#Message
                        if (payload) {
                            result = payload;
                        } else if (text) {
                            result = {
                                type: 'text',
                                // Get a random element from agent's responses collection
                                text: text.text[Math.floor(Math.random() * text.text.length)]
                            };
                        } else {
                            // dialogflow specific responses (google assistant, viber, slack, etc...) can be implemented here
                            throw this.errors['dialogflow.unsupportedMessage']({
                                message: msg.queryResult.fulfillmentMessages[0]
                            });
                        }
                    } else if (msg.queryResult.fulfillmentText) {
                        result = {
                            type: 'text',
                            text: msg.queryResult.fulfillmentText
                        };
                    } else {
                        return false;
                    }
                    if (this.config.debug && typeof result.text === 'string' && msg.queryResult.intent && msg.queryResult.intent.displayName) {
                        result.text = `[${msg.queryResult.intent.displayName}]\n${result.text}`;
                    }
                    result.messageId = msg.responseId;
                    // additional information for reporting and analytic purposes
                    result.info = {
                        intentDetectionConfidence: msg.queryResult.intentDetectionConfidence,
                        intentName: msg.queryResult.intent.name,
                        intentDisplayName: msg.queryResult.intent.displayName,
                        isFallbackIntent: msg.queryResult.intent.isFallback
                    };
                    return result;
                },
                [`${namespace}.intent.detect.request.send`]: async(msg, {auth}) => {
                    const queryInput = msg.event ? {
                        event: {
                            name: msg.event,
                            parameters: msg.parameters,
                            language_code: 'en-US'
                        }
                    } : {
                        text: {
                            text: msg.text,
                            language_code: 'en-US'
                        }
                    };
                    return {
                        url: `https://dialogflow.googleapis.com/v2/${getSessionPath(msg, auth)}:detectIntent`,
                        body: {
                            queryInput,
                            queryParams: {
                                payload: msg.payload
                            }
                        },
                        headers: {
                            Authorization: await getAuthHeader(auth)
                        }
                    };
                },
                [`${namespace}.deleteContexts.request.send`]: async(msg, {auth}) => {
                    return {
                        url: `https://dialogflow.googleapis.com/v2/${getSessionPath(msg, auth)}/contexts`,
                        method: 'DELETE',
                        headers: {
                            Authorization: await getAuthHeader(auth)
                        }
                    };
                },
                [`${namespace}.deleteContexts.response.receive`]: msg => {
                    return msg;
                },
                [`${namespace}.context.create.request.send`]: async(msg, {auth}) => {
                    let path;
                    let {id, name, lifespanCount, parameters} = msg.context;
                    if (name) {
                        path = name.slice(0, name.lastIndexOf('/'));
                    } else {
                        path = getContextsPath(msg, auth);
                        name = `${path}/${id}`;
                    }
                    return {
                        url: `https://dialogflow.googleapis.com/v2/${path}`,
                        body: { name, lifespanCount, parameters },
                        headers: {
                            Authorization: await getAuthHeader(auth)
                        }
                    };
                },
                [`${namespace}.context.create.response.receive`]: msg => {
                    return msg;
                },
                [`${namespace}.context.delete.request.send`]: async(msg, {auth}) => {
                    const path = msg.context.name || `${getContextsPath(msg, auth)}/${msg.context.id}`;
                    return {
                        url: `https://dialogflow.googleapis.com/v2/${path}`,
                        method: 'DELETE',
                        headers: {
                            Authorization: await getAuthHeader(auth)
                        }
                    };
                },
                [`${namespace}.context.delete.response.receive`]: msg => {
                    return msg;
                },
                [`${namespace}.context.get.request.send`]: async(msg, {auth}) => {
                    const path = msg.context.name || `${getContextsPath(msg, auth)}/${msg.context.id}`;
                    return {
                        url: `https://dialogflow.googleapis.com/v2/${path}`,
                        method: 'GET',
                        headers: {
                            Authorization: await getAuthHeader(auth)
                        }
                    };
                },
                [`${namespace}.context.get.response.receive`]: msg => {
                    return msg;
                },
                [`${namespace}.context.list.request.send`]: async(msg, {auth}) => {
                    return {
                        url: `https://dialogflow.googleapis.com/v2/${getContextsPath(msg, auth)}`,
                        method: 'GET',
                        qs: {
                            pageSize: msg.pageSize,
                            pageToken: msg.pageToken
                        },
                        headers: {
                            Authorization: await getAuthHeader(auth)
                        }
                    };
                },
                [`${namespace}.context.list.response.receive`]: msg => {
                    return msg;
                },
                [`${namespace}.context.patch.request.send`]: async(msg, {auth}) => {
                    let {id, name, lifespanCount, parameters} = msg.context;
                    if (!name) name = `${getContextsPath(msg, auth)}/${id}`;
                    return {
                        url: `https://dialogflow.googleapis.com/v2/${name}`,
                        body: { name, lifespanCount, parameters },
                        method: 'PATCH',
                        qs: {
                            updateMask: msg.updateMask
                        },
                        headers: {
                            Authorization: await getAuthHeader(auth)
                        }
                    };
                },
                [`${namespace}.context.patch.response.receive`]: msg => {
                    return msg;
                },
                [`${namespace}.entityType.batchDelete.request.send`]: async({entityTypes = []}, {auth}) => {
                    const entityTypeNames = entityTypes.map(entityType => {
                        return entityType.indexOf('/') === -1
                            ? `projects/${auth.appId}/agent/entityTypes/${entityType}`
                            : entityType;
                    });
                    return {
                        url: `https://dialogflow.googleapis.com/v2/projects/${auth.appId}/agent/entityTypes:batchUpdate`,
                        method: 'POST',
                        body: { entityTypeNames },
                        headers: {
                            Authorization: await getAuthHeader(auth)
                        }
                    };
                },
                [`${namespace}.entityType.batchDelete.response.receive`]: msg => {
                    return msg;
                },
                [`${namespace}.entityType.batchUpdate.request.send`]: async({
                    languageCode,
                    updateMask,
                    entityTypeBatchUri,
                    entityTypeBatchInline
                }, {auth}) => {
                    const body = {
                        languageCode,
                        updateMask
                    };
                    if (entityTypeBatchUri) {
                        body.entityTypeBatchUri = entityTypeBatchUri;
                    } else {
                        body.entityTypeBatchInline = {
                            entityTypes: entityTypeBatchInline.entityTypes.map(entityType => {
                                if (entityType.id) {
                                    entityType.name = `projects/${auth.appId}/agent/entityTypes/${entityType.id}`;
                                    delete entityType.id;
                                }
                                return entityType;
                            })
                        };
                    }
                    return {
                        url: `https://dialogflow.googleapis.com/v2/projects/${auth.appId}/agent/entityTypes:batchDelete`,
                        method: 'POST',
                        body,
                        headers: {
                            Authorization: await getAuthHeader(auth)
                        }
                    };
                },
                [`${namespace}.entityType.batchUpdate.response.receive`]: msg => {
                    return msg;
                },
                [`${namespace}.entityType.create.request.send`]: async({
                    languageCode,
                    entityType = {}
                }, {auth}) => {
                    const {displayName, kind, autoExpansionMode, entities} = entityType;
                    return {
                        url: `https://dialogflow.googleapis.com/v2/projects/${auth.appId}/agent/entityTypes`,
                        method: 'POST',
                        qs: {
                            languageCode
                        },
                        body: {
                            displayName,
                            kind,
                            autoExpansionMode,
                            entities
                        },
                        headers: {
                            Authorization: await getAuthHeader(auth)
                        }
                    };
                },
                [`${namespace}.entityType.create.response.receive`]: msg => {
                    return msg;
                },
                [`${namespace}.entityType.delete.request.send`]: async({ entityTypeId, entityTypeName }, {auth}) => {
                    const name = entityTypeName || `projects/${auth.appId}/agent/entityTypes/${entityTypeId}`;
                    return {
                        url: `https://dialogflow.googleapis.com/v2/${name}`,
                        method: 'DELETE',
                        headers: {
                            Authorization: await getAuthHeader(auth)
                        }
                    };
                },
                [`${namespace}.entityType.delete.response.receive`]: msg => {
                    return msg;
                },
                [`${namespace}.entityType.get.request.send`]: async({entityTypeId, entityTypeName}, {auth}) => {
                    const name = entityTypeName || `projects/${auth.appId}/agent/entityTypes/${entityTypeId}`;
                    return {
                        url: `https://dialogflow.googleapis.com/v2/${name}`,
                        method: 'GET',
                        headers: {
                            Authorization: await getAuthHeader(auth)
                        }
                    };
                },
                [`${namespace}.entityType.get.response.receive`]: msg => {
                    return msg;
                },
                [`${namespace}.entityType.list.request.send`]: async({
                    pageSize,
                    pageToken,
                    languageCode
                }, {auth}) => {
                    return {
                        url: `https://dialogflow.googleapis.com/v2/projects/${auth.appId}/agent/entityTypes`,
                        method: 'GET',
                        qs: {
                            pageSize,
                            pageToken,
                            languageCode
                        },
                        headers: {
                            Authorization: await getAuthHeader(auth)
                        }
                    };
                },
                [`${namespace}.entityType.list.response.receive`]: msg => {
                    return msg;
                },
                [`${namespace}.entityType.patch.request.send`]: async({
                    languageCode,
                    updateMask,
                    entityType = {}
                }, {auth}) => {
                    let {id, name, displayName, kind, autoExpansionMode, entities} = entityType;
                    if (!name) name = `projects/${auth.appId}/agent/entityTypes/${id}`;
                    return {
                        url: `https://dialogflow.googleapis.com/v2/${name}`,
                        method: 'PATCH',
                        qs: {
                            languageCode,
                            updateMask
                        },
                        body: {
                            name,
                            displayName,
                            kind,
                            autoExpansionMode,
                            entities
                        },
                        headers: {
                            Authorization: await getAuthHeader(auth)
                        }
                    };
                },
                [`${namespace}.entityType.patch.response.receive`]: msg => {
                    return msg;
                }
            };
        }
    };
};
