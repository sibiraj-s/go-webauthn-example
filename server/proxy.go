package main

import (
	"log"
	"net/http/httputil"
	"net/url"

	"github.com/gin-gonic/gin"
)

func proxyClient(c *gin.Context) {

	target := clientProxyOrigin

	url, err := url.Parse(target)
	if err != nil {
		log.Println("Reverse Proxy target url could not be parsed:", err)
		return
	}

	proxy := httputil.NewSingleHostReverseProxy(url)
	proxy.ServeHTTP(c.Writer, c.Request)
}
