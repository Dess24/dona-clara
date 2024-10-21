<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Imagen;
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
    public function subirImagen(Request $request)
    {
        $request->validate([
            'imagen' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    
        if ($request->hasFile('imagen')) {
            $file = $request->file('imagen');
            $nombreArchivo = time() . '_' . $file->getClientOriginalName();
            $ruta = 'images/uploads/' . $nombreArchivo;
    
            // Mover el archivo a la ubicación deseada
            $file->move(public_path('images/uploads'), $nombreArchivo);
    
            // Registrar la imagen en la tabla imagenes
            $imagen = new Imagen();
            $imagen->ruta = $ruta;
            $imagen->save();
    
            return response()->json(['message' => 'Imagen subida y registrada correctamente', 'nombreArchivo' => $nombreArchivo], 201);
        }
    
        return response()->json(['message' => 'No se pudo subir la imagen'], 500);
    }

    public function agregarProducto(Request $request)
    {
        // Lista de campos requeridos
        $requiredFields = ['nombre', 'precio', 'cantidad', 'categoria', 'imagen'];
        
        // Verificar si todos los campos requeridos están presentes en la solicitud
        foreach ($requiredFields as $field) {
            if (!$request->has($field)) {
                return response()->json(['message' => "No se ha introducido un valor para el campo: $field"], 400);
            }
        }

        // Validar los datos de la solicitud
        $validatedData = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:1000', // Descripción es opcional
            'precio' => 'required|integer|min:0',
            'cantidad' => 'required|integer|min:0',
            'categoria' => 'required|string|max:255',
            'imagen' => 'required|string|max:255',
        ]);

        // Verificar si la categoría es válida
        $categoria = Categoria::where('nombre', $validatedData['categoria'])->first();
        if (!$categoria) {
            return response()->json(['message' => 'La categoría proporcionada no es válida'], 400);
        }

        // Crear un nuevo producto con los datos validados y la categoría válida
        $producto = Producto::create([
            'nombre' => $validatedData['nombre'],
            'descripcion' => $validatedData['descripcion'] ?? '', // Si no hay descripción, se guarda como cadena vacía
            'precio' => $validatedData['precio'],
            'cantidad' => $validatedData['cantidad'],
            'categoria_id' => $categoria->id,
            'imagen' => $validatedData['imagen'], // Usar solo el nombre de la imagen
        ]);

        return response()->json(['message' => 'Producto agregado exitosamente', 'producto' => $producto], 201);
    }


    public function buscarPorNombre($nombre)
    {
        // Buscar productos que coincidan con el nombre
        $productos = Producto::where('nombre', 'LIKE', "%{$nombre}%")->get();

        // Verificar si se encontraron productos
        if ($productos->isEmpty()) {
            return response()->json(['message' => 'No se encontraron productos'], 404);
        }

        // Devolver los productos encontrados
        return response()->json(['productos' => $productos], 200);
    }

// Buscar productos por una o más categorías
public function buscarPorCategoria($categoriaNombres)
{
    // Convertir la cadena de nombres de categorías en un array
    $categoriaNombresArray = explode(',', $categoriaNombres);

    // Buscar las categorías por nombre
    $categorias = Categoria::whereIn('nombre', $categoriaNombresArray)->get();

    // Verificar si se encontraron categorías
    if ($categorias->isEmpty()) {
        return response()->json(['message' => 'Categoría(s) inválida(s)'], 404);
    }

    // Obtener los IDs de las categorías encontradas
    $categoriaIds = $categorias->pluck('id');

    // Buscar productos por categoría_id
    $productos = Producto::whereIn('categoria_id', $categoriaIds)->get();

    // Retornar los productos, aunque la lista esté vacía
    return response()->json($productos);
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
        'descripcion' => 'nullable|string|max:1000',
        'precio' => 'sometimes|integer|min:0',
        'categoria' => 'sometimes|string|max:255', // Cambiar a string para el nombre de la categoría
        'imagen' => 'sometimes|string|max:255', // Validar el campo imagen
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