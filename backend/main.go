package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type requestPayload struct {
	Name  string                 `json:"name"`
	ID    string                 `json:"id"`
	Props map[string]interface{} `json:"props"`
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Printf("Error upgrading connection: %v\n", err)
		return
	}
	defer conn.Close()

	for {
		messageType, message, err := conn.ReadMessage()
		if err != nil {
			fmt.Printf("Error reading message: %v\n", err)
			break
		}
		fmt.Printf("Received: %s\n", message)

		var req requestPayload
		if err := json.Unmarshal(message, &req); err != nil {
			fmt.Printf("Error unmarshalling request: %v\n", err)
			continue
		}

		response := map[string]interface{}{
			"id":     req.ID,
			"result": fmt.Sprintf("Hello from the server! You requested module %s", req.Name),
		}

		respBytes, err := json.Marshal(response)
		if err != nil {
			fmt.Printf("Error marshalling response: %v\n", err)
			continue
		}

		if err := conn.WriteMessage(messageType, respBytes); err != nil {
			fmt.Printf("Error writing message: %v\n", err)
			break
		}
	}
}

func main() {
	if err := godotenv.Load(); err != nil {
		fmt.Printf("Error loading .env file: %v\n", err)
	}

	staticDir := http.FileServer(http.Dir("./build/dist"))
	http.Handle("/", staticDir)
	http.HandleFunc("/ws", handleWebSocket)

	port := os.Getenv("VITE_GO_PORT")
	if port == "" {
		port = "3001"
	}

	fmt.Printf("ENV: %s\n", os.Getenv("ENV"))
	fmt.Printf("Server starting on http://localhost:%s/\n", port)

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		fmt.Printf("Error starting server: %v\n", err)
	}
}
