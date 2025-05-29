<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHealthParametersTable extends Migration
{
    public function up()
    {
        Schema::create('health_parameters', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('utilisateur_id');
            $table->float('tension')->nullable();
            $table->float('poids')->nullable();
            $table->float('température')->nullable();
            $table->date('date_enregistrement');
            $table->timestamps();
            $table->foreign('utilisateur_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('health_parameters');
    }
}