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
        Schema::create('food_recommendations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('condition_id')->constrained('health_conditions');
            $table->text('recommended_foods'); // JSON ou relation séparée
            $table->text('avoid_foods');
            $table->text('additional_advice');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('food_recommendations');
    }
};
