<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
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



public function welcome(Request $request)
    {
        $email = $request->input('email');
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
    
}