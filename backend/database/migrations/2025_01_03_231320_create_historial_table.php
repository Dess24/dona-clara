<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateHistorialTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('historial', function (Blueprint $table) {
            $table->id('idPedido');
            $table->unsignedBigInteger('idUsuario');
            $table->string('userName');
            $table->string('pdf');
            $table->string('estado');
            $table->foreign('idUsuario')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });

        $estados = ['Pendiente', 'Realizado', 'Suspendido'];
        for ($i = 1; $i <= 40; $i++) {
            DB::table('historial')->insert([
                'idUsuario' => 1, // Asumiendo que tienes usuarios con IDs del 1 al 10
                'userName' => 'Usuario' . $i,
                'pdf' => 'pdfs/pedido' . $i . '.pdf',
                'estado' => $estados[array_rand($estados)],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('historial');
    }

}
