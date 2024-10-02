<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Carrito;
use App\Models\CarritoProducto;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CarritoController extends Controller
{
    // Agregar producto al carrito
    public function añadirProducto(Request $request)
    {
        $userId = Auth::id();
        if (is_null($userId)) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        $producto = Producto::find($request->producto_id);
        if (!$producto) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        if ($request->cantidad <= 0) {
            return response()->json(['message' => 'La cantidad debe ser mayor que cero'], 400);
        }

        $carrito = Carrito::firstOrCreate(['user_id' => $userId]);

        $carritoProducto = CarritoProducto::where('carrito_id', $carrito->id)
            ->where('producto_id', $producto->id)
            ->first();

        if ($carritoProducto) {
            // Si el producto ya está en el carrito, suma la cantidad y actualiza el monto total
            $carritoProducto->cantidad += $request->cantidad;
            $carritoProducto->monto_total += $producto->precio * $request->cantidad;
            $carritoProducto->save();
        } else {
            // Si el producto no está en el carrito, crea una nueva entrada
            $carritoProducto = CarritoProducto::create([
                'carrito_id' => $carrito->id,
                'producto_id' => $producto->id,
                'cantidad' => $request->cantidad,
                'monto_total' => $producto->precio * $request->cantidad,
            ]);
        }

        // Actualizar el monto total del carrito
        $carrito->monto_total += $producto->precio * $request->cantidad;
        $carrito->save();

        // Ocultar created_at y updated_at
        $carritoProducto->makeHidden(['created_at', 'updated_at']);

        return response()->json(['message' => 'Producto agregado al carrito', 'carritoProducto' => $carritoProducto]);
    }

    // Ver el carrito
    public function verCarrito()
    {
        $userId = Auth::id();
        if (is_null($userId)) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        $carrito = Carrito::where('user_id', $userId)->first();
        if (!$carrito || $carrito->monto_total == 0) {
            return response()->json(['message' => 'El carrito está vacío'], 404);
        }

        $productosCarrito = $carrito->productosCarrito()->with('producto')->get();

        // Ocultar created_at y updated_at
        $carrito->makeHidden(['created_at', 'updated_at']);
        $productosCarrito->each(function ($productoCarrito) {
            $productoCarrito->makeHidden(['created_at', 'updated_at']);
            $productoCarrito->producto->makeHidden(['created_at', 'updated_at']);
        });

        return response()->json(['carrito' => $carrito, 'productosCarrito' => $productosCarrito]);
    }

    // Pagar el carrito
    public function checkout()
    {
        $userId = Auth::id();
        if (is_null($userId)) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        $carrito = Carrito::where('user_id', $userId)->first();
        if (!$carrito || $carrito->monto_total == 0) {
            return response()->json(['message' => 'No hay productos para comprar'], 404);
        }

        // Aquí puedes agregar la lógica para procesar el pago

        // Vaciar el carrito después del pago
        CarritoProducto::where('carrito_id', $carrito->id)->delete();
        $carrito->monto_total = 0;
        $carrito->save();

        return response()->json(['message' => 'Compra realizada con éxito']);
    }

    // Restar cantidad de un producto en el carrito
    public function restarProducto(Request $request)
    {
        $userId = Auth::id();
        if (is_null($userId)) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        $producto = Producto::find($request->producto_id);
        if (!$producto) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        $carrito = Carrito::where('user_id', $userId)->first();
        if (!$carrito) {
            return response()->json(['message' => 'El carrito está vacío'], 404);
        }

        $carritoProducto = CarritoProducto::where('carrito_id', $carrito->id)
            ->where('producto_id', $producto->id)
            ->first();

        if (!$carritoProducto) {
            return response()->json(['message' => 'El producto no está en el carrito'], 404);
        }

        if ($request->cantidad <= 0) {
            return response()->json(['message' => 'La cantidad debe ser mayor que cero'], 400);
        }

        if ($request->cantidad > $carritoProducto->cantidad) {
            return response()->json(['message' => 'La cantidad a restar es mayor que la cantidad en el carrito'], 400);
        }

        $carritoProducto->cantidad -= $request->cantidad;
        $carritoProducto->monto_total -= $producto->precio * $request->cantidad;

        if ($carritoProducto->cantidad <= 0) {
            $carritoProducto->delete();
        } else {
            $carritoProducto->save();
        }

        // Actualizar el monto total del carrito
        $carrito->monto_total -= $producto->precio * $request->cantidad;
        if ($carrito->monto_total < 0) {
            $carrito->monto_total = 0;
        }
        $carrito->save();

        // Ocultar created_at y updated_at
        $carritoProducto->makeHidden(['created_at', 'updated_at']);

        return response()->json(['message' => 'Cantidad del producto actualizada', 'carritoProducto' => $carritoProducto]);
    }
}