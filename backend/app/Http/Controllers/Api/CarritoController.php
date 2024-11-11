<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Carrito;
use App\Models\CarritoProducto;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use FPDF;
use App\Models\User;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

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
     // Ver el carrito
     public function verCarrito()
     {
         $userId = Auth::id();
         if (is_null($userId)) {
             return response()->json(['message' => 'Usuario no autenticado'], 401);
         }
 
         $carrito = Carrito::where('user_id', $userId)->first();
         if (!$carrito || $carrito->monto_total == 0) {
             return response()->json(['message' => 'El carrito está vacío', 'carrito' => null, 'productosCarrito' => []], 200);
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

    public function actualizarProducto(Request $request, $productoId)
    {
        $userId = Auth::id();
        if (is_null($userId)) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        $nuevaCantidad = $request->input('cantidad');
        if ($nuevaCantidad <= 0) {
            return response()->json(['message' => 'La cantidad debe ser mayor que cero'], 400);
        }

        $carrito = Carrito::where('user_id', $userId)->first();
        if (!$carrito) {
            return response()->json(['message' => 'Carrito no encontrado'], 404);
        }

        $item = CarritoProducto::where('carrito_id', $carrito->id)
            ->where('producto_id', $productoId)
            ->first();
        if (!$item) {
            return response()->json(['message' => 'Producto no encontrado en el carrito'], 404);
        }

        $producto = Producto::find($productoId);
        if (!$producto) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        if ($nuevaCantidad > $producto->cantidad) {
            return response()->json(['message' => 'La cantidad no puede superar el stock disponible'], 400);
        }

        // Calcular la diferencia de cantidad y ajustar el monto total
        $diferenciaCantidad = $nuevaCantidad - $item->cantidad;
        $diferenciaMonto = $diferenciaCantidad * $producto->precio;

        // Actualizar la cantidad del producto en el carrito
        $item->cantidad = $nuevaCantidad;
        $item->monto_total = $nuevaCantidad * $producto->precio;
        $item->save();

        // Actualizar el monto total del carrito
        $carrito->monto_total += $diferenciaMonto;
        $carrito->save();

        // Ocultar created_at y updated_at
        $item->makeHidden(['created_at', 'updated_at']);

        return response()->json(['message' => 'Producto actualizado en el carrito', 'carritoProducto' => $item]);
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
    
        if ($carritoProducto->cantidad < 1) {
            $carritoProducto->cantidad = 1;
            $carritoProducto->monto_total = $producto->precio; // Ajustar el monto total al precio del producto
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


    public function checkout()
    {
        $userId = Auth::id();
        if (is_null($userId)) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }
    
        $user = Auth::user();
        $userName = $user->name;
        $userEmail = $user->email;
        $userTelefono = $user->telefono;
        $userDomicilio = $user->domicilio;
    
        $carrito = Carrito::where('user_id', $userId)->first();
        if (!$carrito || $carrito->monto_total == 0) {
            return response()->json(['message' => 'No hay productos para comprar'], 404);
        }
    
        $productosCarrito = CarritoProducto::where('carrito_id', $carrito->id)->get();
        $montoTotalGastado = $carrito->monto_total;
    
        CarritoProducto::where('carrito_id', $carrito->id)->delete();
        $carrito->monto_total = 0;
        $carrito->save();
    
        $productosComprados = $productosCarrito->map(function ($productoCarrito) {
            return [
                'nombre' => $productoCarrito->producto->nombre,
                'cantidad' => $productoCarrito->cantidad,
                'precio' => $productoCarrito->producto->precio,
                'monto_total' => $productoCarrito->cantidad * $productoCarrito->producto->precio,
            ];
        });
    
        $pdfData = $this->facturaCompra($productosComprados, $montoTotalGastado, $userName, $userEmail, $userTelefono, $userDomicilio);
        $pdfContent = $pdfData['content'];
        $pdfFileName = $pdfData['file_name'];
    
        return response($pdfContent, 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="' . $pdfFileName . '"');
    }
    
    public function facturaCompra($productosComprados, $montoTotalGastado, $userName, $userEmail, $userTelefono, $userDomicilio)
    {
        if (!file_exists('pdfs')) {
            mkdir('pdfs', 0777, true);
        }
    
        $pdf = new FPDF();
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 16);
    
        $logoPath = public_path('images/logo2.png');
        if (file_exists($logoPath)) {
            $pdf->Image($logoPath, ($pdf->GetPageWidth() - 50) / 2, 10, 50);
            $pdf->Ln(30);
        }
    
        $pdf->Cell(0, 10, iconv('UTF-8', 'ISO-8859-1', 'Factura de Compra'), 0, 1, 'C');
        $pdf->Ln(10);
    
        $pdf->SetFont('Arial', '', 12);
        $pdf->Cell(0, 10, 'Nombre del Usuario: ' . iconv('UTF-8', 'ISO-8859-1', $userName), 0, 1);
        $pdf->Ln(5);
    
        $fechaCompra = date('d-m-Y H:i:s');
        $pdf->Cell(0, 10, 'Fecha de la Compra: ' . $fechaCompra, 0, 1);
        $pdf->Ln(10);
    
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(90, 10, 'Nombre del Producto', 1);
        $pdf->Cell(30, 10, 'Cantidad', 1);
        $pdf->Cell(70, 10, 'Precio', 1);
        $pdf->Ln();
    
        $pdf->SetFont('Arial', '', 12);
        foreach ($productosComprados as $producto) {
            $pdf->Cell(90, 10, iconv('UTF-8', 'ISO-8859-1', $producto['nombre']), 1);
            $pdf->Cell(30, 10, $producto['cantidad'], 1);
            $precioTotal = $producto['cantidad'] * $producto['precio'];
            $pdf->Cell(70, 10, number_format($precioTotal, 2) . ' (' . number_format($producto['precio'], 2) . '$ por unidad)', 1);
            $pdf->Ln();
        }
    
        $pdf->Ln(10);
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(0, 10, 'Monto Total Gastado: ' . number_format($montoTotalGastado, 2), 0, 1, 'R');
    
        $pdf->Ln(20);
        $pdf->SetFont('Arial', 'I', 10);
        $pdf->Cell(0, 10, 'El pago del producto se debe coordinar con el proveedor del mismo', 0, 1, 'C');
    
        $pdf->Ln(10);
        $pdf->SetFont('Arial', '', 12);
        $pdf->Cell(0, 10, 'Contacto: ' . $userTelefono, 0, 1);
        $pdf->Cell(0, 10, 'Direccion: ' . iconv('UTF-8', 'ISO-8859-1', $userDomicilio), 0, 1);
    
        $pdfFileName = 'factura_compra_' . time() . '.pdf';
        $pdfPath = 'pdfs/' . $pdfFileName;
        $pdf->Output('F', $pdfPath);
    
        // Enviar el PDF por correo electrónico
        $email = $userEmail;
        $subject = 'Factura de Compra';
        $body = 'Hola ,' . $userName . ', Hemos recibido correctamente su pedido y lo estamos procesando. Adjunto encontrará la factura de su compra.';
    
        $phpMailer = new PHPMailerController();
    
        try {
            ob_start();
            $phpMailer->sendEmail($email, $subject, $body, $pdfPath);
            $smtpLog = ob_get_clean();
        } catch (\Exception $e) {
            // Manejar el error de envío de correo
        }
    
        return [
            'content' => file_get_contents($pdfPath),
            'file_name' => $pdfFileName
        ];
    }


public function userData(Request $request)
{
    $user = Auth::user();

    if (!$user) {
        return response()->json(['message' => 'User not authenticated'], 401);
    }

    return $user;
}

// Eliminar producto del carrito
public function eliminarProducto(Request $request)
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
        return response()->json(['message' => 'Carrito no encontrado'], 404);
    }

    $carritoProducto = CarritoProducto::where('carrito_id', $carrito->id)
        ->where('producto_id', $producto->id)
        ->first();

    if (!$carritoProducto) {
        return response()->json(['message' => 'Producto no encontrado en el carrito'], 404);
    }

    // Restar el monto total del producto del monto total del carrito
    $carrito->monto_total -= $carritoProducto->monto_total;
    $carrito->save();

    // Eliminar el producto del carrito
    $carritoProducto->delete();

    return response()->json(['message' => 'Producto eliminado del carrito']);
}
}
