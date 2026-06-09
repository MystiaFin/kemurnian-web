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
        Schema::create('hourly_clicks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contact_link_id')->constrained()->onDelete('cascade');
            $table->timestamp('date_hour');
            $table->unsignedInteger('clicks');
            $table->index(['contact_link_id', 'date_hour']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hourly_clicks');
    }
};
