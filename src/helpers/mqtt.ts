import * as mqtt from 'mqtt/dist/mqtt.min';

export function connectToBroker(url:string, options:mqtt.IClientOptions) {
    try{
        return mqtt.connect(url, options) as mqtt.MqttClient;
    } catch (error:any) {
        console.error(error.toString());
        return {} as mqtt.MqttClient;
    }
}
// disconnect
// https://github.com/mqttjs/MQTT.js#mqttclientendforce-options-callback
export function disconnectFromBroker(client:mqtt.MqttClient) {
    try{
        client.end();
        return true;
    } catch (error:any) {
        console.error(error.toString());
        return false;
    }
}

export function handleMqttConnection(client:mqtt.MqttClient, callback:Function) {
    try{
        client.on('connect', () => {
            callback();
        });
    } catch (error:any) {
        console.error(error.toString());
    }
}

export function handleMqttDisconnection(client:mqtt.MqttClient, callback:Function) {
    try{
        client.on('close', () => {
            callback();
        });
    } catch (error:any) {
        console.error(error.toString());
    }
}

export function handleMqttError(client:mqtt.MqttClient, callback:Function) {
    try{
        client.on('error', (error:any) => {
            callback(error);
        });
    } catch (error:any) {
        console.error(error.toString());
    }
}

export function handleMqttReconnection(client:mqtt.MqttClient, callback:Function) {
    try{
        client.on('reconnect', () => {
            callback();
        });
    } catch (error:any) {
        console.error(error.toString());
    }
}

export function handleMqttMessage(client:mqtt.MqttClient, callback:Function) {
    try{
        client.on('message', (topic:string, message:any) => {
            callback(topic, message.toString());
        });
    } catch (error:any) {
        console.error(error.toString());
    }
}
// publish message
// https://github.com/mqttjs/MQTT.js#mqttclientpublishtopic-message-options-callback
export function publishMessage(client:mqtt.MqttClient, topic:string, qos:mqtt.QoS, retain:boolean, message:Object) {
    try{
        client.publish(topic, JSON.stringify(message), {qos:qos, retain:retain});
        return true;
    } catch (error:any) {
        console.error(error.toString());
        return false;
    }
}
// subscribe topic
// https://github.com/mqttjs/MQTT.js#mqttclientsubscribetopictopic-arraytopic-object-options-callback
export function subscribeToTopic(client:mqtt.MqttClient, topic:string | string[], qos:mqtt.QoS, retain:boolean) {
    const options = {qos:qos, retain:retain} as mqtt.IClientSubscribeOptions;
    try{
        client.subscribe(topic, options);
        return true;
    } catch (error:any) {
        console.error(error.toString());
        return false;
    }
}
// unsubscribe topic
// https://github.com/mqttjs/MQTT.js#mqttclientunsubscribetopictopic-array-options-callback
export function unsubscribeFromTopic(client:mqtt.MqttClient, topic:string) {
    try{
        client.unsubscribe(topic);
        return true;
    } catch (error:any) {
        console.error(error.toString());
        return false;
    }
}
