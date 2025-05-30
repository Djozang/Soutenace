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
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('repas_id');
            $table->enum('type_contenu', ['texte', 'vidéo', 'audio']);
            $table->text('contenu')->nullable();
            $table->string('url_média', 255)->nullable();
            $table->boolean('validé')->default(false);
            $table->timestamps();
            $table->foreign('repas_id')->references('id')->on('repas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipes');
    }
};
