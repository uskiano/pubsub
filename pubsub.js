var ulib;
(function (ulib) {
    class PublishSubscriber {
        constructor() {
            this.topics = [];
        }
        subscribe(topicName, subscriptorName, callback) {
            let topic = this.topics.filter(p => p.Name == topicName);
            let subscriberInfo = {
                SubscriptorName: subscriptorName,
                Callback: callback
            };
            if (topic.length == 0) {
                // if topic does not exist create it and add it a subscriber
                this.topics.push({ Name: topicName, Subscribers: [subscriberInfo] });
            }
            else {
                // add subscriber to an existing topic
                topic[0].Subscribers.push(subscriberInfo);
            }
        }
        publish(topicName, data, publisherName = null) {
            let topic = this.topics.filter(p => p.Name == topicName);
            if (topic.length == 0) {
                console.warn(`PublishSubscriber.publish(): Topic ${topicName} does not exists yet`);
                return [];
            }
            else {
                if (topic[0].Subscribers.length == 0) {
                    console.warn(`PublishSubscriber.publish(): Topic ${topicName} has no subscribers yet`);
                    return [];
                }
                else {
                    let receiverList = [];
                    topic[0].Subscribers.forEach(subscriber => {
                        if (publisherName != subscriber.SubscriptorName) { // dont stream to publication's owner
                            subscriber.Callback(data, publisherName);
                            receiverList.push(subscriber.SubscriptorName);
                        }
                    });
                    return receiverList;
                }
            }
        }
        unsubscribe(topicName, subscriptorName) {
            let topic = this.topics.filter(p => p.Name == topicName);
            if (topic.length == 0) {
                throw `Error unsubscribing - Topic ${topicName} does not exists`;
            }
            else {
                if (topic[0].Subscribers.length == 0) {
                    throw `Error unsubscribing - Topic ${topicName} has no subscribers`;
                }
                let index = this.findIndexOfSubscriber(topic[0].Subscribers, subscriptorName);
                if (index == -1) {
                    throw `Error unsubscribing - Subscription ${subscriptorName} does not exist`;
                }
                else {
                    topic[0].Subscribers.splice(index, 1);
                }
            }
        }
        findIndexOfSubscriber(subscribers, subscriptorName) {
            let indexFound = -1;
            for (var i = 0; i < subscribers.length; i++) {
                if (subscribers[i].SubscriptorName == subscriptorName) {
                    indexFound = i;
                    break;
                }
            }
            return indexFound;
        }
    }
    ulib.PublishSubscriber = PublishSubscriber;
})(ulib || (ulib = {}));
