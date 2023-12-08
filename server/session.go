package main

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"sync"

	"github.com/go-webauthn/webauthn/webauthn"
)

type SessionData struct {
	email       string
	sessionData *webauthn.SessionData
}

type Session struct {
	sessions map[string]*SessionData
	mu       sync.RWMutex
}

var sessionDb *Session = &Session{
	sessions: make(map[string]*SessionData),
}

// GetUser returns a *User by the user's username
func (db *Session) GetSession(sessionID string) (*SessionData, error) {

	db.mu.Lock()
	defer db.mu.Unlock()

	session, ok := db.sessions[sessionID]
	if !ok {
		return nil, fmt.Errorf("error getting session '%s': does not exist", sessionID)
	}

	return session, nil
}

func (db *Session) DeleteSession(sessionID string) {
	db.mu.Lock()
	defer db.mu.Unlock()

	delete(db.sessions, sessionID)
}

// PutUser stores a new user by the user's username
func (db *Session) StartSession(data *SessionData) string {

	db.mu.Lock()
	defer db.mu.Unlock()

	sessionId, _ := random(32)
	db.sessions[sessionId] = data

	return sessionId
}

func random(length int) (string, error) {
	randomData := make([]byte, length)
	_, err := rand.Read(randomData)
	if err != nil {
		return "", err
	}

	return hex.EncodeToString(randomData), nil
}
