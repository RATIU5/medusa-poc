package queryparser

import (
	"net/url"
	"reflect"
	"testing"
)

func TestParseQuery(t *testing.T) {
	tests := []struct {
		name        string
		queryString string
		wantFilters []Filter
		wantSelect  Select
		wantErr     bool
	}{
		{
			name:        "Simple filter and select",
			queryString: "filter=content.status:eq:active&select=id,content.title",
			wantFilters: []Filter{
				{Field: "content.status", Operator: "eq", Value: "active"},
			},
			wantSelect: Select{Fields: []string{"id", "content.title"}},
			wantErr:    false,
		},
		{
			name:        "Multiple filters",
			queryString: "filter=content.status:eq:active,content.views:gt:100&select=id",
			wantFilters: []Filter{
				{Field: "content.status", Operator: "eq", Value: "active"},
				{Field: "content.views", Operator: "gt", Value: "100"},
			},
			wantSelect: Select{Fields: []string{"id"}},
			wantErr:    false,
		},
		{
			name:        "Filter with special characters",
			queryString: "filter=content.title:eq:Hello%20World&select=id",
			wantFilters: []Filter{
				{Field: "content.title", Operator: "eq", Value: "Hello World"},
			},
			wantSelect: Select{Fields: []string{"id"}},
			wantErr:    false,
		},
		{
			name:        "Empty query",
			queryString: "",
			wantFilters: []Filter{},
			wantSelect:  Select{},
			wantErr:     false,
		},
		{
			name:        "Invalid filter format",
			queryString: "filter=invalid_filter&select=id",
			wantFilters: nil,
			wantSelect:  Select{},
			wantErr:     true,
		},
		{
			name:        "URL-encoded values",
			queryString: "filter=content.category:eq:Science%20%26%20Technology&select=id,content.title",
			wantFilters: []Filter{
				{Field: "content.category", Operator: "eq", Value: "Science & Technology"},
			},
			wantSelect: Select{Fields: []string{"id", "content.title"}},
			wantErr:    false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			queryValues, _ := url.ParseQuery(tt.queryString)
			gotFilters, gotSelect, err := ParseQuery(queryValues)

			if (err != nil) != tt.wantErr {
				t.Errorf("ParseQuery() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if len(gotFilters) > 0 && len(tt.wantFilters) > 0 && !reflect.DeepEqual(gotFilters, tt.wantFilters) {
				t.Errorf("ParseQuery() gotFilters = %v, want %v", gotFilters, tt.wantFilters)
			}

			if !reflect.DeepEqual(gotSelect, tt.wantSelect) {
				t.Errorf("ParseQuery() gotSelect = %v, want %v", gotSelect, tt.wantSelect)
			}
		})
	}
}
