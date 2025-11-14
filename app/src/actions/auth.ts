"use server";

const API_BASE = process.env.API_BASE_URL!

export async function checkUserExists(email: string) {
  try {
    const response = await fetch(
      `${API_BASE}/auth/password-reset/user-exists`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const apiResult = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: apiResult.message || "Error al verificar el correo",
      };
    }

    if (apiResult.status !== 200) {
      return {
        success: false,
        error: apiResult.message || "Error al verificar el correo",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("[checkUserExists] Error:", error);
    return { success: false, error: "Error de conexión al servidor." };
  }
}
export async function generateResetTokene(email: string) {
  try {
    const response = await fetch(
      `${API_BASE}/auth/password-reset/request`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const apiResult = await response.json();

    if (!response.ok || apiResult.status !== 200) {
      return {
        success: false,
        error: apiResult.message || "Error al generar código",
      };
    }

    return {
      success: true,
      code: apiResult.data.code,
      expires: apiResult.data.expires,
      name: apiResult.data.name, 
      token: apiResult.data.token, 
    };

  } catch (error) {
    console.error("[generateResetTokene] Error:", error);
    return {
      success: false,
      error: "Error de conexión al servidor.",
    };
  }
}


export async function validateResetCode(email: string, code: string) {
  try {
    const response = await fetch(
      `${API_BASE}/auth/password-reset/validate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      }
    );

    const apiResult = await response.json();

    if (apiResult.status !== 200 || apiResult.error || !apiResult.data.token) {
      return { error: apiResult.message || "Error al validar el código" };
    }

    return {
      success: true,
      email: apiResult.data.email,
      token: apiResult.data.token,
    };
  } catch (error) {
    console.error("[validateResetCode] Error:", error);
    return { error: "Error de conexión al servidor." };
  }
}

export async function updatePasswordWithToken(
  email: string,
  token: string,
  newPassword: string
) {
  try {
    const response = await fetch(
      `${API_BASE}/auth/password-reset/confirm`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token, newPassword }),
      }
    );

    const apiResult = await response.json();

    if (apiResult.status !== 200) {
      return { error: apiResult.message || "Error al cambiar la contraseña" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error al actualizar contraseña:", error);
    return { error: "Error de conexión al servidor." };
  }
}
