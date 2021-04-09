// @ts-check
/** @type { import("./validation").validation } */
module.exports = joi => {
    const messages = require('./messages')(joi);
    return {
        'intent.detect': () => ({
            description: 'Detect intent',
            params: joi.object().keys({
                url: joi.string(),
                body: joi.object(),
                headers: joi.object()
            }),
            result: joi.object().keys({
                responseId: joi.string().required(),
                queryResult: joi.object().keys({
                    queryText: joi.string(),
                    languageCode: joi.string(),
                    speechRecognitionConfidence: joi.number(),
                    action: joi.string(),
                    parameters: joi.object(),
                    allRequiredParamsPresent: joi.bool(),
                    fulfillmentText: joi.string(),
                    fulfillmentMessages: joi.array().items(...messages),
                    webhookSource: joi.string(),
                    webhookPayload: joi.object(),
                    outputContexts: joi.array().items(joi.object().keys({
                        name: joi.string(),
                        lifespanCount: joi.number(),
                        parameters: joi.object()
                    })),
                    intent: joi.object().keys({
                        name: joi.string(),
                        displayName: joi.string(),
                        webhookState: joi.string().valid(
                            'WEBHOOK_STATE_UNSPECIFIED',
                            'WEBHOOK_STATE_ENABLED',
                            'WEBHOOK_STATE_ENABLED_FOR_SLOT_FILLING'
                        ),
                        priority: joi.number(),
                        isFallback: joi.bool(),
                        mlDisabled: joi.bool(),
                        inputContextNames: joi.array().items(joi.string()),
                        events: joi.array().items(joi.string()),
                        trainingPhrases: joi.array().items(joi.object().keys({
                            name: joi.string(),
                            type: joi.string().valid(
                                'TYPE_UNSPECIFIED',
                                'EXAMPLE',
                                'TEMPLATE'
                            ),
                            parts: joi.array().items(joi.object().keys({
                                text: joi.string(),
                                entityType: joi.string(),
                                alias: joi.string(),
                                userDefined: joi.bool()
                            })),
                            timesAddedCount: joi.number()
                        })),
                        action: joi.string(),
                        outputContexts: joi.array().items(joi.object().keys({
                            name: joi.string(),
                            lifespanCount: joi.number(),
                            parameters: joi.object()
                        })),
                        resetContexts: joi.bool(),
                        parameters: joi.array().items(joi.object().keys({
                            name: joi.string(),
                            displayName: joi.string(),
                            value: joi.string(),
                            defaultValue: joi.string(),
                            entityTypeDisplayName: joi.string(),
                            mandatory: joi.bool(),
                            prompts: joi.array().items(joi.string()),
                            isList: joi.bool()
                        })),
                        messages: joi.array().items(...messages),
                        defaultResponsePlatforms: joi.array().items(joi.string().valid(
                            'PLATFORM_UNSPECIFIED',
                            'FACEBOOK',
                            'SLACK',
                            'TELEGRAM',
                            'KIK',
                            'SKYPE',
                            'LINE',
                            'VIBER',
                            'ACTIONS_ON_GOOGLE'
                        )),
                        rootFollowupIntentName: joi.string(),
                        parentFollowupIntentName: joi.string(),
                        followupIntentInfo: joi.array().items(joi.object().keys({
                            followupIntentName: joi.string(),
                            parentFollowupIntentName: joi.string()
                        }))
                    }),
                    intentDetectionConfidence: joi.number(),
                    diagnosticInfo: joi.object()
                }).required(),
                webhookStatus: joi.object().keys({
                    code: joi.number(),
                    message: joi.string(),
                    details: joi.array()
                })
            })
        })
    };
};
