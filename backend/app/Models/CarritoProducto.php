<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarritoProducto extends Model
{
    use HasFactory;

    protected $table = 'carrito_productos';

    protected $fillable = [
        'carrito_id',
        'producto_id',
        'cantidad',
        'monto_total',
    ];

    public function carrito()
    {
        return $this->belongsTo(Carrito::class);
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
}