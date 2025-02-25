<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Imagen extends Model
{
    use HasFactory;

    protected $fillable = [
        'ruta',
        'producto_id',
    ];

    protected $table = 'imagenes'; // Asegúrate de que el nombre de la tabla sea correcto

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
}