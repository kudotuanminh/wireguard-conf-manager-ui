import { ColumnType } from "antd/es/table";
import {
    Typography,
    Layout,
    Button,
    Space,
    Table,
    Tooltip,
    Dropdown,
    Drawer,
    Form,
    Input,
} from "antd";
import Icon, { LoadingOutlined, MoreOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

import "./App.css";
import wgBanner from "./assets/wg-full.svg";
import { HiddenKey } from "./components/HiddenKey";
import { ApplyModal, GenerateModal, DeleteModal } from "./components/Modal";
import {
    notificationSuccess,
    notificationError,
} from "./components/Notification";

const { Header, Content } = Layout;
const { Text } = Typography;
const wgbanner = () => <img src={wgBanner} />;

interface Client {
    ProfileID: number;
    ProfileName: string;
    ClientIP: string;
    PrivateKey: string;
    PublicKey: string;
    AllowedIPs: string;
}

function App() {
    const [users, setUsers] = useState<Client[]>();

    const fetchUsers = async () => {
        fetch("/api/v1/profiles", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((body) => {
                setUsers(body);
            });
    };

    useEffect(() => {
        fetchUsers();
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "scroll";
        };
    }, []);

    const columns: ColumnType<Client>[] = [
        {
            title: "",
            dataIndex: "ProfileName",
            key: "ProfileID",
            width: "30px",
            render: (ProfileName) => (
                <Dropdown
                    placement="bottomRight"
                    menu={{
                        ["items"]: [
                            {
                                key: "1",
                                label: (
                                    <a
                                        onClick={() =>
                                            GenerateModal(ProfileName)
                                        }
                                    >
                                        Generate Config
                                    </a>
                                ),
                            },
                            {
                                key: "2",
                                label: (
                                    <a
                                        onClick={async () => {
                                            await DeleteModal(ProfileName);
                                            fetchUsers();
                                        }}
                                    >
                                        Delete
                                    </a>
                                ),
                            },
                        ],
                    }}
                >
                    <a>
                        <MoreOutlined />
                    </a>
                </Dropdown>
            ),
        },
        {
            title: "Profile Name",
            dataIndex: "ProfileName",
            key: "ProfileName",
            width: "15%",
            ellipsis: {
                showTitle: false,
            },
        },
        {
            title: "Client IP",
            dataIndex: "ClientIP",
            key: "ClientIP",
            width: "15%",
            ellipsis: {
                showTitle: false,
            },
            render: (ClientIP) => (
                <Tooltip placement="topLeft" title={ClientIP}>
                    {ClientIP}
                </Tooltip>
            ),
        },
        {
            title: "Private Key",
            dataIndex: "PrivateKey",
            key: "PrivateKey",
            width: "25%",
            ellipsis: {
                showTitle: false,
            },
            render: (PrivateKey) => <HiddenKey text={PrivateKey} />,
        },
        {
            title: "Public Key",
            dataIndex: "PublicKey",
            key: "PublicKey",
            width: "25%",
            ellipsis: {
                showTitle: false,
            },
            render: (PublicKey) => <HiddenKey text={PublicKey} />,
        },
        {
            title: "Allowed IPs",
            dataIndex: "AllowedIPs",
            key: "AllowedIPs",
            ellipsis: {
                showTitle: false,
            },
            render: (AllowedIPs) => (
                <Tooltip placement="topLeft" title={AllowedIPs}>
                    {AllowedIPs}
                </Tooltip>
            ),
        },
    ];

    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const onSubmit = () => {
        var url = "/api/v1/profiles/new";
        var data = new FormData();
        form.validateFields()
            .then((values) => {
                data.append("profileName", values.profileName);
                data.append("clientIP", values.clientIP);
                data.append("allowedIPs", values.allowedIPs);

                fetch(url, {
                    method: "POST",
                    body: data,
                })
                    .then(async (res) => {
                        if (!res.ok) {
                            const text = await res.json();
                            throw new Error(text.error.Message);
                        }
                        var message = "Creating " + values.profileName;
                        var description = "This may take a while.";
                        notificationSuccess(message, description);
                    })
                    .catch((err) => {
                        notificationError(err.toString());
                    });

                form.submit();
            })
            .then(() => {
                fetchUsers();
            });
    };

    return (
        <Layout
            style={{
                height: "100vh",
                overflow: "auto",
                backgroundColor: "#D8DEE9",
            }}
        >
            <Header
                style={{
                    backgroundColor: "#3B4252",
                }}
            >
                <Icon
                    component={wgbanner}
                    style={{
                        width: "300px",
                        margin: "0.2em 0 0 -4em",
                    }}
                />

                <Text
                    style={{
                        fontSize: 12,
                        color: "#D8DEE9",
                        float: "right",
                        margin: "1.8em -2em 0 0",
                        userSelect: "none",
                    }}
                >
                    {"Made with ❤️ by "}
                    <a href="https://github.com/kudotuanminh" target="_blank">
                        @kudotuanminh
                    </a>
                </Text>
            </Header>

            <Content
                style={{
                    padding: 12,
                }}
            >
                <Space
                    direction="vertical"
                    style={{
                        width: "100%",
                    }}
                >
                    <Space style={{ float: "right" }}>
                        <Button
                            type="link"
                            onClick={() => {
                                showDrawer();
                            }}
                        >
                            New Profile
                        </Button>
                        <Button type="link" onClick={() => ApplyModal()}>
                            Apply
                        </Button>
                    </Space>
                    <Table
                        dataSource={users}
                        columns={columns}
                        loading={{
                            indicator: (
                                <LoadingOutlined style={{ fontSize: 72 }} />
                            ),
                            spinning: users === undefined,
                        }}
                        pagination={false}
                        scroll={{ y: "calc(100vh - 13em)" }}
                    />
                </Space>

                <Drawer
                    title="Create a new profile"
                    width={720}
                    onClose={onClose}
                    open={open}
                    extra={
                        <Space>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button onClick={onSubmit} type="primary">
                                Create
                            </Button>
                        </Space>
                    }
                >
                    <Form form={form} layout="vertical" onFinish={onClose}>
                        <Form.Item
                            name="profileName"
                            label="Profile Name"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please enter a valid Profile Name",
                                },
                            ]}
                        >
                            <Input allowClear placeholder="Example: minhnt" />
                        </Form.Item>
                        <Form.Item
                            name="clientIP"
                            label="Client IP"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter a valid Client IP",
                                },
                            ]}
                        >
                            <Input
                                allowClear
                                placeholder="Example: 192.168.1.2/32"
                            />
                        </Form.Item>
                        <Form.Item
                            name="allowedIPs"
                            label="Allowed IPs"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please enter a valid comma-separated list of Allowed IPs",
                                },
                            ]}
                        >
                            <Input
                                allowClear
                                placeholder="Example: 192.168.1.0/24, 192.168.2.0/24"
                            />
                        </Form.Item>
                    </Form>
                </Drawer>
            </Content>
        </Layout>
    );
}

export default App;
