package querybuilder

import (
	"fmt"
	"strconv"
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

	for i := 1; i <= len(args); i++ {
		sql = strings.Replace(sql, "?", fmt.Sprintf("$%d", i), 1)
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
	if len(parts) == 2 {
		return fmt.Sprintf("%s->>'%s' as \"%s\"", parts[0], parts[1], field)
	}
	jsonPath := fmt.Sprintf("%s->%s->>'%s'",
		parts[0],
		strings.Join(quoteParts(parts[1:len(parts)-1]), "->"),
		parts[len(parts)-1])
	return fmt.Sprintf("%s as \"%s\"", jsonPath, field)
}

func buildJsonbField(field string) string {
	parts := strings.Split(field, ".")
	if len(parts) == 1 {
		return field
	}
	if len(parts) == 2 {
		return fmt.Sprintf("%s->>'%s'", parts[0], parts[1])
	}
	return fmt.Sprintf("%s->%s->>'%s'", parts[0],
		strings.Join(quoteParts(parts[1:len(parts)-1]), "->"),
		parts[len(parts)-1])
}

func quoteParts(parts []string) []string {
	quoted := make([]string, len(parts))
	for i, part := range parts {
		quoted[i] = fmt.Sprintf("'%s'", part)
	}
	return quoted
}

func buildJsonbContains(field, value string) squirrel.Sqlizer {
	parts := strings.Split(field, ".")
	if len(parts) == 1 {
		return squirrel.Expr(fmt.Sprintf("%s @> ?::jsonb", field), value)
	}
	if len(parts) == 2 {
		return squirrel.Expr(fmt.Sprintf("%s->'%s' @> ?::jsonb", parts[0], parts[1]), value)
	}
	jsonPath := fmt.Sprintf("%s->%s", parts[0], strings.Join(quoteParts(parts[1:len(parts)-1]), "->"))
	return squirrel.Expr(fmt.Sprintf("%s->'%s' @> ?::jsonb", jsonPath, parts[len(parts)-1]), value)
}

func buildWhereClause(filter queryparser.Filter) (squirrel.Sqlizer, error) {
	field := buildJsonbField(filter.Field)

	switch filter.Operator {
	case "eq", "neq", "gt", "gte", "lt", "lte":
		return buildComparisonClause(field, filter.Operator, filter.Value)
	case "like":
		return squirrel.Like{field: filter.Value}, nil
	case "ilike":
		return squirrel.ILike{field: filter.Value}, nil
	case "contains":
		return buildJsonbContains(filter.Field, filter.Value), nil
	default:
		return nil, fmt.Errorf("unsupported operator: %s", filter.Operator)
	}
}

func buildComparisonClause(field, operator, value string) (squirrel.Sqlizer, error) {
	if strings.Contains(field, "->") && (operator == "gt" || operator == "gte" || operator == "lt" || operator == "lte") {
		if _, err := strconv.Atoi(value); err == nil {
			field = fmt.Sprintf("(%s)::int", field)
		} else {
			field = fmt.Sprintf("(%s)::float", field)
		}
	}

	switch operator {
	case "eq":
		return squirrel.Eq{field: value}, nil
	case "neq":
		return squirrel.NotEq{field: value}, nil
	case "gt":
		return squirrel.Gt{field: value}, nil
	case "gte":
		return squirrel.GtOrEq{field: value}, nil
	case "lt":
		return squirrel.Lt{field: value}, nil
	case "lte":
		return squirrel.LtOrEq{field: value}, nil
	default:
		return nil, fmt.Errorf("unsupported operator: %s", operator)
	}
}
