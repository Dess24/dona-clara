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

//Bienvenida al mail
Route::post('/welcome', [UsersController::class, 'welcome']);

//Productos
Route::get('/productos', [ProductoController::class, 'index']);
Route::get('/productos/{id}', [ProductoController::class, 'show']);
Route::get('productos/categorias/{categoriaNombres}', [ProductoController::class, 'buscarPorCategoria']);
Route::get('/productos/nombre/{nombre}', [ProductoController::class, 'buscarPorNombre']);
Route::get('/recientes', [ProductoController::class, 'mostrarRecientes']);



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
});

// Rutas para administradores
Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::post('agregar', [ProductoController::class, 'agregarProducto']);
    Route::delete('quitar/{id}', [ProductoController::class, 'quitarProducto']);
    Route::put('modificar/{id}', [ProductoController::class, 'modificarProducto']);
    Route::put('actualizar-stock/{id}', [ProductoController::class, 'actualizarStock']);

});
