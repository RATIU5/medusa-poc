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
				{Field: "content.tags", Operator: "contains", Value: "[\"important\"]"},
			},
			selects:      queryparser.Select{Fields: []string{"id", "content.title", "content.author"}},
			expectedSQL:  "SELECT id, content->>'title' as content.title, content->>'author' as content.author FROM items WHERE content->>'category' = ? AND content->'tags' @> ?::jsonb",
			expectedArgs: []interface{}{"news", "[\"important\"]"},
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
		{
			name:  "JSONB field LIKE operation",
			table: "items",
			filters: []queryparser.Filter{
				{Field: "content.description", Operator: "ilike", Value: "%test%"},
			},
			selects:      queryparser.Select{Fields: []string{"id", "content.title"}},
			expectedSQL:  "SELECT id, content->>'title' as content.title FROM items WHERE content->>'description' ILIKE ?",
			expectedArgs: []interface{}{"%test%"},
			expectError:  false,
		},
		{
			name:  "Multiple JSONB conditions with AND",
			table: "items",
			filters: []queryparser.Filter{
				{Field: "metadata.status", Operator: "eq", Value: "active"},
				{Field: "content.views", Operator: "gt", Value: "100"},
			},
			selects:      queryparser.Select{Fields: []string{"id", "content.title", "metadata.status"}},
			expectedSQL:  "SELECT id, content->>'title' as content.title, metadata->>'status' as metadata.status FROM items WHERE metadata->>'status' = ? AND (content->>'views')::int > ?",
			expectedArgs: []interface{}{"active", "100"},
			expectError:  false,
		},
		{
			name:  "Nested JSONB field",
			table: "items",
			filters: []queryparser.Filter{
				{Field: "content.author.name", Operator: "eq", Value: "John Doe"},
			},
			selects:      queryparser.Select{Fields: []string{"id", "content.author.email"}},
			expectedSQL:  "SELECT id, content->'author'->>'email' as content.author.email FROM items WHERE content->'author'->>'name' = ?",
			expectedArgs: []interface{}{"John Doe"},
			expectError:  false,
		},
		{
			name:  "Complex query with multiple conditions and nested JSONB",
			table: "items",
			filters: []queryparser.Filter{
				{Field: "content.category", Operator: "eq", Value: "tech"},
				{Field: "metadata.tags", Operator: "contains", Value: "[\"featured\"]"},
				{Field: "content.author.reputation", Operator: "gte", Value: "4.5"},
			},
			selects:      queryparser.Select{Fields: []string{"id", "content.title", "content.author.name", "metadata.published_date"}},
			expectedSQL:  "SELECT id, content->>'title' as content.title, content->'author'->>'name' as content.author.name, metadata->>'published_date' as metadata.published_date FROM items WHERE content->>'category' = ? AND metadata->'tags' @> ?::jsonb AND (content->'author'->>'reputation')::float >= ?",
			expectedArgs: []interface{}{"tech", "[\"featured\"]", "4.5"},
			expectError:  false,
		},
		{
			name:         "Empty filters with specific selects",
			table:        "items",
			filters:      []queryparser.Filter{},
			selects:      queryparser.Select{Fields: []string{"id", "content.title", "metadata.created_at"}},
			expectedSQL:  "SELECT id, content->>'title' as content.title, metadata->>'created_at' as metadata.created_at FROM items",
			expectedArgs: []interface{}{},
			expectError:  false,
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
