package errors

import (
	"strings"

	"github.com/charmbracelet/lipgloss"
)

func formatKeyValue(key, value string) string {
	return lipgloss.JoinHorizontal(lipgloss.Left,
		labelStyle.Render(key+":"),
		valueStyle.Render(wrapText(value, 50)),
	)
}

func wrapText(text string, width int) string {
	words := strings.Fields(text)
	if len(words) == 0 {
		return ""
	}

	var lines []string
	var currentLine string

	for _, word := range words {
		if len(currentLine)+len(word) > width {
			lines = append(lines, strings.TrimSpace(currentLine))
			currentLine = word
		} else {
			if currentLine != "" {
				currentLine += " "
			}
			currentLine += word
		}
	}

	if currentLine != "" {
		lines = append(lines, strings.TrimSpace(currentLine))
	}

	return strings.Join(lines, "\n"+strings.Repeat(" ", labelStyle.GetPaddingRight()+1))
}
