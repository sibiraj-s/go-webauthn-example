package server

import "github.com/gin-gonic/gin"

func setCookie(c *gin.Context, key string, value string) {
	c.SetCookie(key, value, 0, "/", cookieDomain, true, true)
}

func deleteCookie(c *gin.Context, cookieName string) {
	c.SetCookie(cookieName, "", -1, "/", cookieDomain, true, true)
}
