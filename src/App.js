import React, { useState, useEffect } from "react";

function App() {
  const [mode, setMode] = useState("encode"); // encode | decode
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [key, setKey] = useState("");
  const [resultUrl, setResultUrl] = useState(null);
  const [decodedMessage, setDecodedMessage] = useState(null);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [stars, setStars] = useState([]);

  const backendUrl = "http://localhost:5000";

  // Generate stars for the galaxy effect
  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 300; i++) {
        const starType = Math.random();
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          animationDelay: Math.random() * 15,
          animationDuration: Math.random() * 25 + 5,
          type: starType > 0.9 ? 'shine' : starType > 0.7 ? 'sparkle' : starType > 0.3 ? 'twinkle' : 'fastTwinkle',
          color: Math.random() > 0.8 ? (darkMode ? '#ff6b6b' : '#e74c3c') : 
                 Math.random() > 0.6 ? (darkMode ? '#4ecdc4' : '#3498db') :
                 Math.random() > 0.4 ? (darkMode ? '#ffe66d' : '#f39c12') :
                 (darkMode ? '#ffffff' : '#4a90e2'),
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, [darkMode]);

  const resetFields = () => {
    setImageFile(null);
    setMessage("");
    setKey("");
    setError("");
    setResultUrl(null);
    setDecodedMessage(null);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetFields();
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleEncode = async () => {
    if (!imageFile || !message.trim() || !key.trim()) {
      setError("Please provide an image, a secret message, and an encryption key.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("message", message.trim());
    formData.append("key", key.trim());

    try {
      const response = await fetch(`${backendUrl}/encode`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.error || "Encoding failed.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (e) {
      setError("Encoding failed due to a network or server error.");
    }
  };

const handleDecode = async () => {
  if (!imageFile || !key.trim()) {
    setError("Please provide an image and the decryption key used during encoding.");
    return;
  }

  setError("");
  setDecodedMessage(null); // 👈 Clear previously decoded message

  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("key", key.trim());

  try {
    const response = await fetch(`${backendUrl}/decode`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Decoding failed.");
      return;
    }

    setDecodedMessage(data.message);
  } catch (e) {
    setError("Decoding failed due to a network or server error.");
  }
};


  const styles = {
    galaxyBackground: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: darkMode
        ? "radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 25%, #0f0f23 50%, #000000 100%)"
        : "radial-gradient(ellipse at center, #e8f4f8 0%, #d4e8f0 25%, #a8d0e6 50%, #74b9d8 100%)",
      overflow: "hidden",
      zIndex: -1,
    },
    star: {
      position: "absolute",
      borderRadius: "50%",
      backgroundColor: darkMode ? "#ffffff" : "#4a90e2",
      pointerEvents: "none",
    },
    shiningStar: {
      position: "absolute",
      borderRadius: "50%",
      pointerEvents: "none",
      filter: "blur(1px)",
      background: "radial-gradient(circle, currentColor 0%, transparent 70%)",
    },
    sparkleStar: {
      position: "absolute",
      pointerEvents: "none",
      width: "6px",
      height: "6px",
      background: "linear-gradient(45deg, transparent 30%, currentColor 50%, transparent 70%)",
      clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
    },
    shootingStar: {
      position: "absolute",
      width: "3px",
      height: "3px",
      background: darkMode 
        ? "radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0.8) 30%, transparent 70%)"
        : "radial-gradient(circle, #4a90e2 0%, rgba(74,144,226,0.8) 30%, transparent 70%)",
      borderRadius: "50%",
      boxShadow: darkMode 
        ? "0 0 6px #ffffff, 0 0 12px #ffffff, 0 0 18px #ffffff"
        : "0 0 6px #4a90e2, 0 0 12px #4a90e2, 0 0 18px #4a90e2",
    },
    shootingTail: {
      position: "absolute",
      width: "40px",
      height: "2px",
      background: darkMode
        ? "linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0.3), transparent)"
        : "linear-gradient(90deg, rgba(74,144,226,0.8), rgba(74,144,226,0.3), transparent)",
      transformOrigin: "right center",
      transform: "rotate(-45deg)",
      right: "3px",
      top: "1px",
    },
    nebula: {
      position: "absolute",
      borderRadius: "50%",
      background: darkMode
        ? "radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 100%)"
        : "radial-gradient(circle, rgba(147, 51, 234, 0.05) 0%, rgba(59, 130, 246, 0.03) 50%, transparent 100%)",
      animation: "nebulaPulse 8s ease-in-out infinite",
    },
    wrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      position: "relative",
      zIndex: 1,
    },
    container: {
      maxWidth: 600,
      width: "95%",
      padding: 25,
      background: darkMode
        ? "linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(44, 62, 80, 0.95) 100%)"
        : "linear-gradient(135deg, rgba(245, 247, 250, 0.95) 0%, rgba(195, 207, 226, 0.95) 100%)",
      borderRadius: 12,
      boxShadow: darkMode
        ? "0 8px 32px rgba(0,0,0,0.4), 0 0 50px rgba(147, 51, 234, 0.1)"
        : "0 8px 32px rgba(0,0,0,0.1), 0 0 50px rgba(74, 144, 226, 0.1)",
      backdropFilter: "blur(10px)",
      border: darkMode
        ? "1px solid rgba(255, 255, 255, 0.1)"
        : "1px solid rgba(255, 255, 255, 0.3)",
      color: darkMode ? "#f0f0f0" : "#2c3e50",
    },
    title: {
      textAlign: "center",
      marginBottom: 20,
      textShadow: darkMode ? "0 0 20px rgba(147, 51, 234, 0.5)" : "0 0 20px rgba(74, 144, 226, 0.3)",
    },
    section: {
      background: darkMode
        ? "rgba(46, 46, 46, 0.8)"
        : "rgba(255, 255, 255, 0.8)",
      padding: 20,
      borderRadius: 10,
      marginBottom: 25,
      backdropFilter: "blur(5px)",
      border: darkMode
        ? "1px solid rgba(255, 255, 255, 0.05)"
        : "1px solid rgba(255, 255, 255, 0.2)",
    },
    label: {
      display: "block",
      marginBottom: 6,
      fontWeight: "600",
    },
    input: {
      width: "100%",
      padding: 10,
      marginBottom: 15,
      borderRadius: 6,
      border: "1.5px solid #bdc3c7",
      fontSize: 16,
      backgroundColor: darkMode ? "rgba(68, 68, 68, 0.8)" : "rgba(255, 255, 255, 0.9)",
      color: darkMode ? "#f0f0f0" : "#2c3e50",
      backdropFilter: "blur(5px)",
    },
    errorText: {
      color: "#e74c3c",
      fontWeight: "600",
      marginTop: -10,
      marginBottom: 15,
    },
    imagePreview: {
      maxWidth: "100%",
      marginTop: 15,
      borderRadius: 10,
      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    },
    buttonPrimary: {
      background: "linear-gradient(45deg, #6a11cb, #2575fc)",
      color: "white",
      fontWeight: "700",
      padding: "12px 25px",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      fontSize: 16,
      marginRight: 10,
      boxShadow: "0 4px 15px rgba(106, 17, 203, 0.3)",
      transition: "all 0.3s ease",
    },
    themeToggle: {
      position: "absolute",
      top: 20,
      right: 20,
      padding: "8px 15px",
      background: darkMode
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(51, 51, 51, 0.1)",
      border: "none",
      borderRadius: 6,
      color: darkMode ? "#f0f0f0" : "#2c3e50",
      cursor: "pointer",
      backdropFilter: "blur(10px)",
      zIndex: 10,
    },
  };

  const keyframes = `
    @keyframes twinkle {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.2); }
    }
    
    @keyframes fastTwinkle {
      0%, 100% { opacity: 0.1; transform: scale(0.8); }
      25% { opacity: 0.8; transform: scale(1.3); }
      50% { opacity: 0.3; transform: scale(1); }
      75% { opacity: 1; transform: scale(1.5); }
    }
    
    @keyframes shine {
      0% { opacity: 0; transform: scale(0.5) rotate(0deg); }
      50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
      100% { opacity: 0; transform: scale(0.5) rotate(360deg); }
    }
    
    @keyframes sparkle {
      0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
      50% { opacity: 1; transform: scale(1.5) rotate(180deg); }
    }
    
    @keyframes shooting {
      0% { transform: translateX(-100vw) translateY(100vh); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateX(100vw) translateY(-100vh); opacity: 0; }
    }
    
    @keyframes shootingStar2 {
      0% { transform: translateX(100vw) translateY(-100vh); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateX(-100vw) translateY(100vh); opacity: 0; }
    }
    
    @keyframes nebulaPulse {
      0%, 100% { transform: scale(1); opacity: 0.3; }
      50% { transform: scale(1.2); opacity: 0.6; }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    
    @keyframes drift {
      0% { transform: translateX(0px) translateY(0px); }
      25% { transform: translateX(10px) translateY(-5px); }
      50% { transform: translateX(-5px) translateY(-10px); }
      75% { transform: translateX(-10px) translateY(5px); }
      100% { transform: translateX(0px) translateY(0px); }
    }
    
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 5px currentColor; }
      50% { box-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
    }
    
    @keyframes constellation {
      0% { opacity: 0.3; }
      50% { opacity: 1; }
      100% { opacity: 0.3; }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      
      {/* Galaxy Background */}
      <div style={styles.galaxyBackground}>
        {/* Enhanced Stars with Multiple Animation Types */}
        {stars.map((star) => {
          const baseStyle = {
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: star.opacity,
            color: star.color,
            animationDelay: `${star.animationDelay}s`,
            animationDuration: `${star.animationDuration}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
          };

          if (star.type === 'shine') {
            return (
              <div
                key={star.id}
                style={{
                  ...styles.shiningStar,
                  ...baseStyle,
                  width: `${star.size * 2}px`,
                  height: `${star.size * 2}px`,
                  animation: `shine ${star.animationDuration}s ease-in-out infinite, glow ${star.animationDuration * 0.7}s ease-in-out infinite`,
                }}
              />
            );
          } else if (star.type === 'sparkle') {
            return (
              <div
                key={star.id}
                style={{
                  ...styles.sparkleStar,
                  ...baseStyle,
                  animation: `sparkle ${star.animationDuration}s ease-in-out infinite, drift ${star.animationDuration * 2}s ease-in-out infinite`,
                }}
              />
            );
          } else if (star.type === 'fastTwinkle') {
            return (
              <div
                key={star.id}
                style={{
                  ...styles.star,
                  ...baseStyle,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  backgroundColor: star.color,
                  animation: `fastTwinkle ${star.animationDuration * 0.5}s ease-in-out infinite, drift ${star.animationDuration * 1.5}s ease-in-out infinite`,
                  boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
                }}
              />
            );
          } else {
            return (
              <div
                key={star.id}
                style={{
                  ...styles.star,
                  ...baseStyle,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  backgroundColor: star.color,
                  animation: `twinkle ${star.animationDuration}s ease-in-out infinite, constellation ${star.animationDuration * 1.3}s ease-in-out infinite`,
                }}
              />
            );
          }
        })}
        
        {/* Enhanced Shooting Stars with Tails */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`shooting-${i}`}
            style={{
              ...styles.shootingStar,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `${i % 2 === 0 ? 'shooting' : 'shootingStar2'} ${4 + Math.random() * 3}s linear infinite`,
              animationDelay: `${i * 1.5 + Math.random() * 2}s`,
            }}
          >
            <div style={styles.shootingTail} />
          </div>
        ))}
        
        {/* Enhanced Nebula Effects */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`nebula-${i}`}
            style={{
              ...styles.nebula,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 400 + 200}px`,
              height: `${Math.random() * 400 + 200}px`,
              animation: `nebulaPulse ${8 + Math.random() * 4}s ease-in-out infinite, drift ${15 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
        
        {/* Constellation Lines */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`constellation-${i}`}
            style={{
              position: 'absolute',
              width: `${Math.random() * 100 + 50}px`,
              height: '1px',
              background: darkMode 
                ? `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`
                : `linear-gradient(90deg, transparent, rgba(74,144,226,0.2), transparent)`,
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animation: `constellation ${5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
        
        {/* Floating Stardust */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`stardust-${i}`}
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              background: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(74,144,226,0.6)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              borderRadius: '50%',
              animation: `float ${10 + Math.random() * 10}s ease-in-out infinite, twinkle ${3 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              boxShadow: `0 0 3px currentColor`,
            }}
          />
        ))}
      </div>

      <div style={styles.wrapper}>
        <button onClick={toggleTheme} style={styles.themeToggle}>
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>

        <div style={styles.container}>
          <h2 style={styles.title}>🔐 Secure Steganography Tool</h2>

          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <button
              onClick={() => switchMode("encode")}
              style={{
                ...styles.buttonPrimary,
                background: mode === "encode" ? "#6a11cb" : "#bdc3c7",
                color: mode === "encode" ? "white" : "#2c3e50",
              }}
            >
              Encode
            </button>
            <button
              onClick={() => switchMode("decode")}
              style={{
                ...styles.buttonPrimary,
                background: mode === "decode" ? "#2575fc" : "#bdc3c7",
                color: mode === "decode" ? "white" : "#2c3e50",
              }}
            >
              Decode
            </button>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Select Image:</label>
            <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/bmp, image/tiff, image/webp"
                  onChange={(e) => {
                    setImageFile(e.target.files[0]);
                    setError("");
                    setDecodedMessage(null);
                    setResultUrl(null);
                  }}
                  style={styles.input}
                />


            {mode === "encode" && (
              <>
                <label style={styles.label}>Secret Message:</label>
                <textarea
                  rows={4}
                  placeholder="Message to hide in the image"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ ...styles.input, resize: "vertical" }}
                />
              </>
            )}

            <label style={styles.label}>
              {mode === "encode" ? "Encryption Key:" : "Decryption Key:"}
            </label>
            <input
              type="password"
              placeholder={
                mode === "encode"
                  ? "Key to encrypt the message"
                  : "Key used during encoding"
              }
              value={key}
              onChange={(e) => setKey(e.target.value)}
              style={styles.input}
              autoComplete="off"
            />

            {mode === "encode" ? (
              <button style={styles.buttonPrimary} onClick={handleEncode}>
                Encode Message
              </button>
            ) : (
              <button style={styles.buttonPrimary} onClick={handleDecode}>
                Decode Message
              </button>
            )}

            {error && (
                        <div
                          style={{
                            backgroundColor: darkMode ? "#4b1c1c" : "#fdecea",
                            color: darkMode ? "#f8d7da" : "#c0392b",
                            padding: "10px 15px",
                            borderRadius: 8,
                            marginTop: 20,
                            marginBottom: 10,
                            border: darkMode
                              ? "1px solid rgba(255, 0, 0, 0.3)"
                              : "1px solid rgba(192, 57, 43, 0.3)",
                            fontWeight: 500,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                          }}
                        >
                          ❌ {error}
                        </div>
                      )}


            {decodedMessage && mode === "decode" && (
              <div style={{ marginTop: 20 }}>
                <h3 style={{ color: "#2ecc71" }}>✅ Decoded Message</h3>
                <div
                  style={{
                    backgroundColor: darkMode ? "rgba(28, 28, 28, 0.8)" : "rgba(236, 240, 241, 0.8)",
                    padding: 12,
                    borderRadius: 8,
                    whiteSpace: "pre-wrap",
                    backdropFilter: "blur(5px)",
                  }}
                >
                  {decodedMessage}
                </div>
              </div>
            )}

           

            {resultUrl && mode === "encode" && (
              <div style={{ marginTop: 20 }}>
                <h3>🎉 Encoded Image</h3>
                <a
                  href={resultUrl}
                  download="encoded_image.png"
                  style={{ fontWeight: 600, color: "#34495e" }}
                >
                  ⬇ Download Encoded Image
                </a>
                <br />
                <img src={resultUrl} alt="Encoded" style={styles.imagePreview} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;