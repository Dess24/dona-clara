<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateFotosSliderTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fotosSlider', function (Blueprint $table) {
            $table->id();
            $table->string('ruta'); // Campo varchar
            $table->timestamps();
        });

        // Insertar datos iniciales
        DB::table('fotosSlider')->insert([
            ['ruta' => 'Doña Clara_slider_3.jpg'],
            ['ruta' => 'Doña Clara_slider_2.jpg'],
            ['ruta' => 'Doña Clara_slider_1.jpg']
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fotosSlider');
    }
}