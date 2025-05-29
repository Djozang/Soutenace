<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHealthConditionsTable extends Migration
{
    public function up()
    {
        Schema::create('health_conditions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->json('recommended_foods');
            $table->json('avoid_foods');
            $table->text('additional_advice');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('health_conditions');
    }
}