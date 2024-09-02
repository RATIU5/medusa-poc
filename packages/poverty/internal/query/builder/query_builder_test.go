package querybuilder

import (
	"testing"

	queryparser "github.com/RATIU5/medusa-poc/internal/query/parser"
	"github.com/stretchr/testify/assert"
)

func TestBuildQuery(t *testing.T) {
	tests := []struct {
		name         string
		table        string
		filters      []queryparser.Filter
		selects      queryparser.Select
		expectedSQL  string
		expectedArgs []interface{}
		expectError  bool
	}{
		{
			name:         "Simple select all",
			table:        "items",
			filters:      []queryparser.Filter{},
			selects:      queryparser.Select{},
			expectedSQL:  "SELECT * FROM items",
			expectedArgs: []interface{}{},
			expectError:  false,
		},
		{
			name:         "Select specific fields",
			table:        "items",
			filters:      []queryparser.Filter{},
			selects:      queryparser.Select{Fields: []string{"id", "title"}},
			expectedSQL:  "SELECT id, title FROM items",
			expectedArgs: []interface{}{},
			expectError:  false,
		},
		{
			name:  "Select with simple filter",
			table: "items",
			filters: []queryparser.Filter{
				{Field: "status", Operator: "eq", Value: "active"},
			},
			selects:      queryparser.Select{Fields: []string{"id", "title"}},
			expectedSQL:  "SELECT id, title FROM items WHERE status = ?",
			expectedArgs: []interface{}{"active"},
			expectError:  false,
		},
		{
			name:  "Select with JSONB field",
			table: "items",
			filters: []queryparser.Filter{
				{Field: "content.category", Operator: "eq", Value: "news"},
			},
			selects:      queryparser.Select{Fields: []string{"id", "content.title"}},
			expectedSQL:  "SELECT id, content->>'title' as content.title FROM items WHERE content->>'category' = ?",
			expectedArgs: []interface{}{"news"},
			expectError:  false,
		},
		{
			name:  "Multiple filters and JSONB contains",
			table: "items",
			filters: []queryparser.Filter{
				{Field: "content.category", Operator: "eq", Value: "news"},
				{Field: "content.tags", Operator: "contains", Value: "['important']"},
			},
			selects:      queryparser.Select{Fields: []string{"id", "content.title", "content.author"}},
			expectedSQL:  "SELECT id, content->>'title' as content.title, content->>'author' as content.author FROM items WHERE content->>'category' = ? AND content @> ?::jsonb",
			expectedArgs: []interface{}{"news", "['important']"},
			expectError:  false,
		},
		{
			name:  "Invalid operator",
			table: "items",
			filters: []queryparser.Filter{
				{Field: "status", Operator: "invalid", Value: "active"},
			},
			selects:      queryparser.Select{},
			expectedSQL:  "",
			expectedArgs: nil,
			expectError:  true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			sql, args, err := BuildQuery(tt.table, tt.filters, tt.selects)

			if tt.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tt.expectedSQL, sql)
				assert.Equal(t, tt.expectedArgs, args)
			}
		})
	}
}
