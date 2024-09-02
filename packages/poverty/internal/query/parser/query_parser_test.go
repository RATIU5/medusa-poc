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
			wantFilters: nil,
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
		{
			name:        "Complex nested JSONB query",
			queryString: "filter=content.nested.deep.field:eq:value,metadata.array[2].name:eq:John&select=id,content.nested.deep.field,metadata.array[2].name",
			wantFilters: []Filter{
				{Field: "content.nested.deep.field", Operator: "eq", Value: "value"},
				{Field: "metadata.array[2].name", Operator: "eq", Value: "John"},
			},
			wantSelect: Select{Fields: []string{"id", "content.nested.deep.field", "metadata.array[2].name"}},
			wantErr:    false,
		},
		{
			name:        "Multiple operators in one query",
			queryString: "filter=content.status:eq:active,content.views:gt:100,content.rating:lte:4.5,content.tags:contains:important&select=id,content.title,content.views,content.rating",
			wantFilters: []Filter{
				{Field: "content.status", Operator: "eq", Value: "active"},
				{Field: "content.views", Operator: "gt", Value: "100"},
				{Field: "content.rating", Operator: "lte", Value: "4.5"},
				{Field: "content.tags", Operator: "contains", Value: "important"},
			},
			wantSelect: Select{Fields: []string{"id", "content.title", "content.views", "content.rating"}},
			wantErr:    false,
		},
		{
			name:        "Query with multiple select fields but no filters",
			queryString: "select=id,content.title,content.body,metadata.created_at,metadata.updated_at",
			wantFilters: nil,
			wantSelect:  Select{Fields: []string{"id", "content.title", "content.body", "metadata.created_at", "metadata.updated_at"}},
			wantErr:     false,
		},
		{
			name:        "Query with filters but no select",
			queryString: "filter=content.status:eq:active,content.category:in:news|sports",
			wantFilters: []Filter{
				{Field: "content.status", Operator: "eq", Value: "active"},
				{Field: "content.category", Operator: "in", Value: "news|sports"},
			},
			wantSelect: Select{},
			wantErr:    false,
		},
		{
			name:        "Query with very long field names and values",
			queryString: "filter=" + url.QueryEscape("this.is.a.very.long.field.name.that.goes.deep.into.the.json.structure:eq:This is a very long value that could potentially be hundreds of characters long") + "&select=id,this.is.a.very.long.field.name.that.goes.deep.into.the.json.structure",
			wantFilters: []Filter{
				{Field: "this.is.a.very.long.field.name.that.goes.deep.into.the.json.structure", Operator: "eq", Value: "This is a very long value that could potentially be hundreds of characters long"},
			},
			wantSelect: Select{Fields: []string{"id", "this.is.a.very.long.field.name.that.goes.deep.into.the.json.structure"}},
			wantErr:    false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Parse the query string into a map[string]string
			queryValues, _ := url.ParseQuery(tt.queryString)
			queryMap := make(map[string]string)
			for k, v := range queryValues {
				if len(v) > 0 {
					queryMap[k] = v[0]
				}
			}

			gotFilters, gotSelect, err := ParseQuery(queryMap)

			if (err != nil) != tt.wantErr {
				t.Errorf("ParseQuery() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if !tt.wantErr {
				if !reflect.DeepEqual(gotFilters, tt.wantFilters) {
					t.Errorf("ParseQuery() gotFilters = %v, want %v", gotFilters, tt.wantFilters)
				}

				if !reflect.DeepEqual(gotSelect, tt.wantSelect) {
					t.Errorf("ParseQuery() gotSelect = %v, want %v", gotSelect, tt.wantSelect)
				}
			}
		})
	}
}
