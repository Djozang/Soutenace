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
        Schema::create('plannifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('repas_id')->constrained('repas')->onDelete('cascade');
            $table->enum('type_de_repas', ['petit-déjeuner', 'déjeuner', 'souper', 'gouter', 'dîner'])->default('petit-déjeuner');
            $table->date('date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plannifications');
    }
};
