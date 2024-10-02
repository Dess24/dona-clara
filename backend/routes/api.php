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

//Testeo de conexión
Route::get('/test-connection', [UsersController::class, 'testConnection']);

//Productos
Route::get('/productos', [ProductoController::class, 'index']);
Route::get('/productos/{id}', [ProductoController::class, 'show']);
Route::get('/productos/categoria/{categoria}', [ProductoController::class, 'buscarPorCategoria']);
Route::get('/productos/nombre/{nombre}', [ProductoController::class, 'buscarPorNombre']);

// Rutas para el carrito de compras
Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::post('/carrito/add', [CarritoController::class, 'añadirProducto']);
    Route::get('/carrito/view', [CarritoController::class, 'verCarrito']);
    Route::post('/carrito/checkout', [CarritoController::class, 'checkout']);
    Route::post('/restar-producto', [CarritoController::class, 'restarProducto']);
});