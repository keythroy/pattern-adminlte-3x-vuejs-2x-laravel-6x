<?php

namespace App\Http\Controllers\AdminLTE\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\AdminLTE;
use App\AdminLTEUser;

class LoginController extends Controller
{

    public function post(LoginFormRequest $request)
    {
        $request->parameters['email']

        $adminLTEUser = AdminLTEUser::where('email', $this->row['email'])
                ->first();

        auth()->guard('adminlteuser')->login($adminLTEUser);
    }

}
