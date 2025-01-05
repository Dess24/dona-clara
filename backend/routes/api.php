<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UsersController;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\CarritoController;

Route::get('/user', function () {
    return 'Hello World';
});


//Usuarios
Route::post('/register', [UsersController::class, 'register']);
Route::post('/login', [UsersController::class, 'login']);
Route::post('/logout', [UsersController::class, 'logout'])->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->get('/userinfo', [UsersController::class, 'userData']);
Route::post('password/reset/code', [UsersController::class, 'generateResetCode']);
Route::post('password/resetPass', [UsersController::class, 'resetPassword']);
Route::get('/buscar-usuarios', [UsersController::class, 'buscarPorNombre']);
Route::delete('/borrar-usuario/{id}', [UsersController::class, 'borrarUsuario']);
Route::get('/usuarios', [UsersController::class, 'getAllUsuarios']);
Route::post('/make-admin', [UsersController::class, 'makeAdmin'])->middleware('auth:sanctum');
Route::post('/remove-admin', [UsersController::class, 'removeAdmin'])->middleware('auth:sanctum');
Route::post('/contactanos', [UsersController::class, 'contactanos']);
Route::get('/usuarios/ordenar', [UsersController::class, 'ordenarUsuarios']);


//Bienvenida al mail
Route::post('/welcome', [UsersController::class, 'welcome']);

//Productos
Route::get('/productos', [ProductoController::class, 'index']);
Route::get('/productos/{id}', [ProductoController::class, 'show']);
Route::get('productos/categorias/{categoriaNombres}', [ProductoController::class, 'buscarPorCategoria']);
Route::get('/productos/nombre/{nombre}', [ProductoController::class, 'buscarPorNombre']);
Route::get('/recientes', [ProductoController::class, 'mostrarRecientes']);
Route::post('/imagenes', [ProductoController::class, 'subirImagen']);
Route::post('/imagenSlider', [UsersController::class, 'subirImagenSlider']);
Route::delete('/borrar-imagen-slider/{id}', [UsersController::class, 'borrarImagenSlider']);
Route::get('/fotos-slider', [UsersController::class, 'allSliders']);

//Cambiar Contraseña
Route::post('/generate-reset-code', [UsersController::class, 'generateResetCode']);
Route::post('/reset-password', [UsersController::class, 'resetPassword']);

//Categorias
Route::post('/create-categoria', [ProductoController::class, 'agregarCategoria']);
Route::delete('/delete-categoria/{id}', [ProductoController::class, 'borrarCategoria']);
Route::get('/categorias', [ProductoController::class, 'mostrarCategorias']);


// Rutas para el carrito de compras
Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::post('/carrito/add', [CarritoController::class, 'añadirProducto']);
    Route::get('/carrito/view', [CarritoController::class, 'verCarrito']);
    Route::post('/carrito/checkout', [CarritoController::class, 'checkout']);
    Route::post('/restar-producto', [CarritoController::class, 'restarProducto']);
    Route::delete('/carrito/eliminar', [CarritoController::class, 'eliminarProducto']);
    Route::post('/carrito/actualizar-producto/{productoId}', [CarritoController::class, 'actualizarProducto']);
});

// Rutas para administradores
Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::post('agregar', [ProductoController::class, 'agregarProducto']);
    Route::delete('quitar/{id}', [ProductoController::class, 'quitarProducto']);
    Route::put('habilitar/{id}', [ProductoController::class, 'habilitarProducto']);
    Route::put('modificar/{id}', [ProductoController::class, 'modificarProducto']);
    Route::put('actualizar-stock/{id}', [ProductoController::class, 'actualizarStock']);
    Route::put('actualizar-destacado/{id}', [ProductoController::class, 'actualizarDestacado']);
    Route::put('/historial/{idPedido}/estado', [CarritoController::class, 'updateEstado']);
});

// Rutas para el historial de compras
Route::get('/historiales', [CarritoController::class, 'getAllHistoriales']);
Route::get('/historiales/usuario/{userId}', [CarritoController::class, 'getHistorialesByUser']);
