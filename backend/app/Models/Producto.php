<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $table = 'productos';

    protected $fillable = [
        'nombre',
        'descripcion',
        'precio', 
        'cantidad',
        'categoria_id',
        'imagen',
    ];

    public function carritoProductos()
    {
        return $this->hasMany(CarritoProducto::class);
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }
    public function imagenes()
    {
        return $this->hasMany(Imagen::class);
    }

    public function ofertaDetalles()
    {
        return $this->hasMany(OfertaDetalle::class, 'producto_id');
    }
}