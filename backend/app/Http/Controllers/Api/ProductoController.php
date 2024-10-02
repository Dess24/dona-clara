<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    // Listar todos los productos
    public function index()
    {
        $productos = Producto::all();
        if ($productos->isEmpty()) {
            return response()->json(['message' => 'No hay productos disponibles'], 404);
        }
        return response()->json($productos);
    }

    // Ver detalles de un producto
    public function show($id)
    {
        $producto = Producto::find($id);
        if (!$producto) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }
        return response()->json($producto);
    }

    // Buscar productos por categoría
    public function buscarPorCategoria($categoria)
    {
        $productos = Producto::where('categoria', $categoria)->get();
        if ($productos->isEmpty()) {
            return response()->json(['message' => 'Categoría inválida o carente de productos'], 404);
        }
        return response()->json($productos);
    }

    // Buscar productos por nombre
    public function buscarPorNombre($nombre)
    {
        $productos = Producto::where('nombre', 'LIKE', '%' . $nombre . '%')->get();
        return response()->json($productos);
    }
}