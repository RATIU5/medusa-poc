package querybuilder

import (
	"fmt"
	"strings"

	"github.com/Masterminds/squirrel"
	queryparser "github.com/RATIU5/medusa-poc/internal/query/parser"
)

func BuildQuery(table string, filters []queryparser.Filter, selects queryparser.Select) (string, []interface{}, error) {
	query := squirrel.Select().From(table)

	if len(selects.Fields) > 0 {
		columns := make([]string, len(selects.Fields))
		for i, field := range selects.Fields {
			columns[i] = buildJsonbSelect(field)
		}
		query = query.Columns(columns...)
	} else {
		query = query.Column("*")
	}

	for _, filter := range filters {
		wherePart, err := buildWhereClause(filter)
		if err != nil {
			return "", nil, fmt.Errorf("error building where clause: %w", err)
		}
		query = query.Where(wherePart)
	}

	sql, args, err := query.ToSql()
	if err != nil {
		return "", nil, fmt.Errorf("error building SQL: %w", err)
	}

	if args == nil {
		args = []interface{}{}
	}

	return sql, args, nil
}

func buildJsonbSelect(field string) string {
	parts := strings.Split(field, ".")
	if len(parts) == 1 {
		return field
	}
	return fmt.Sprintf("%s->>'%s' as %s", parts[0], strings.Join(parts[1:], "']['"), field)
}

func buildWhereClause(filter queryparser.Filter) (squirrel.Sqlizer, error) {
	feild := buildJsonbField(filter.Field)

	switch filter.Operator {
	case "eq":
		return squirrel.Eq{feild: filter.Value}, nil
	case "neq":
		return squirrel.NotEq{feild: filter.Value}, nil
	case "gt":
		return squirrel.Gt{feild: filter.Value}, nil
	case "gte":
		return squirrel.GtOrEq{feild: filter.Value}, nil
	case "lt":
		return squirrel.Lt{feild: filter.Value}, nil
	case "lte":
		return squirrel.LtOrEq{feild: filter.Value}, nil
	case "like":
		return squirrel.Like{feild: filter.Value}, nil
	case "ilike":
		return squirrel.ILike{feild: filter.Value}, nil
	case "contains":
		return squirrel.Expr(fmt.Sprintf("%s @> ?::jsonb", buildJsonbContainsField(filter.Field)), filter.Value), nil
	default:
		return nil, fmt.Errorf("unsupported operator: %s", filter.Operator)
	}
}

func buildJsonbField(field string) string {
	parts := strings.Split(field, ".")
	if len(parts) == 1 {
		return field
	}
	return fmt.Sprintf("%s->>'%s'", parts[0], strings.Join(parts[1:], "']['"))
}

func buildJsonbContainsField(field string) string {
	parts := strings.Split(field, ".")
	if len(parts) == 1 {
		return field
	}
	return parts[0]
}
