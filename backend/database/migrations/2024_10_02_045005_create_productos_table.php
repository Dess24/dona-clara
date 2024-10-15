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
        // Crear la tabla categorias primero
        Schema::create('categorias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->timestamps();
            $table->engine = 'InnoDB';
        });

        // Crear la tabla productos después
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->integer('precio');
            $table->integer('cantidad');
            $table->unsignedBigInteger('categoria_id')->nullable();
            $table->string('imagen')->default('noimage.jpeg');
            $table->timestamps();
            $table->engine = 'InnoDB'; // Especificar el motor de almacenamiento

            // Definir la clave foránea
            $table->foreign('categoria_id')->references('id')->on('categorias')->onDelete('set null');
        });

        // Datos de ejemplo
        DB::table('categorias')->insert([
            ['nombre' => 'Jugos'],
            ['nombre' => 'Quesos'],
            ['nombre' => 'Fiambres'],
            ['nombre' => 'Aceitunas'],
            ['nombre' => 'Yerbas'],
            ['nombre' => 'Cervezas'],
            ['nombre' => 'Agua'],
            ['nombre' => 'Frutos Secos'],
        ]);

        DB::table('productos')->insert([
            ['nombre' => 'Jugo de Naranja', 'descripcion' => 'Jugo de naranja natural.', 'precio' => 150, 'cantidad' => 15, 'categoria_id' => 1],
            ['nombre' => 'Queso Cheddar', 'descripcion' => 'Queso cheddar de alta calidad.', 'precio' => 250, 'cantidad' => 25, 'categoria_id' => 2],
            ['nombre' => 'Jamón Serrano', 'descripcion' => 'Jamón serrano curado.', 'precio' => 350, 'cantidad' => 35, 'categoria_id' => 3],
            ['nombre' => 'Aceitunas Verdes', 'descripcion' => 'Aceitunas verdes en salmuera.', 'precio' => 450, 'cantidad' => 45, 'categoria_id' => 4],
            ['nombre' => 'Yerba Mate', 'descripcion' => 'Yerba mate tradicional.', 'precio' => 550, 'cantidad' => 55, 'categoria_id' => 5],
            ['nombre' => 'Cerveza Artesanal', 'descripcion' => 'Cerveza artesanal de trigo.', 'precio' => 650, 'cantidad' => 65, 'categoria_id' => 6],
            ['nombre' => 'Agua Mineral', 'descripcion' => 'Agua mineral natural.', 'precio' => 750, 'cantidad' => 75, 'categoria_id' => 7],
            ['nombre' => 'Almendras', 'descripcion' => 'Frutos secos de almendra.', 'precio' => 850, 'cantidad' => 85, 'categoria_id' => 8],
            ['nombre' => 'Pistachos', 'descripcion' => 'Frutos secos de pistacho.', 'precio' => 950, 'cantidad' => 95, 'categoria_id' => 8],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
        Schema::dropIfExists('categorias');
    }
};