<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddVariantSpecificationsToProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            // Solo Variant Details
            $table->decimal('solo_price', 10, 2)->nullable()->after('price');
            $table->string('solo_unit')->nullable()->after('solo_price');
            $table->string('solo_image')->nullable()->after('image');
            
            // Package Variant Details
            $table->decimal('package_price', 10, 2)->nullable()->after('solo_unit');
            $table->string('package_unit')->nullable()->after('package_price');
            $table->integer('package_qty')->nullable()->after('package_unit');
            $table->string('package_image')->nullable()->after('solo_image');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'solo_price', 
                'solo_unit', 
                'solo_image', 
                'package_price', 
                'package_unit', 
                'package_qty', 
                'package_image'
            ]);
        });
    }
}
