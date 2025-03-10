<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Oferta extends Model
{
    use HasFactory;

    protected $table = 'ofertas';

    protected $fillable = [
        'nombre',
        'descripcion',
        'user_id',
        'precio',
    ];

    public function detalles()
    {
        return $this->hasMany(OfertaDetalle::class, 'oferta_id');
    }
}

class OfertaDetalle extends Model
{
    use HasFactory;

    protected $table = 'oferta_detalles';

    protected $fillable = [
        'oferta_id',
        'producto_id',
        'cantidad',
        'precio',
    ];

    public function oferta()
    {
        return $this->belongsTo(Oferta::class, 'oferta_id');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }
}