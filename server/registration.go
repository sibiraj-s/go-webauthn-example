package server

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-webauthn/webauthn/protocol"
	"github.com/go-webauthn/webauthn/webauthn"
)

type BeingRegistrationRequestBody struct {
	Email string `json:"email"`
}

func BeginRegistration(c *gin.Context) {

	var body BeingRegistrationRequestBody

	// Call BindJSON to bind the received JSON to
	// newAlbum.
	if err := c.BindJSON(&body); err != nil {
		return
	}

	email := body.Email

	log.Println("Beginning registration for: ", email)

	// get user
	user, err := usersDB.GetUser(email)

	// user doesn't exist, create new user
	if err != nil {
		log.Println("User doesn't exist. Creating new user for: ", email)
		displayName := strings.Split(email, "@")[0]
		user = NewUser(email, displayName)
		usersDB.PutUser(user)
	}

	registerOptions := func(credCreationOpts *protocol.PublicKeyCredentialCreationOptions) {
		credCreationOpts.CredentialExcludeList = user.CredentialExcludeList()
	}

	authSelect := protocol.AuthenticatorSelection{
		AuthenticatorAttachment: protocol.AuthenticatorAttachment("platform"),
		RequireResidentKey:      protocol.ResidentKeyNotRequired(),
		UserVerification:        protocol.VerificationRequired,
	}

	// Updating the ConveyencePreference options.
	// See the struct declarations for values
	conveyancePref := protocol.PreferNoAttestation

	// generate PublicKeyCredentialCreationOptions, session data
	options, sessionData, err := web.BeginRegistration(
		user,
		webauthn.WithAuthenticatorSelection(authSelect),
		webauthn.WithConveyancePreference(conveyancePref),
		webauthn.WithExclusions(user.WebAuthnCredentialDescriptors()),
		registerOptions,
	)

	if err != nil {
		log.Println("Unable to create publick key credentials options: ", err)
		c.IndentedJSON(http.StatusOK, gin.H{"error": err.Error()})
		return
	}

	userSession := &SessionData{
		email:       email,
		sessionData: sessionData,
	}

	setCookie(c, "registration", sessionDb.StartSession(userSession))
	c.IndentedJSON(http.StatusOK, options.Response)
}

func FinishRegistration(c *gin.Context) {

	cookie, err := c.Request.Cookie("registration")
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

	// get user
	log.Println("Finalising registration for: ", userSession.email)

	user, err := usersDB.GetUser(userSession.email)
	// user doesn't exist
	if err != nil {
		log.Println("User doesn't exist: ", err)
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	credential, err := web.FinishRegistration(user, *userSession.sessionData, c.Request)
	if err != nil {
		log.Println("Unable to Finish Registration: ", err)

		protocolErr := err.(*protocol.Error)
		log.Println(protocolErr.DevInfo)

		c.IndentedJSON(http.StatusBadRequest, gin.H{
			"type":    protocolErr.Type,
			"devInfo": protocolErr.DevInfo,
			"error":   err.Error(),
		})
		return
	}

	user.AddCredential(*credential)

	sessionDb.DeleteSession(cookie.Value)
	deleteCookie(c, "registration")

	c.IndentedJSON(http.StatusCreated, gin.H{"message": "Registration success"})
}
