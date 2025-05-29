<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsTable extends Migration
{
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('utilisateur_id');
            $table->enum('type', ['rappel', 'alerte']);
            $table->text('message');
            $table->boolean('lu')->default(false);
            $table->timestamps();
            $table->foreign('utilisateur_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
    }
}