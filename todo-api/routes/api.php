<?php

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum'])->group(function () {
    // Route::get('todos',[TodoController::class,'index']);
    Route::resource('task',TaskController::class);
    // Route::get('task',TaskController::class,);


    // Archive route for soft-deleted tasks
    Route::get('archive', [TaskController::class, 'archive']);
    Route::delete('archive/{task}', [TaskController::class, 'permanentDestroy']);


    // Assuming you still want the resource route for soft-deleted tasks
    Route::resource('soft-deleted', TaskController::class);
});
