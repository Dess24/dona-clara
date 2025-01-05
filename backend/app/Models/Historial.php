<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Historial extends Model
{
    use HasFactory;

    protected $table = 'historial';
    protected $primaryKey = 'idPedido'; 

    protected $fillable = [
        'idUsuario',
        'userName',
        'pdf',
        'estado',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'idUsuario');
    }
}