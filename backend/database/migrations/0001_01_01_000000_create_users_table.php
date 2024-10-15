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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name')->default('JUAN');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->boolean('admin')->default(false);
            $table->rememberToken();
            $table->timestamps();
            $table->engine = 'InnoDB'; // Especificar el motor de almacenamiento
        });

        DB::table('users')->insert([
            [
                'name' => 'Admin1',
                'email' => 'admin1@example.com',
                'password' => bcrypt('Da242424'),
                'admin' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Admin2',
                'email' => 'admin2@example.com',
                'password' => bcrypt('Da242424'),
                'admin' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Admin3',
                'email' => 'admin3@example.com',
                'password' => bcrypt('Da242424'),
                'admin' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
            $table->engine = 'InnoDB'; // Especificar el motor de almacenamiento
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
            $table->engine = 'InnoDB'; // Especificar el motor de almacenamiento
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
