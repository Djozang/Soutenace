<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMealsTable extends Migration
{
    public function up()
    {
        Schema::create('meals', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nom', 255);
            $table->text('description')->nullable();
            $table->float('calories');
            $table->float('protéines');
            $table->float('glucides');
            $table->float('lipides');
            $table->json('restrictions')->nullable();
            $table->string('fréquence', 50)->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('meals');
    }
}