<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->integer('precio');
            $table->integer('cantidad');
            $table->string('categoria');
            $table->timestamps();
            $table->engine = 'InnoDB'; // Especificar el motor de almacenamiento
        });

        // Datos de ejemplo
        DB::table('productos')->insert([
            ['nombre' => 'Arroz Integral', 'descripcion' => 'Arroz integral de alta calidad.', 'precio' => 150, 'cantidad' => 15, 'categoria' => 'Granos'],
            ['nombre' => 'Aceite de Oliva', 'descripcion' => 'Aceite de oliva extra virgen, ideal para cocinar.', 'precio' => 250, 'cantidad' => 25, 'categoria' => 'Condimentos'],
            ['nombre' => 'Leche Entera', 'descripcion' => 'Leche fresca y nutritiva.', 'precio' => 350, 'cantidad' => 35, 'categoria' => 'Lácteos'],
            ['nombre' => 'Pan Integral', 'descripcion' => 'Pan integral recién horneado.', 'precio' => 450, 'cantidad' => 45, 'categoria' => 'Panadería'],
            ['nombre' => 'Frutas Variadas', 'descripcion' => 'Selección de frutas frescas y orgánicas.', 'precio' => 550, 'cantidad' => 55, 'categoria' => 'Frutas y Verduras'],
            ['nombre' => 'Verduras Frescas', 'descripcion' => 'Verduras de la temporada, frescas y saludables.', 'precio' => 650, 'cantidad' => 65, 'categoria' => 'Frutas y Verduras'],
            ['nombre' => 'Pollo Orgánico', 'descripcion' => 'Pollo criado en libertad y alimentado de forma natural.', 'precio' => 750, 'cantidad' => 75, 'categoria' => 'Carnes'],
            ['nombre' => 'Pasta de Trigo', 'descripcion' => 'Pasta de trigo duro, perfecta para cualquier plato.', 'precio' => 850, 'cantidad' => 85, 'categoria' => 'Granos'],
            ['nombre' => 'Cereal Integral', 'descripcion' => 'Cereal integral para un desayuno saludable.', 'precio' => 950, 'cantidad' => 95, 'categoria' => 'Desayunos'],
            ['nombre' => 'Café 100% Arábica', 'descripcion' => 'Café premium, 100% arábica, tostado a la perfección.', 'precio' => 1100, 'cantidad' => 110, 'categoria' => 'Bebidas'],
        ]);
        
    }
    
    
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};