<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\PasswordReset;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

class UsersController extends Controller
{

// Registro de usuario
public function register(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8|confirmed',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 422);
    }

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;

    // Llamar a la función welcome
    $this->welcome($user);

    return response()->json(['token' => $token, 'user' => $user], 201);
}

    // Login de usuario
    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid login details'], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user], 200);
    }

    // Logout de usuario (borra todos los token de acceso de ese usuario, osea, cierra todas las sesiones abiertas de ese usuario)
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out successfully'], 200);
    }


public function testConnection()
{
    return response()->json(['message' => 'Conexión exitosa'], 200);
}

public function userData(Request $request)
{
    $user = Auth::user();

    if (!$user) {
        return response()->json(['message' => 'User not authenticated'], 401);
    }

    return response()->json(['user' => $user], 200);
}


public function welcome(User $user)
{
    $email = $user->email;
    $subject = 'Doña Clara - Bienvenido';
    $body = 'Usted se registró correctamente en la tienda Doña Clara';

    $phpMailer = new PhpMailerController();

    try {
        ob_start();
        $phpMailer->sendEmail($email, $subject, $body);
        $smtpLog = ob_get_clean();

        return response()->json([
            'status' => 'success',
            'message' => 'Correo enviado correctamente',
            'smtpLog' => $smtpLog
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'No se pudo enviar el correo. Error: ' . $e->getMessage()
        ], 500);
    }
}



// Generar código de restablecimiento de contraseña
public function generateResetCode(Request $request)
{
    // Validar que el correo electrónico sea válido
    $request->validate(['email' => 'required|email']);

    // Verificar si el correo electrónico existe en la tabla users
    $user = User::where('email', $request->email)->first();
    if (!$user) {
        return response()->json([
            'status' => 'error',
            'message' => 'El correo electrónico no existe en nuestros registros.'
        ], 404);
    }

    // Generar un token aleatorio de 6 caracteres
    $token = Str::random(6);

    // Verificar si ya existe un registro en la tabla password_resets para el correo electrónico
    $passwordReset = PasswordReset::where('email', $request->email)->first();
    if ($passwordReset) {
        // Si existe, actualizar el token y la fecha de creación
        $passwordReset->token = $token;
        $passwordReset->created_at = now();
        $passwordReset->save();
    } else {
        // Si no existe, crear un nuevo registro
        PasswordReset::create([
            'email' => $request->email,
            'token' => $token,
            'created_at' => now(),
        ]);
    }

    // Enviar el código por correo electrónico usando PhpMailerController
    $email = $request->email;
    $subject = 'Código de restablecimiento de contraseña';
    $body = "Su código de restablecimiento de contraseña es: $token";

    $phpMailer = new PhpMailerController();

    try {
        ob_start();
        $phpMailer->sendEmail($email, $subject, $body);
        $smtpLog = ob_get_clean();

        return response()->json([
            'status' => 'success',
            'message' => 'Código enviado a su correo electrónico.',
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'No se pudo enviar el correo. Error: ' . $e->getMessage()
        ], 500);
    }
}


public function resetPassword(Request $request)
{
    // Validar los datos de la solicitud
    $validator = Validator::make($request->all(), [
        'email' => 'required|email|exists:users,email',
        'token' => 'required|string',
        'password' => 'required|string|min:8|confirmed',
    ]);

    // Si la validación falla, devolver errores
    if ($validator->fails()) {
        return response()->json([
            'status' => 'error',
            'errors' => $validator->errors()
        ], 400);
    }

    // Verificar si el código de restablecimiento coincide con el correo electrónico
    $passwordReset = PasswordReset::where('email', $request->email)
                                ->where('token', $request->token)
                                ->first();
    if (!$passwordReset) {
        return response()->json([
            'status' => 'error',
            'message' => 'Código de restablecimiento inválido.'
        ], 400);
    }

    // Actualizar la contraseña del usuario
    $user = User::where('email', $request->email)->first();
    $user->password = Hash::make($request->password);
    $user->save();

    // Eliminar el código de restablecimiento después de usarlo
    $passwordReset->delete();

    // Enviar correo de confirmación de cambio de contraseña
    $email = $request->email;
    $subject = 'Confirmación de cambio de contraseña';
    $body = 'Su contraseña ha sido cambiada con éxito.';

    $phpMailer = new PhpMailerController();

    try {
        ob_start();
        $phpMailer->sendEmail($email, $subject, $body);
        $smtpLog = ob_get_clean();

        return response()->json([
            'status' => 'success',
            'message' => 'Contraseña restablecida correctamente y correo de confirmación enviado.',
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'success',
            'message' => 'Contraseña restablecida correctamente, pero no se pudo enviar el correo de confirmación. Error: ' . $e->getMessage()
        ], 200);
    }
}

}