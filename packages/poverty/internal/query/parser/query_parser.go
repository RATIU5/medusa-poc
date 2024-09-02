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

func ParseQuery(queries map[string]string) ([]Filter, Select, error) {
	var filters []Filter
	var sel Select

	filterStr, ok := queries["filter"]
	if ok && filterStr != "" {
		filterStr, err := url.QueryUnescape(filterStr)
		if err != nil {
			return nil, Select{}, fmt.Errorf("failed to unescape filter string: %v", err)
		}
		filterParts := strings.Split(filterStr, ",")
		for _, part := range filterParts {
			f, err := parseFilter(part)
			if err != nil {
				return nil, Select{}, err
			}
			filters = append(filters, f)
		}
	}

	selectStr, ok := queries["select"]
	if ok && selectStr != "" {
		selectStr, err := url.QueryUnescape(selectStr)
		if err != nil {
			return nil, Select{}, fmt.Errorf("failed to unescape select string: %v", err)
		}
		sel.Fields = strings.Split(selectStr, ",")
	}

	if len(filters) == 0 {
		filters = nil
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
