package server

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-webauthn/webauthn/protocol"
)

type BeingLoginRequestBody struct {
	Email string
}

func BeginLogin(c *gin.Context) {

	var body BeingLoginRequestBody

	// Call BindJSON to bind the received JSON to
	// newAlbum.
	if err := c.BindJSON(&body); err != nil {
		return
	}

	email := body.Email
	log.Println("Being Login: ", email)

	// get user
	user, err := usersDB.GetUser(email)

	// user doesn't exist
	if err != nil {
		log.Println("User doesn't exist: ", err)
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	// generate PublicKeyCredentialRequestOptions, session data
	options, sessionData, err := web.BeginLogin(user)
	if err != nil {
		log.Println("Unable to create credential request options: ", err)

		protocolErr := err.(*protocol.Error)
		log.Println(protocolErr.DevInfo)

		c.IndentedJSON(http.StatusBadRequest, gin.H{
			"type":    protocolErr.Type,
			"devInfo": protocolErr.DevInfo,
			"error":   err.Error(),
		})
		return
	}

	userSession := &SessionData{
		email:       email,
		sessionData: sessionData,
	}

	setCookie(c, "authentication", sessionDb.StartSession(userSession))
	c.IndentedJSON(http.StatusOK, options.Response)
}

func FinishLogin(c *gin.Context) {

	// load the session data
	cookie, err := c.Request.Cookie("authentication")
	if err != nil {
		log.Println("Cookie not found: ", err)
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Cookie not found"})
		return
	}

	userSession, err := sessionDb.GetSession(cookie.Value)
	if err != nil {
		log.Println("Session not found: ", err)
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Cookie session not found"})
		return
	}

	log.Println("Finishing login: ", userSession.email)

	// get user
	user, err := usersDB.GetUser(userSession.email)

	// user doesn't exist
	if err != nil {
		log.Println("User doesn't exist: ", userSession.email)
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	// in an actual implementation, we should perform additional checks on
	// the returned 'credential', i.e. check 'credential.Authenticator.CloneWarning'
	// and then increment the credentials counter
	credential, err := web.FinishLogin(user, *userSession.sessionData, c.Request)
	if err != nil {
		log.Println("Unable to Finish Login: ", err)
		protocolErr := err.(*protocol.Error)
		log.Println(protocolErr.DevInfo)

		c.IndentedJSON(http.StatusBadRequest, gin.H{
			"type":    protocolErr.Type,
			"devInfo": protocolErr.DevInfo,
			"error":   err.Error(),
		})
		return
	}

	if credential.Authenticator.CloneWarning {
		log.Println("Cloned key detected")
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Cloned key detected"})
		return
	}

	sessionDb.DeleteSession(cookie.Value)
	deleteCookie(c, "authentication")

	setCookie(c, "auth", "true")

	// handle successful login
	c.IndentedJSON(http.StatusCreated, gin.H{"message": "Login success"})
}
