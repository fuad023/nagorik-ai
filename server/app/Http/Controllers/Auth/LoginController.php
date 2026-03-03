<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function store(LoginRequest $request)
    {
        $request->authenticate();
        $user = $request->user();
        $token = $user->createToken('main')->plainTextToken;
        return [
            'user' => new UserResource($user),
            'token' => $token,
        ];
    }

    public function destroy(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response()->noContent();
    }
}
