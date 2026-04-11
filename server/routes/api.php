<?php

use App\Http\Controllers\Api\V1\AdminReportController;
use App\Http\Controllers\Api\V1\AdminUserController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Auth\ChangePasswordController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::put('/user/profile', function (Request $request) {
        $user = $request->user();
        $validated = $request->validate([
            'phone' => 'required|string|max:20',
            'location' => 'required|string|max:255',
        ]);
        
        $user->update($validated);
        return $user;
    });

    Route::put('/change-password', [ChangePasswordController::class, 'update']);

    Route::prefix('v1')->group(function () {
        Route::apiResource('/reports', ReportController::class);
    });
});

Route::prefix('v1')->group(function () {
    Route::group(['as' => 'admin.'], function () {
        Route::apiResource('/admin/reports', AdminReportController::class);
        Route::apiResource('/admin/users',   AdminUserController::class);
    });
});

require __DIR__.'/auth.php';
