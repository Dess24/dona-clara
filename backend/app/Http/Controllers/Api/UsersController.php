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
use App\Models\FotosSlider;

class UsersController extends Controller
{



    public function makeAdmin(Request $request)
    {
        $adminUser = Auth::user();
    
        if (!$adminUser) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }
    
        if (!$adminUser->admin) {
            return response()->json(['message' => 'User is not an admin'], 403);
        }
    
        $userId = $request->input('user_id');
        $user = User::find($userId);
    
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
    
        $user->admin = true;
        $user->save();
    
        return response()->json(['message' => 'User is now an admin'], 200);
    }

    public function removeAdmin(Request $request)
{
    $adminUser = Auth::user();

    if (!$adminUser) {
        return response()->json(['message' => 'User not authenticated'], 401);
    }

    if (!$adminUser->admin) {
        return response()->json(['message' => 'User is not an admin'], 403);
    }

    $userId = $request->input('user_id');
    $user = User::find($userId);

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    $user->admin = false;
    $user->save();

    return response()->json(['message' => 'User is no longer an admin'], 200);
}

// Registro de usuario
public function register(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:6|confirmed',
        'telefono' => 'required|string|max:20',
        'domicilio' => 'required|string|max:255',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 422);
    }

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'telefono' => $request->telefono,
        'domicilio' => $request->domicilio,
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;

    // Llamar a la función welcome
    $welcomeResult = $this->welcome($user);

    if ($welcomeResult !== true) {
        // Eliminar el usuario si el correo no se pudo enviar
        $user->delete();
        return response()->json(['status' => 'error', 'message' => 'No se pudo enviar el correo de bienvenida. El usuario ha sido eliminado.'], 500);
    }

    return response()->json(['token' => $token, 'user' => $user], 201);
}

    // Función welcome
    public function welcome(User $user)
    {
        $email = $user->email;
        $subject = 'Doña Clara - Bienvenido';
        $body = 'Usted se registró correctamente en la tienda Doña Clara';

        $phpMailer = new PHPMailer(true);

        try {
            /* Email SMTP Settings */
            $phpMailer->SMTPDebug = SMTP::DEBUG_OFF; // Desactivar la salida de depuración
            $phpMailer->isSMTP();
            $phpMailer->Host       = 'smtp.gmail.com';
            $phpMailer->SMTPAuth   = true;
            $phpMailer->Username   = 'damdess24@gmail.com';
            $phpMailer->Password   = 'neix rkfb ufjw fiwd';
            $phpMailer->SMTPSecure = 'ssl';
            $phpMailer->Port       = 465;

            //UTF-8
            $phpMailer->CharSet = 'UTF-8';
            $phpMailer->Encoding = 'base64';

            //Recipients
            $phpMailer->setFrom('damdess24@gmail.com', 'Tienda Doña Clara');
            $phpMailer->addAddress($email);

            //Content
            $phpMailer->isHTML(true);
            $phpMailer->Subject = $subject;
            $phpMailer->Body    = $body;

            // Enviar el correo
            $phpMailer->send();
            return true;
        } catch (Exception $e) {
            // Manejar el error si el correo no se pudo enviar
            return false;
        }
    }
    

    public function contactanos(Request $request)
{
    $email = $request->input('email');
    $subject = $request->input('asunto');
    $body = $request->input('descripcion');

    $phpMailer = new PHPMailer(true);

    try {
        /* Email SMTP Settings */
        $phpMailer->SMTPDebug = SMTP::DEBUG_OFF; // Desactivar la salida de depuración
        $phpMailer->isSMTP();
        $phpMailer->Host       = 'smtp.gmail.com';
        $phpMailer->SMTPAuth   = true;
        $phpMailer->Username   = 'damdess24@gmail.com';
        $phpMailer->Password   = 'neix rkfb ufjw fiwd';
        $phpMailer->SMTPSecure = 'ssl';
        $phpMailer->Port       = 465;

        //UTF-8
        $phpMailer->CharSet = 'UTF-8';
        $phpMailer->Encoding = 'base64';

        //Recipients
        $phpMailer->setFrom($email, 'Contacto Tienda Doña Clara');
        $phpMailer->addAddress('adamianperez224@gmail.com');

        //Content
        $phpMailer->isHTML(true);
        $phpMailer->Subject = $subject;
        $phpMailer->Body    = $body;

        // Enviar el correo
        $phpMailer->send();
        return response()->json(['message' => 'Correo enviado correctamente'], 200);
    } catch (Exception $e) {
        // Manejar el error si el correo no se pudo enviar
        return response()->json(['message' => 'No se pudo enviar el correo', 'error' => $e->getMessage()], 500);
    }
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

    // Obtener todos los usuarios
    public function getAllUsuarios()
    {
        $usuarios = User::all();
        return response()->json($usuarios);
    }



// Buscar usuarios por nombre, email, teléfono o domicilio
    public function buscarPorNombre(Request $request)
    {
        $query = $request->input('query');
        $usuarios = User::where('name', 'LIKE', '%' . $query . '%')
                        ->orWhere('email', 'LIKE', '%' . $query . '%')
                        ->orWhere('telefono', 'LIKE', '%' . $query . '%')
                        ->orWhere('domicilio', 'LIKE', '%' . $query . '%')
                        ->get();

        if ($usuarios->isEmpty()) {
            return response()->json(['usuarios' => []]);
        }

        return response()->json(['usuarios' => $usuarios]);
    }


     // Borrar usuario por ID
    public function borrarUsuario($id)
    {
        $usuario = User::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $usuario->delete();

        return response()->json(['message' => 'Usuario borrado exitosamente'], 200);
    }

public function userData(Request $request)
{
    $user = Auth::user();

    if (!$user) {
        return response()->json(['message' => 'User not authenticated'], 401);
    }

    return response()->json(['user' => $user], 200);
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
    $body = "Su código de restablecimiento de contraseña es: $token Si no recivió ninguna solicitud, ignore este mensaje, gracias por leerlo.";

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

public function ordenarUsuarios(Request $request)
{
    $orden = $request->input('orden', 'asc'); // Obtener el orden de la solicitud, por defecto 'asc'

    // Validar el orden
    if (!in_array($orden, ['asc', 'desc'])) {
        return response()->json(['error' => 'Orden no válido'], 400);
    }

    // Obtener los usuarios ordenados por 'name'
    $usuarios = User::orderBy('name', $orden)->get();

    return response()->json($usuarios);
}


public function subirImagenSlider(Request $request)
{
    $request->validate([
        'imagen' => 'required|image|mimes:jpeg,png,jpg,gif', // Eliminado el límite de tamaño
    ]);

    if ($request->hasFile('imagen')) {
        $file = $request->file('imagen');
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();
        $randomNumber = rand(100, 999);
        $nombreArchivo = $originalName . '_' . $randomNumber . '.' . $extension;

        // Mover el archivo a la ubicación deseada
        $file->move(public_path('images'), $nombreArchivo);

        // Registrar solo el nombre del archivo en la tabla fotosSlider
        $fotoSlider = new FotosSlider();
        $fotoSlider->ruta = $nombreArchivo;
        $fotoSlider->save();

        return response()->json(['message' => 'Imagen subida y registrada correctamente', 'nombreArchivo' => $nombreArchivo], 201);
    }

    return response()->json(['message' => 'No se pudo subir la imagen'], 500);
}

public function borrarImagenSlider($id)
{
    // Buscar la imagen en la base de datos
    $fotoSlider = FotosSlider::find($id);

    if ($fotoSlider) {
        // Obtener la ruta de la imagen
        $ruta = public_path('images/' . $fotoSlider->ruta);

        // Eliminar el registro de la base de datos
        $fotoSlider->delete();

        // Verificar si el archivo existe y eliminarlo
        if (file_exists($ruta)) {
            unlink($ruta);
        }

        return response()->json(['message' => 'Imagen eliminada correctamente'], 200);
    }

    return response()->json(['message' => 'Imagen no encontrada'], 404);
}

public function allSliders()
{
    $fotos = FotosSlider::orderBy('id')->get();
    return response()->json($fotos);
}
}