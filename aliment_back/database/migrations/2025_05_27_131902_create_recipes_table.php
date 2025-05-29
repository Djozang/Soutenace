<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRecipesTable extends Migration
{
    public function up()
    {
        Schema::create('recipes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('repas_id');
            $table->enum('type_contenu', ['texte', 'vidéo', 'audio']);
            $table->text('contenu')->nullable();
            $table->string('url_média', 255)->nullable();
            $table->boolean('validé')->default(false);
            $table->timestamps();
            $table->foreign('repas_id')->references('id')->on('repas')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('recipes');
    }
}