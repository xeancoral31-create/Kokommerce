<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSellerWhitelistTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('seller_whitelist', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('notes')->nullable();
            $table->timestamps();
        });

        // Pre-approved Artisanal Sellers
        DB::table('seller_whitelist')->insert([
            ['email' => 'xean.coral@urios.edu.ph', 'notes' => 'Primary Seller'],
            ['email' => 'xeancoral31@gmail.com', 'notes' => 'Secondary Seller'],
            ['email' => 'John.santiago@urios.edu.ph', 'notes' => 'Backup Seller'],
        ]);
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('seller_whitelist');
    }
}
