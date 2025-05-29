<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMealPlansTable extends Migration
{
    public function up()
    {
        Schema::create('meal_plans', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('utilisateur_id');
            $table->unsignedBigInteger('meal_id');
            $table->date('date');
            $table->enum('type_repas', ['petit_dejeuner', 'dejeuner', 'diner']);
            $table->timestamps();
            $table->foreign('utilisateur_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('meal_id')->references('id')->on('meals')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('meal_plans');
    }
}