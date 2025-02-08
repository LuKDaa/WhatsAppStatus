(function () {
    console.log("🟢 Monitoring status started...");

    let prevState = null;
    let logData = "Activity log:\n";
    const audio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAABCxAgAEABAAZGF0YQAAAAA=");

    audio.addEventListener('canplaythrough', () => {
        console.log("🔊 Audio loaded and ready to play.");
    }, false);

    audio.addEventListener('error', (e) => {
        console.error("❌ Error loading audio:", e);
    }, false);

    function downloadLog() {
        const blob = new Blob([logData], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "status_log.txt";
        link.click();
        URL.revokeObjectURL(url);
    }

    function checkStatus() {
        try {
            // Ajusta el selector para que sea más específico
            let statusElement = document.querySelector("span[title], div[title]");
            let currentState = "offline";

            if (statusElement) {
                const statusText = statusElement.getAttribute("title").toLowerCase();
                console.log(`🔍 Found status element with text: ${statusText}`);

                if (statusText.includes("online") || statusText.includes("en línea")) {
                    currentState = "online";
                } else if (statusText.includes("typing...") || statusText.includes("escribiendo...")) {
                    currentState = "typing";
                } else if (statusText.includes("recording audio...") || statusText.includes("grabando audio...")) {
                    currentState = "recording audio";
                }
            } else {
                console.log("🔍 No status element found.");
            }

            if (currentState !== prevState) {
                let timestamp = new Date().toLocaleTimeString();
                console.log(`[${timestamp}] 🔔 Status: ${currentState}`);
                logData += `[${timestamp}] 🔔 Status: ${currentState}\n`;

                if (currentState === "online" || currentState === "typing" || currentState === "recording audio") {
                    console.log("🔊 Attempting to play audio...");
                    audio.play().then(() => {
                        console.log("🔊 Audio played successfully.");
                    }).catch((error) => {
                        console.error("❌ Error playing audio:", error);
                    });
                }

                prevState = currentState;
            }
        } catch (error) {
            console.error("Error checking status:", error);
        }
    }

    const intervalId = setInterval(checkStatus, 2000);

    window.stopMonitoring = function () {
        clearInterval(intervalId);
        console.log("🔴 Monitoring stopped.");
        downloadLog();
    };

    console.log("ℹ️ To stop monitoring and download the log, type: stopMonitoring()");
})();
