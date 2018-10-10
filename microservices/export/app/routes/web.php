<?php

namespace App;
/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->get('/exportToCsv', function () use ($router) {
    $users = User::all();

    $csvExporter = new \Laracsv\Export();

    return $csvExporter->build($users, ['id', 'username', 'password'])->download();
});
