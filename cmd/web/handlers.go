package main

import (
	"PlagiarismDuck/pkg"
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"strings"
	"fmt"
)

func homepage(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	ts, err := template.ParseFiles("ui/html/home.page.tmpl")
	if err != nil {
		log.Println(err.Error())
		http.Error(w, "Internal Error", 500)
		return
	}

	err = ts.Execute(w, nil)

	if err != nil {
		log.Println(err.Error())
		http.Error(w, "Internal Server Error", 500)
	}
}

func checkParagraph(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	paragraph := r.Form.Get("the_paragraph")
	fmt.Println(paragraph)
	response, err := pkg.SearchBing(paragraph)
	w.Header().Set("Content-Type", "application/json")

	if err != nil {
		if strings.Contains(err.Error(), "no such host") || strings.Contains(err.Error(), "connection reset") {
			http.Error(w, "Poor internet connection\n", 400)
		} else {
			http.Error(w, err.Error(), 400)
		}
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}
