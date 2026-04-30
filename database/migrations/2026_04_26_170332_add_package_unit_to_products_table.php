<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPackageUnitToProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // package_unit is fully managed by 2026_04_26_200000_add_variant_specifications_to_products_table
        // This migration is kept for historical tracking only
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'package_unit')) {
                $table->string('package_unit')->nullable();
            }
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
            $table->dropColumn(['package_unit', 'package_qty']);
        });
    }
}
