import { Form, Input, Modal, Radio } from "antd";
import { notificationSuccess, notificationError } from "./Notification";

export async function newProfileModal() {
    return new Promise((resolve, reject) => {
        Modal.confirm({
            title: "New Profile",
            okText: "Create",
            centered: true,
            width: 500,
            maskClosable: true,
            onOk() {
                setTimeout(resolve, 1000);
                return new Promise((resolve) => {
                    setTimeout(resolve, 1000);
                });
            },
            onCancel() {
                reject();
            },
            // content: (
            //     <Form form={form} layout="vertical">
            //         <Form.Item
            //             label="Title"
            //             name="title"
            //             rules={[
            //                 {
            //                     required: true,
            //                     message:
            //                         "Please input the title of collection!",
            //                 },
            //             ]}
            //         >
            //             <Input />
            //         </Form.Item>
            //         <Form.Item name="description" label="Description">
            //             <Input type="textarea" />
            //         </Form.Item>

            //         <Form.Item name="type" label="Type">
            //             <Radio.Group>
            //                 <Radio value="public">Public</Radio>
            //                 <Radio value="private">Private</Radio>
            //             </Radio.Group>
            //         </Form.Item>
            //     </Form>
            // ),
        });
    });
}

export function applyModal() {
    Modal.confirm({
        title: "Apply server config",
        content:
            "This will generate a new server configuration for every current users. Proceed?",
        centered: true,
        width: 500,
        maskClosable: true,
        onOk() {
            var url = "/api/v1/apply";
            fetch(url, { method: "POST" })
                .then(async (res) => {
                    if (!res.ok) {
                        const text = await res.json();
                        throw new Error(text.error);
                    }
                    var message = "Applying server config";
                    var description = "This may take a while.";
                    notificationSuccess(message, description);
                })
                .catch((err) => {
                    notificationError(err.toString());
                });
            return new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
        },
    });
}

export function generateModal(ProfileName: string) {
    Modal.confirm({
        title: "Generate " + ProfileName + "'s config",
        content:
            "This config is unique for each client, please ensure that you are choosing the correct user's profile.",
        centered: true,
        width: 500,
        maskClosable: true,
        onOk() {
            var url = "/api/v1/profiles/" + ProfileName + "/getconf";
            fetch(url, { method: "GET" })
                .then(async (res) => {
                    if (!res.ok) {
                        const text = await res.json();
                        throw new Error(text.error);
                    }
                    var message = "Generating " + ProfileName + "'s config";
                    var description =
                        "This may take a while, please wait for the download to start.";
                    notificationSuccess(message, description);
                    return res.blob();
                })
                .then((blob) => {
                    var url = window.URL.createObjectURL(blob);
                    var a = document.createElement("a");
                    a.href = url;
                    a.download = ProfileName + ".conf";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                })
                .catch((err) => {
                    notificationError(err.toString());
                });
            return new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
        },
    });
}

export async function deleteModal(ProfileName: string) {
    return new Promise((resolve, reject) => {
        Modal.confirm({
            title: "Delete " + ProfileName,
            content:
                "If you delete this profile, you will not be able to recover it.",
            okType: "danger",
            centered: true,
            width: 500,
            maskClosable: true,
            onOk() {
                var url = "/api/v1/profiles/" + ProfileName;
                fetch(url, { method: "DELETE" })
                    .then(async (res) => {
                        if (!res.ok) {
                            const text = await res.json();
                            throw new Error(text.error);
                        }
                        var message = "Deleting " + ProfileName + "'s config";
                        var description = "This may take a while.";
                        notificationSuccess(message, description);
                    })
                    .catch((err) => {
                        notificationError(err.toString());
                    });
                setTimeout(resolve, 1000);
                return new Promise((resolve) => {
                    setTimeout(resolve, 1000);
                });
            },
            onCancel() {
                reject();
            },
        });
    });
}
