<?php

use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Auth\ChangePasswordController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::put('/change-password', [ChangePasswordController::class, 'update']);

    Route::prefix('v1')->group(function () {
        Route::apiResource('/reports', ReportController::class);
    });
});

require __DIR__.'/auth.php';
