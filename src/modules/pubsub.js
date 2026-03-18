// src/modules/pubsub.js
const events = {};

export const pubsub = {
    subscribe(event, callback) {
        if (!events[event]) {
            events[event] = [];
        }
        events[event].push(callback);
    },
    publish(event, data) {
        if (events[event]) {
            events[event].forEach(callback => callback(data));
        }
    },
    unsubscribe(event, callback) {
        if (events[event]) {
            const index = events[event].indexOf(callback);
            if (index > -1) {
                events[event].splice(index, 1);
            }
        }
    }
};
