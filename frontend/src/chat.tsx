import React, { useState, useRef, useEffect } from "react";

type Message = {
    sender: "user" | "bot";
    text: string;
};

const initialBotMessage = "Hello! How can I help you today?";

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { sender: "bot", text: initialBotMessage },
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        const userMessage: Message = { sender: "user", text: input };
        setMessages((msgs) => [...msgs, userMessage]);
        setInput("");

        // Simulate bot response
        setTimeout(() => {
            setMessages((msgs) => [
                ...msgs,
                { sender: "bot", text: "I'm a bot. You said: " + input },
            ]);
        }, 700);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>Chat Bot</div>
            <div style={styles.messages}>
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        style={{
                            ...styles.message,
                            alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                            background: msg.sender === "user" ? "#d1e7dd" : "#f8d7da",
                        }}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div style={styles.inputArea}>
                <input
                    style={styles.input}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Type your message..."
                />
                <button style={styles.button} onClick={handleSend}>
                    Send
                </button>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        width: 400,
        margin: "40px auto",
        border: "1px solid #ccc",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        height: 500,
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    },
    header: {
        padding: "16px",
        borderBottom: "1px solid #eee",
        fontWeight: "bold",
        fontSize: 20,
        background: "#f5f5f5",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    messages: {
        flex: 1,
        padding: "16px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        background: "#fafbfc",
    },
    message: {
        maxWidth: "70%",
        padding: "10px 14px",
        borderRadius: 16,
        fontSize: 15,
        marginBottom: 2,
    },
    inputArea: {
        display: "flex",
        borderTop: "1px solid #eee",
        padding: "12px",
        background: "#f5f5f5",
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    input: {
        flex: 1,
        padding: "8px 12px",
        borderRadius: 16,
        border: "1px solid #ccc",
        fontSize: 15,
        outline: "none",
        marginRight: 8,
    },
    button: {
        padding: "8px 18px",
        borderRadius: 16,
        border: "none",
        background: "#0d6efd",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",
    },
};

export default Chat;