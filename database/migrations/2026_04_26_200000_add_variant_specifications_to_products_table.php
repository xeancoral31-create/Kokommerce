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
            if (!Schema::hasColumn('products', 'solo_price'))
                $table->decimal('solo_price', 10, 2)->nullable()->after('price');
            if (!Schema::hasColumn('products', 'solo_unit'))
                $table->string('solo_unit')->nullable()->after('solo_price');
            if (!Schema::hasColumn('products', 'solo_image'))
                $table->string('solo_image')->nullable()->after('image');

            // Package Variant Details
            if (!Schema::hasColumn('products', 'package_price'))
                $table->decimal('package_price', 10, 2)->nullable()->after('solo_unit');
            if (!Schema::hasColumn('products', 'package_unit'))
                $table->string('package_unit')->nullable()->after('package_price');
            if (!Schema::hasColumn('products', 'package_qty'))
                $table->integer('package_qty')->nullable()->after('package_unit');
            if (!Schema::hasColumn('products', 'package_image'))
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
