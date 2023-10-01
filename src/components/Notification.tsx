import { notification } from "antd";

export function notificationSuccess(title: string, description: string) {
    notification.success({
        message: title,
        description: description,
        placement: "bottomRight",
        duration: 5,
    });
}

export function notificationError(description: string) {
    notification.error({
        message: "Error",
        description: description,
        placement: "bottomRight",
        duration: 5,
    });
}
