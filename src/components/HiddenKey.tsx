import { Button, Typography } from "antd";
import { useState } from "react";

const { Text } = Typography;

export function HiddenKey(props: { text: string }) {
    const [hidden, setHidden] = useState(true);
    return (
        <>
            {hidden ? (
                <Button
                    type="text"
                    style={{ padding: "5px" }}
                    onClick={() => setHidden(false)}
                >
                    <Text italic>Hidden</Text>
                </Button>
            ) : (
                <Button
                    type="text"
                    style={{ padding: "5px" }}
                    onClick={() => setHidden(true)}
                >
                    {props.text}
                </Button>
            )}
        </>
    );
}
