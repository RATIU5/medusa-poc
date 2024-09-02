package queryparser

import (
	"fmt"
	"net/url"
	"strings"
)

type Filter struct {
	Field    string
	Operator string
	Value    string
}

type Select struct {
	Fields []string
}

func ParseQuery(query url.Values) ([]Filter, Select, error) {
	var filters []Filter
	var sel Select

	filterStr := query.Get("filter")
	if filterStr != "" {
		filterParts := strings.Split(filterStr, ",")
		for _, part := range filterParts {
			f, err := parseFilter(part)
			if err != nil {
				return nil, Select{}, err
			}
			filters = append(filters, f)
		}
	}

	selectStr := query.Get("select")
	if selectStr != "" {
		sel.Fields = strings.Split(selectStr, ",")
	}

	return filters, sel, nil
}

func parseFilter(filterStr string) (Filter, error) {
	parts := strings.SplitN(filterStr, ":", 3)
	if len(parts) != 3 {
		return Filter{}, fmt.Errorf("invalid filter format: %s", filterStr)
	}

	return Filter{
		Field:    parts[0],
		Operator: parts[1],
		Value:    parts[2],
	}, nil
}
