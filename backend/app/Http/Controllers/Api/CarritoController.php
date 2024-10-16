<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Carrito;
use App\Models\CarritoProducto;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use FPDF;

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


    // Pagar el carrito
    public function checkout()
    {
        $userId = Auth::id();
        if (is_null($userId)) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }
    
        $user = Auth::user();
        $userName = $user->name;
    
        $carrito = Carrito::where('user_id', $userId)->first();
        if (!$carrito || $carrito->monto_total == 0) {
            return response()->json(['message' => 'No hay productos para comprar'], 404);
        }
    
        // Obtener los productos del carrito antes de vaciarlo
        $productosCarrito = CarritoProducto::where('carrito_id', $carrito->id)->get();
    
        // Calcular el monto total gastado
        $montoTotalGastado = $carrito->monto_total;
    
        // Vaciar el carrito después del pago
        CarritoProducto::where('carrito_id', $carrito->id)->delete();
        $carrito->monto_total = 0;
        $carrito->save();
    
        // Preparar los datos de los productos comprados
        $productosComprados = $productosCarrito->map(function ($productoCarrito) {
            return [
                'nombre' => $productoCarrito->producto->nombre,
                'cantidad' => $productoCarrito->cantidad,
                'precio' => $productoCarrito->producto->precio,
                'monto_total' => $productoCarrito->cantidad * $productoCarrito->producto->precio,
            ];
        });
    
        // Generar el PDF de la factura
        $pdfPath = $this->facturaCompra($productosComprados, $montoTotalGastado, $userName);
    
        return response()->json([
            'message' => 'Compra realizada con éxito',
            'productos_comprados' => $productosComprados,
            'monto_total_gastado' => $montoTotalGastado,
            'pdf_path' => $pdfPath,
        ]);
    }

    
    public function facturaCompra($productosComprados, $montoTotalGastado, $userName)
    {
        // Crear la carpeta 'pdfs' si no existe
        if (!file_exists('pdfs')) {
            mkdir('pdfs', 0777, true);
        }
    
        // Crear una instancia de FPDF
        $pdf = new FPDF();
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 16);
    
        // Agregar la imagen del logo
        $logoPath = public_path('images/logo2.png');
        if (file_exists($logoPath)) {
            $pdf->Image($logoPath, ($pdf->GetPageWidth() - 50) / 2, 10, 50); // Centrar la imagen
            $pdf->Ln(30); // Añadir espacio después de la imagen
        }
    
        // Título principal
        $pdf->Cell(0, 10, iconv('UTF-8', 'ISO-8859-1', 'Factura de Compra'), 0, 1, 'C');
        $pdf->Ln(10);
    
        // Nombre del usuario
        $pdf->SetFont('Arial', '', 12);
        $pdf->Cell(0, 10, 'Nombre del Usuario: ' . iconv('UTF-8', 'ISO-8859-1', $userName), 0, 1);
        $pdf->Ln(5);
    
        // Fecha de la compra
        $fechaCompra = date('d-m-Y H:i:s');
        $pdf->Cell(0, 10, 'Fecha de la Compra: ' . $fechaCompra, 0, 1);
        $pdf->Ln(10);
    
        // Encabezado de la tabla
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(60, 10, 'Nombre del Producto', 1);
        $pdf->Cell(40, 10, 'Cantidad', 1);
        $pdf->Cell(60, 10, 'Precio', 1);
        $pdf->Ln();
    
        // Datos de los productos comprados
        $pdf->SetFont('Arial', '', 12);
        foreach ($productosComprados as $producto) {
            $pdf->Cell(60, 10, iconv('UTF-8', 'ISO-8859-1', $producto['nombre']), 1);
            $pdf->Cell(40, 10, $producto['cantidad'], 1);
            $precioTotal = $producto['cantidad'] * $producto['precio'];
            $pdf->Cell(60, 10, number_format($precioTotal, 2) . ' (' . number_format($producto['precio'], 2) . '$ por unidad)', 1);
            $pdf->Ln();
        }
    
        // Monto total gastado
        $pdf->Ln(10);
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(0, 10, 'Monto Total Gastado: ' . number_format($montoTotalGastado, 2), 0, 1, 'R');
    
        // Texto adicional
        $pdf->Ln(20);
        $pdf->SetFont('Arial', 'I', 10);
        $pdf->Cell(0, 10, 'El pago del producto se debe coordinar con el proveedor del mismo', 0, 1, 'C');
    
        // Guardar el PDF en un archivo
        $pdfPath = 'pdfs/factura_compra_' . time() . '.pdf';
        $pdf->Output('F', $pdfPath);
    
        return $pdfPath;
    }
}