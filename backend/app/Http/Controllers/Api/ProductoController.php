<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\Categoria;
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
            return response()->json(['message' => 'Producto no enconfffftrado'], 404);
        }
        return response()->json($producto);
    }

    // Buscar productos por categoría
    public function buscarPorCategoria($categoriaNombre)
    {
        // Buscar la categoría por nombre
        $categoria = Categoria::where('nombre', $categoriaNombre)->first();
    
        // Verificar si la categoría existe
        if (!$categoria) {
            return response()->json(['message' => 'Categoría inválida o carente de productos'], 404);
        }
    
        // Buscar productos por categoría_id
        $productos = Producto::where('categoria_id', $categoria->id)->get();
    
        // Verificar si hay productos en la categoría
        if ($productos->isEmpty()) {
            return response()->json(['message' => 'Categoría carente de productos'], 404);
        }
    
        return response()->json($productos);
    }



    // Función para agregar un producto
    public function agregarProducto(Request $request)
    {
        // Lista de campos requeridos
        $requiredFields = ['nombre', 'descripcion', 'precio', 'cantidad', 'categoria'];
        
        // Verificar si todos los campos requeridos están presentes en la solicitud
        foreach ($requiredFields as $field) {
            if (!$request->has($field)) {
                return response()->json(['message' => "No se ha introducido un valor para el campo: $field"], 400);
            }
        }
    
        // Validar los datos de la solicitud
        $validatedData = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string|max:1000',
            'precio' => 'required|integer|min:0',
            'cantidad' => 'required|integer|min:0',
            'categoria' => 'required|string|max:255',
        ]);
    
        // Verificar si la categoría es válida
        $categoria = Categoria::where('nombre', $validatedData['categoria'])->first();
        if (!$categoria) {
            return response()->json(['message' => 'La categoría proporcionada no es válida'], 400);
        }
    
        // Crear un nuevo producto con los datos validados y la categoría válida
        $producto = Producto::create([
            'nombre' => $validatedData['nombre'],
            'descripcion' => $validatedData['descripcion'],
            'precio' => $validatedData['precio'],
            'cantidad' => $validatedData['cantidad'],
            'categoria_id' => $categoria->id,
        ]);
    
        return response()->json(['message' => 'Producto agregado exitosamente', 'producto' => $producto], 201);
    }



    // Función para quitar un producto
    public function quitarProducto($id)
    {
        $producto = Producto::find($id);
        if (!$producto) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        $producto->delete();
        return response()->json(['message' => 'Producto eliminado exitosamente'], 200);
    }



    // Función para modificar un producto
    public function modificarProducto(Request $request, $id)
    {
        $producto = Producto::find($id);
        if (!$producto) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }
    
        // Validar los datos de la solicitud
        $validatedData = $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'descripcion' => 'sometimes|string|max:1000',
            'precio' => 'sometimes|integer|min:0',
            'cantidad' => 'sometimes|integer|min:0',
            'categoria' => 'sometimes|string|max:255', // Cambiar a string para el nombre de la categoría
        ]);
    
        // Verificar si la categoría es válida
        if (isset($validatedData['categoria'])) {
            $categoria = Categoria::where('nombre', $validatedData['categoria'])->first();
            if (!$categoria) {
                return response()->json(['message' => 'La categoría proporcionada no es válida'], 400);
            }
            $validatedData['categoria_id'] = $categoria->id;
            unset($validatedData['categoria']); // Eliminar el campo 'categoria' ya que no existe en la tabla 'productos'
        }
    
        // Actualizar solo los campos presentes en la solicitud
        $producto->update($validatedData);
        return response()->json(['message' => 'Producto modificado exitosamente', 'producto' => $producto], 200);
    }



    // Función para actualizar el stock de un producto
    public function actualizarStock(Request $request, $id)
    {
        $producto = Producto::find($id);
        if (!$producto) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }
        if (!$request->has('cantidad')) {
            return response()->json(['message' => 'No se ha introducido una cantidad de stock'], 400);
        }
        // Validar los datos de la solicitud
        $validatedData = $request->validate([
            'cantidad' => 'required|integer|min:0',
        ]);

        // Actualizar el stock
        $producto->cantidad = $validatedData['cantidad'];
        $producto->save();
        return response()->json(['message' => 'Stock actualizado exitosamente', 'producto' => $producto], 200);
    }

        
        // Función para agregar una categoría
    public function agregarCategoria(Request $request)
    {
        // Validar los datos de la solicitud
        $validatedData = $request->validate([
            'nombre' => 'required|string|unique:categorias,nombre',
        ]);

        // Crear una nueva categoría
        $categoria = new Categoria();
        $categoria->nombre = $validatedData['nombre'];
        $categoria->save();

        return response()->json(['message' => 'Categoría agregada exitosamente', 'categoria' => $categoria], 201);
    }

    // Función para borrar una categoría
    public function borrarCategoria($id)
    {
        // Buscar la categoría por su ID
        $categoria = Categoria::find($id);

        if (!$categoria) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        // Eliminar la categoría
        $categoria->delete();

        return response()->json(['message' => 'Categoría borrada exitosamente'], 200);
    }

        public function mostrarCategorias()
    {
        // Obtener todas las categorías
        $categorias = Categoria::all();

        // Retornar las categorías en formato JSON
        return response()->json($categorias, 200);
    }

    public function mostrarRecientes()
{
    $productos = Producto::orderBy('created_at', 'desc')->take(10)->get();
    if ($productos->isEmpty()) {
        return response()->json(['message' => 'No hay productos disponibles'], 404);
    }
    return response()->json($productos);
}

}