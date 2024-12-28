<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FotosSlider extends Model
{
    use HasFactory;

    // Especificar el nombre de la tabla si es diferente del nombre del modelo en plural
    protected $table = 'fotosSlider';

    // Especificar los campos que se pueden asignar masivamente
    protected $fillable = [
        'ruta',
    ];
}