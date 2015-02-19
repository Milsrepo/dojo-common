define([], function() {
    var message = function (fieldName, fieldMessages) {
        var messages = [],
            name = fieldName, errorKey;

        if (typeof fieldMessages === 'string') {
            messages.push({
                'text': fieldMessages
            });
        } else {
            for (errorKey in fieldMessages) {
                if (fieldMessages.hasOwnProperty(errorKey)) {
                    messages.push({
                        'key': errorKey,
                        'text': fieldMessages[errorKey]
                    });
                }
            }
        }

        return {
            getName: function () {
                try {
                    return name;
                } catch (e) {
                     console.error(this.declaredClass, arguments, e);
                     throw e;
                }
            },

            getMessages: function () {
                try {
                    return messages;
                } catch (e) {
                     console.error(this.declaredClass, arguments, e);
                     throw e;
                }
            }
        };
    };

    return {
        process: function (messages) {
            try {
                var fieldName, processedMessages = [];

                if (typeof messages === 'string') {
                    processedMessages = [message('unknown', [messages])];
                } else {
                    if (messages instanceof Array) {
                        for (fieldName = 0; fieldName < messages.length; fieldName++) {
                            processedMessages.push(message(fieldName, messages[fieldName]));
                        }
                    } else if (typeof messages === 'object') {
                        for (fieldName in messages) {
                            if (messages.hasOwnProperty(fieldName)) {
                                processedMessages.push(message(fieldName, messages[fieldName]));
                            }
                        }
                    }
                }
            } catch (e) {
                 console.error('frontend.response.processor.DataMessages', arguments, e);
                 processedMessages = [message('exception', [e.toString()])];
            }

            return {
                getCollection: function (){
                    return processedMessages;
                },

                toString: function () {
                    try {
                        var i, o, messages, result = [];
                        for (i = 0; i < processedMessages.length; i++) {
                            messages = processedMessages[i].getMessages();
                            for (o = 0; o < messages.length; o++) {
                                result.push(messages[o].text);
                            }
                        }

                        return result.join(', ');
                    } catch (e) {
                        console.error(this.declaredClass, arguments, e);
                        throw e;
                    }
                }
            };
        }
    };
});
