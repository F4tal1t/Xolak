import React, { useState, useRef, useEffect } from "react";
import { queryAgent, Repository, checkBackendHealth } from "./utils/api";

type Message = {
    id: string;
    sender: "user" | "bot";
    text?: string;
    repositories?: Repository[];
    timestamp: Date;
    isLoading?: boolean;
};

const RepositoryCard: React.FC<{ repo: Repository }> = ({ repo }) => {
    const difficultyColor = {
        "Beginner": "#22c55e",
        "Intermediate": "#f59e0b", 
        "Advanced": "#ef4444"
    }[repo.difficulty] || "#6b7280";

    return (
        <div style={styles.repoCard}>
            <div style={styles.repoHeader}>
                <div style={styles.repoName}>
                    <a href={repo.url} target="_blank" rel="noopener noreferrer" style={styles.repoLink}>
                        {repo.name}
                    </a>
                    <div style={styles.repoMeta}>
                        <span style={styles.language}>{repo.language}</span>
                        <span style={styles.stars}>⭐ {repo.stars}</span>
                        <span style={{...styles.difficulty, backgroundColor: difficultyColor}}>
                            {repo.difficulty}
                        </span>
                    </div>
                </div>
            </div>
            
            <p style={styles.repoDescription}>{repo.description}</p>
            
            {repo.good_first_issues && repo.good_first_issues.length > 0 && (
                <div style={styles.issuesSection}>
                    <h4 style={styles.issuesTitle}>Good First Issues:</h4>
                    <div style={styles.issuesList}>
                        {repo.good_first_issues.slice(0, 3).map((issue, idx) => (
                            <a 
                                key={idx} 
                                href={issue.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={styles.issueLink}
                            >
                                <span style={styles.issueIcon}>🐛</span>
                                {issue.title}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const LoadingDots: React.FC = () => (
    <div style={styles.loadingContainer}>
        <div style={styles.loadingDots}>
            <div style={styles.dot}></div>
            <div style={styles.dot}></div>
            <div style={styles.dot}></div>
        </div>
        <span style={styles.loadingText}>Finding repositories...</span>
    </div>
);

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { 
            id: '1',
            sender: "bot", 
            text: "👋 Hello! I'm Xolak, your open source contribution assistant. Tell me about your programming interests and experience level, and I'll find perfect repositories for you to contribute to!",
            timestamp: new Date()
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [backendConnected, setBackendConnected] = useState<boolean | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Check backend connection on component mount
    useEffect(() => {
        const checkConnection = async () => {
            const isConnected = await checkBackendHealth();
            setBackendConnected(isConnected);
            
            if (!isConnected) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    sender: "bot",
                    text: "⚠️ Warning: I'm having trouble connecting to my backend server. Please make sure the backend is running on port 8080. You can still try asking questions, but I might not be able to provide real-time repository recommendations.",
                    timestamp: new Date()
                }]);
            }
        };
        
        checkConnection();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        
        const userMessage: Message = { 
            id: Date.now().toString(),
            sender: "user", 
            text: input,
            timestamp: new Date()
        };
        
        setMessages((msgs) => [...msgs, userMessage]);
        setInput("");
        setIsLoading(true);

        // Add loading message
        const loadingMessage: Message = {
            id: Date.now().toString() + "_loading",
            sender: "bot",
            isLoading: true,
            timestamp: new Date()
        };
        setMessages((msgs) => [...msgs, loadingMessage]);

        try {
            console.log('🔄 Sending query to backend:', input);
            const response = await queryAgent(input);
            
            // Remove loading message and add response
            setMessages((msgs) => {
                const withoutLoading = msgs.filter(msg => !msg.isLoading);
                return [...withoutLoading, {
                    id: Date.now().toString(),
                    sender: "bot",
                    text: response.message || "Here are some great repositories for you:",
                    repositories: response.recommendations,
                    timestamp: new Date()
                }];
            });
            
            // Update connection status on successful request
            setBackendConnected(true);
            
        } catch (error) {
            console.error('❌ Failed to get response:', error);
            
            // Update connection status
            setBackendConnected(false);
            
            // Remove loading message and add error
            setMessages((msgs) => {
                const withoutLoading = msgs.filter(msg => !msg.isLoading);
                
                let errorMessage = "🚨 Sorry, I'm having trouble right now. ";
                
                if (error instanceof Error) {
                    if (error.message.includes('backend server')) {
                        errorMessage += "Please make sure the backend server is running on port 8080.";
                    } else if (error.message.includes('timed out')) {
                        errorMessage += "The request timed out. Please try again.";
                    } else if (error.message.includes('fetch')) {
                        errorMessage += "Cannot connect to the backend. Is it running on http://localhost:8080?";
                    } else {
                        errorMessage += error.message;
                    }
                } else {
                    errorMessage += "An unexpected error occurred. Please try again.";
                }
                
                return [...withoutLoading, {
                    id: Date.now().toString(),
                    sender: "bot",
                    text: errorMessage,
                    timestamp: new Date()
                }];
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div style={styles.chatContainer}>
            <div style={styles.header}>
                <div style={styles.headerContent}>
                    <div style={styles.titleSection}>
                        <h1 style={styles.title}>💻 Xolak Chat</h1>
                        <div style={styles.connectionStatus}>
                            <div style={{
                                ...styles.statusDot,
                                backgroundColor: backendConnected === null ? '#f59e0b' : 
                                               backendConnected ? '#22c55e' : '#ef4444'
                            }}></div>
                            <span style={styles.statusText}>
                                {backendConnected === null ? 'Checking...' :
                                 backendConnected ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>
                    </div>
                    <p style={styles.subtitle}>Find your perfect open source project</p>
                </div>
            </div>
            
            <div style={styles.messages}>
                {messages.map((msg) => (
                    <div key={msg.id} style={styles.messageGroup}>
                        <div style={styles.messageHeader}>
                            <span style={msg.sender === "user" ? styles.userLabel : styles.botLabel}>
                                {msg.sender === "user" ? "You" : "🤖 Xolak"}
                            </span>
                            <span style={styles.timestamp}>
                                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                        
                        {msg.isLoading ? (
                            <LoadingDots />
                        ) : (
                            <>
                                {msg.text && (
                                    <div style={msg.sender === "user" ? styles.userMessage : styles.botMessage}>
                                        {msg.text}
                                    </div>
                                )}
                                
                                {msg.repositories && msg.repositories.length > 0 && (
                                    <div style={styles.repositoriesGrid}>
                                        {msg.repositories.map((repo, idx) => (
                                            <RepositoryCard key={idx} repo={repo} />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div style={styles.inputSection}>
                <div style={styles.inputContainer}>
                    <textarea
                        style={styles.textarea}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                        placeholder="Describe your programming interests (e.g., 'Beginner Python developer looking for first contribution')"
                        rows={1}
                        disabled={isLoading}
                    />
                    <button 
                        style={{...styles.sendButton, opacity: isLoading ? 0.5 : 1}} 
                        onClick={handleSend}
                        disabled={isLoading}
                    >
                        {isLoading ? "..." : "→"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    chatContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#0a0a0a',
        color: '#ffffff',
    },
    header: {
        padding: '20px 24px',
        borderBottom: '1px solid #333',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    },
    headerContent: {
        textAlign: 'center',
    },
    titleSection: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        flexWrap: 'wrap',
    },
    title: {
        margin: 0,
        fontSize: '28px',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    connectionStatus: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.1)',
        fontSize: '12px',
    },
    statusDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        transition: 'background-color 0.3s ease',
    },
    statusText: {
        color: '#ccc',
        fontSize: '12px',
    },
    subtitle: {
        margin: '4px 0 0 0',
        color: '#888',
        fontSize: '14px',
    },
    messages: {
        flex: 1,
        padding: '24px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    messageGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    messageHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    userLabel: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#00d4ff',
    },
    botLabel: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#7c3aed',
    },
    timestamp: {
        fontSize: '12px',
        color: '#666',
    },
    userMessage: {
        alignSelf: 'flex-end',
        background: 'linear-gradient(135deg, #00d4ff 0%, #0ea5e9 100%)',
        color: '#000',
        padding: '12px 18px',
        borderRadius: '18px 18px 4px 18px',
        maxWidth: '70%',
        fontSize: '15px',
        lineHeight: '1.4',
    },
    botMessage: {
        alignSelf: 'flex-start',
        background: '#1a1a1a',
        border: '1px solid #333',
        color: '#ffffff',
        padding: '12px 18px',
        borderRadius: '18px 18px 18px 4px',
        maxWidth: '85%',
        fontSize: '15px',
        lineHeight: '1.4',
    },
    repositoriesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px',
        marginTop: '12px',
    },
    repoCard: {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        border: '1px solid #333',
        borderRadius: '12px',
        padding: '16px',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
    },
    repoHeader: {
        marginBottom: '12px',
    },
    repoName: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    repoLink: {
        color: '#00d4ff',
        textDecoration: 'none',
        fontSize: '16px',
        fontWeight: '600',
    },
    repoMeta: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
    },
    language: {
        background: '#333',
        color: '#fff',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '12px',
    },
    stars: {
        color: '#fbbf24',
        fontSize: '12px',
    },
    difficulty: {
        color: '#000',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
    },
    repoDescription: {
        color: '#ccc',
        fontSize: '14px',
        lineHeight: '1.4',
        margin: '0 0 12px 0',
    },
    issuesSection: {
        marginTop: '12px',
    },
    issuesTitle: {
        color: '#fff',
        fontSize: '14px',
        margin: '0 0 8px 0',
        fontWeight: '600',
    },
    issuesList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    issueLink: {
        color: '#22c55e',
        textDecoration: 'none',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 0',
    },
    issueIcon: {
        fontSize: '12px',
    },
    loadingContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '18px 18px 18px 4px',
        maxWidth: '200px',
    },
    loadingDots: {
        display: 'flex',
        gap: '4px',
    },
    dot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#7c3aed',
        animation: 'pulse 1.5s ease-in-out infinite',
    },
    loadingText: {
        color: '#888',
        fontSize: '14px',
    },
    inputSection: {
        padding: '24px',
        borderTop: '1px solid #333',
        background: '#0a0a0a',
    },
    inputContainer: {
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-end',
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '24px',
        padding: '12px 16px',
    },
    textarea: {
        flex: 1,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        color: '#ffffff',
        fontSize: '16px',
        resize: 'none',
        minHeight: '24px',
        maxHeight: '120px',
        lineHeight: '1.4',
    },
    sendButton: {
        background: 'linear-gradient(135deg, #7c3aed 0%, #00d4ff 100%)',
        border: 'none',
        borderRadius: '20px',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '18px',
        color: '#000',
        fontWeight: 'bold',
        transition: 'all 0.2s ease',
    },
};

// Add CSS animation for loading dots
const cssAnimation = `
@keyframes pulse {
    0%, 80%, 100% { opacity: 0.3; }
    40% { opacity: 1; }
}
`;

// Inject CSS animation
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = cssAnimation;
    document.head.appendChild(style);
}

export default Chat;