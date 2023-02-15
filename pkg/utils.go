package pkg

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

func GetPWD() string {
	mydir, err := os.Getwd()
	if err != nil {
		fmt.Println(err)
	}
	return mydir
}

func SearchBing(query string) ([]map[string]string, error) {

	results := []map[string]string{}
	var formattedQuery string = strings.Replace(query, " ", "%20", -1)
	var link string = "https://searx.garudalinux.org/search?q=" + formattedQuery
	fmt.Println("link: ", link)
	res, err := http.Get(link)
	if err != nil {
		return nil, err
	}

	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		log.Println(err.Error())
	}

	doc.Find(".result").Each(func(i int, s *goquery.Selection) {
		link, _ := s.Find(".url_wrapper").Attr("href")
		entry := map[string]string{
			"title": s.Find(".result h3").Text(),
			"link":  link,
		}
		results = append(results, entry)
	})

	for i, j := 0, len(results)-1; i < j; i, j = i+1, j-1 {
		results[i], results[j] = results[j], results[i]
	}

	return results, nil
}
