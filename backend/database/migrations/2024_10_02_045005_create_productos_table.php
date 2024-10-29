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
        $table->integer('cantidad')->nullable();
        $table->unsignedBigInteger('categoria_id')->nullable();
        $table->string('imagen')->default('noimage.jpg');
        $table->timestamps();
        $table->engine = 'InnoDB'; // Especificar el motor de almacenamiento

        // Definir la clave foránea
        $table->foreign('categoria_id')->references('id')->on('categorias')->onDelete('set null');
    });

    // Crear la tabla imagenes
    Schema::create('imagenes', function (Blueprint $table) {
        $table->id();
        $table->string('ruta');
        $table->unsignedBigInteger('producto_id')->nullable();
        $table->timestamps();
        $table->engine = 'InnoDB'; // Especificar el motor de almacenamiento

        // Definir la clave foránea
        $table->foreign('producto_id')->references('id')->on('productos')->onDelete('cascade');
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
            ['nombre' => 'Varios'],
        ]);


        DB::table('productos')->insert([
            ['nombre' => 'Jugo de Durazno', 'descripcion' => 'jugo natural de durazno 5 litros', 'precio' => 460, 'categoria_id' => 1, 'imagen' => 'JugoDurazno5L.png', 'cantidad' => 20],
            ['nombre' => 'Jugo de Frutilla natural', 'descripcion' => 'jugo de frutilla de 5 litros', 'precio' => 460, 'categoria_id' => 1, 'imagen' => 'JugoFrutillaNatural.png', 'cantidad' => 20],
            ['nombre' => 'Jugo de Manzana natural sin azúcar', 'descripcion' => 'jugo de manzana sin azucar agregada pero muy dulce', 'precio' => 460, 'categoria_id' => 1, 'imagen' => 'JugoFrutillaNatural.png', 'cantidad' => 20],
            ['nombre' => 'Jugo de Pomelo Rosado', 'descripcion' => 'jugo natural de pomelo rosado 5 litros', 'precio' => 460,  'categoria_id' => 1, 'imagen' => 'JugoPomeloNatural.png', 'cantidad' => 20],
            ['nombre' => 'Jugo Natural de Anana', 'descripcion' => 'jugo de anana de 5 litros', 'precio' => 460,  'categoria_id' => 1, 'imagen' => 'JugoAnanaNatural.png', 'cantidad' => 20],
            ['nombre' => 'Mix frutal', 'descripcion' => 'Mix de frutas natural de 5 litros', 'precio' => 460,  'categoria_id' => 1, 'imagen' => 'JugoMixFrutal.png', 'cantidad' => 20],
            ['nombre' => 'Jugo de naranja natural. 3litros', 'descripcion' => 'Con o sin azúcar', 'precio' => 300, 'categoria_id' => 1, 'imagen' => 'JugoNaranjaNatural.png', 'cantidad' => 20],
            ['nombre' => 'Jugo natural de Pera', 'descripcion' => 'jugo natural de pera 5 litros', 'precio' => 460, 'categoria_id' => 1, 'imagen' => 'JugoNaranjaNatural.png', 'cantidad' => 20],
            ['nombre' => 'Jugo de Limón natural', 'descripcion' => 'jugo de limón natural de 5 litros', 'precio' => 460, 'categoria_id' => 1, 'imagen' => 'JugoNaturalLimon.png', 'cantidad' => 20],
            ['nombre' => 'Jugo de Naranja exprimida al natural', 'descripcion' => 'jugo de naranja natural con y sin azúcar de 5 litros', 'precio' => 380, 'categoria_id' => 1, 'imagen' => 'JugoNaranjaExprimidaNatural.png', 'cantidad' => 20],
            
            ['nombre' => 'Jamón Artesanal', 'descripcion' => 'Envasado al vacío. 650 gr. Aprox', 'precio' => 380, 'categoria_id' => 3, 'imagen' => 'JamonArtesanal.png', 'cantidad' => 20],
            ['nombre' => 'Pechuga de Pavita Ahumada', 'descripcion' => '650gr aprox envasada al vacío', 'precio' => 320, 'categoria_id' => 3, 'imagen' => 'PechugadePavitaAhumada.png', 'cantidad' => 20],
            ['nombre' => 'Bondiola Propios', 'descripcion' => 'Trozo Envasado al Vacio de 600 gr apro', 'precio' => 300, 'categoria_id' => 3, 'imagen' => 'bondiolaPropios.png', 'cantidad' => 20],
            ['nombre' => 'Salamines y longanizas casera Propios', 'descripcion' => 'La unidad 250gr aprox', 'precio' => 150, 'categoria_id' => 3, 'imagen' => 'salaminesylonganizas.png', 'cantidad' => 20],
            
            ['nombre' => 'Aceitunas Verdes sin Carozo', 'descripcion' => '1.9kg Escurridas 1Kg', 'precio' => 400, 'categoria_id' => 4, 'imagen' => 'aceitunasSincarozo.png', 'cantidad' => 20],
            ['nombre' => 'Aceitunas Verdes con Carozo', 'descripcion' => '1.9kg Escurridas 1Kg', 'precio' => 360, 'categoria_id' => 4, 'imagen' => 'aceitunasConcarozo.png', 'cantidad' => 20],
            
            ['nombre' => 'Mix premium sin sal 1kg', 'descripcion' => null, 'precio' => 890, 'categoria_id' => 8, 'imagen' => 'mixPremiumsinSal.png', 'cantidad' => 20],
            
            ['nombre' => 'Yerba de pago en pago 1 kg', 'descripcion' => 'Yerba de dos años de estacionamiento molienda equilibrada tipo Pu-1. no provoca acides sin perder el sabor del verdadero mate.', 'precio' => 180, 'categoria_id' => 5, 'imagen' => 'YerbadePagoenPago.png', 'cantidad' => 20],
            ['nombre' => 'Yerba De pago en Pago 1/2 kg', 'descripcion' => 'Yerba de dos años de estacionamiento , molienda equilibrada tipo Pu-1 (no genera acides pero conserva el sabor del verdadero mate.', 'precio' => 100, 'categoria_id' => 5, 'imagen' => 'YerbadePagoenPagomedioKG.png', 'cantidad' => 20],
            
            ['nombre' => 'Perfumador Piur. 3000 decargas', 'descripcion' => '10 Fragancias únicas. Larga duración, el mejor de plaza', 'precio' => 300, 'categoria_id' => 9, 'imagen' => 'aromatizante.png', 'cantidad' => 20],
            
            ['nombre' => 'Cerveza Budweiser caja de 6x 330cl', 'descripcion' => 'Oferta momentanea de cerveza', 'precio' => 400, 'categoria_id' => 6, 'imagen' => '6Cervezas.png', 'cantidad' => 20],
            ['nombre' => 'Cerveza Artesanal cabezas beer Pack de 9 x 1litro', 'descripcion' => null, 'precio' => 1750, 'categoria_id' => 6, 'imagen' => 'cervezasssssss.png', 'cantidad' => 20],
            
            ['nombre' => '4 Bidones Descartables de 7 litros', 'descripcion' => '4 Bidones de agua mineral Aqua.a Con entrega a domicilio', 'precio' => 500, 'categoria_id' => 7, 'imagen' => '4bidones7L.png', 'cantidad' => 20],
            ['nombre' => 'Bidón de 10 litros', 'descripcion' => null, 'precio' => 220, 'categoria_id' => 7, 'imagen' => 'bidon10L.png', 'cantidad' => 20],
            ['nombre' => 'Bidón de 20 litros', 'descripcion' => null, 'precio' => 380, 'categoria_id' => 7, 'imagen' => 'bidon20L.png', 'cantidad' => 20],
        ]);
        


        // Insertar datos
        DB::table('productos')->insert([
            ['nombre' => 'Queso Tybo Don Santi', 'descripcion' => 'Trozo de 300gr aprox envasado al vacío', 'precio' => 220, 'cantidad' => null, 'categoria_id' => 2, 'imagen' => 'tybo.png'],
            ['nombre' => 'Queso Magro Don Santi', 'descripcion' => '300 gr aprox envasado al vacío', 'precio' => 220, 'cantidad' => null, 'categoria_id' => 2, 'imagen' => 'quesomagro.png'],
            ['nombre' => 'Queso Cuartirolo hormita de 700gr aprox', 'descripcion' => null, 'precio' => 350, 'cantidad' => null, 'categoria_id' => 2, 'imagen' => 'quesocuarti.png'],
            ['nombre' => 'Provolone en Rodajas', 'descripcion' => '2 Rodajas envasadas al vacío.350gr aprox', 'precio' => 220, 'cantidad' => null, 'categoria_id' => 2, 'imagen' => 'provolone.png'],
            ['nombre' => 'Queso Muzarella Don Santi', 'descripcion' => 'Trozo 700gr envasados al vacío', 'precio' => 350, 'cantidad' => null, 'categoria_id' => 2, 'imagen' => 'muzza.png'],
            ['nombre' => 'Queso Dambo Don Santi', 'descripcion' => '300 gr aprox envasado al vacío', 'precio' => 220, 'cantidad' => null, 'categoria_id' => 2, 'imagen' => 'dambo.png'],
            ['nombre' => 'Queso Untable Tybo', 'descripcion' => 'Pote de 200gr', 'precio' => 120, 'cantidad' => null, 'categoria_id' => 2, 'imagen' => 'tybo.png'],
            ['nombre' => 'Queso colonia Don Santi', 'descripcion' => 'Precio del kilo. Cuña de aprox 300gr', 'precio' => 520, 'cantidad' => null, 'categoria_id' => 2, 'imagen' => 'colonia.png'],
            ['nombre' => 'Queso Semiduro Tipo Parmesano o sabrinz', 'descripcion' => 'Trozo de 450gr aprox $260', 'precio' => 520, 'cantidad' => null, 'categoria_id' => 2, 'imagen' => 'sbrinz.png'],
            ['nombre' => 'Queso rallado en hebra o fino', 'descripcion' => '1kg buena calidad y sabor', 'precio' => 360, 'cantidad' => null, 'categoria_id' => 2, 'imagen' => 'rallado.png'],
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