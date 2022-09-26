namespace ulib {

    interface ITopic {
        Name: string,
        Subscribers: ISubscriber[]
    }

    interface ISubscriber {
        SubscriptorName: string,
        Callback: ((p,n?) => void)
    }

    export class PublishSubscriber {

        private topics: ITopic[] = [];

        public subscribe(topicName: string, subscriptorName: string, callback: (data: any, publisher?: string) => void) {
            let topic = this.topics.filter(p => p.Name == topicName);
            let subscriberInfo: ISubscriber = {
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

        public publish(topicName: string, data: any, publisherName: string = null): string[] {
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
                    let receiverList: string[] = [];
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

        public unsubscribe(topicName: string, subscriptorName: string) {
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

        private findIndexOfSubscriber(subscribers: ISubscriber[], subscriptorName: string) {
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

}