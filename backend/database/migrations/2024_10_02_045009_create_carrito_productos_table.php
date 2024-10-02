<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('carrito_productos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('carrito_id')->constrained('carrito')->onDelete('cascade');
            $table->foreignId('producto_id')->constrained('productos')->onDelete('cascade');
            $table->integer('cantidad');
            $table->integer('monto_total')->default(0);
            $table->timestamps();
            $table->engine = 'InnoDB'; // Especificar el motor de almacenamiento
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carrito_productos');
    }
};