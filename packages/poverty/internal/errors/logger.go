package errors

import (
	"fmt"

	"github.com/RATIU5/medusa-poc/internal/logger"
	"github.com/charmbracelet/lipgloss"
)

var (
	boxStyle = lipgloss.NewStyle().
			Border(lipgloss.RoundedBorder()).
			BorderForeground(lipgloss.Color("#8B0000")).
			Padding(1)

	labelStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#A9A9A9")).
			PaddingRight(1)

	valueStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#D3D3D3"))

	statusCodeStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#2F4F4F")).
			Bold(true)
)

func logPrettyError(l *logger.Logger, e *AppError) {

	content := lipgloss.JoinVertical(lipgloss.Left,
		formatKeyValue("Label", string(e.Code)),
		formatKeyValue("Message", e.Message),
		formatKeyValue("Detail", e.DevMessage),
		formatKeyValue("Status", statusCodeStyle.Render(fmt.Sprintf("%d", e.StatusCode))),
	)

	if e.Err != nil {
		content = lipgloss.JoinVertical(lipgloss.Left,
			content,
			formatKeyValue("Error", e.Err.Error()),
		)
	}

	box := boxStyle.Render(content)
	finalOutput := lipgloss.JoinVertical(lipgloss.Center, box)

	l.Error("\n" + finalOutput)
}
