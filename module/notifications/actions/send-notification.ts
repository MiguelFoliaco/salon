'use server';
export const sendNotification = async () => {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            to: "ExponentPushToken[rHvhpUM72jkPljx6xuc3b-]",
            title: "Notificación",
            body: "Notificación de prueba",
        })
    })
    console.log('Send')
    return response.json();
}