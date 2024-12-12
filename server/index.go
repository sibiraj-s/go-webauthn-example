package server

import (
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-webauthn/webauthn/webauthn"
)

var (
	web *webauthn.WebAuthn
	err error
)

func Run() {
	// Your initialization function
	web, err = webauthn.New(&webauthn.Config{
		RPDisplayName: "Acme Corp.",                   // Display Name for your site
		RPID:          host,                           // Generally the domain name for your site
		RPOrigins:     []string{clientOriginWithPort}, // The origin URL for WebAuthn requests
	})

	if err != nil {
		log.Fatal("failed to create WebAuthn from config:", err)
	}

	// gin.SetMode(gin.ReleaseMode)
	router := gin.Default()

	c := cors.New(cors.Config{
		AllowOrigins:     []string{clientOrigin},
		AllowMethods:     []string{"GET, POST, PATCH, PUT, DELETE, OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Type", "Bearer", "Bearer ", "content-type", "Origin", "Accept"},
		AllowCredentials: true,
		AllowOriginFunc: func(incomingOrigin string) bool {
			return incomingOrigin == clientOrigin
		},
		MaxAge: 12 * time.Hour,
	})

	router.Use(c)

	api := router.Group("/api")
	{
		api.POST("/register/begin", BeginRegistration)
		api.POST("/register/finish", FinishRegistration)
		api.POST("/login/begin", BeginLogin)
		api.POST("/login/finish", FinishLogin)
	}

	router.SetTrustedProxies(nil)

	// handle all other requests to client using the proxy
	router.NoRoute(proxyClient)

	router.RunTLS("localhost:7890", "./certs/webauthn.local.pem", "./certs/webauthn.local-key.pem")
}
