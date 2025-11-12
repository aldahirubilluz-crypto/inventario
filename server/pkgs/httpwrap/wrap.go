// server/pkgs/httpwrap/wrap.go
package httpwrap

import "github.com/gofiber/fiber/v3"

// Wrap para handlers que retornan (data, message, error)
func Wrap(fn func(fiber.Ctx) (interface{}, string, error)) fiber.Handler {
	return func(c fiber.Ctx) error {
		data, msg, err := fn(c)
		if err != nil {
			if fe, ok := err.(*fiber.Error); ok {
				return c.Status(fe.Code).JSON(fiber.Map{
					"status":  fe.Code,
					"message": fe.Message,
					"data":    nil,
				})
			}
			code := fiber.StatusInternalServerError
			m := msg
			if m == "" {
				m = err.Error()
			}
			return c.Status(code).JSON(fiber.Map{
				"status":  code,
				"message": m,
				"data":    nil,
			})
		}

		code := fiber.StatusOK
		return c.Status(code).JSON(fiber.Map{
			"status":  code,
			"message": msg,
			"data":    data,
		})
	}
}

// ✅ WrapStandard para handlers estándar de Fiber
func WrapStandard(fn func(fiber.Ctx) error) fiber.Handler {
	return fn // Ya es compatible, no necesita conversión
}
