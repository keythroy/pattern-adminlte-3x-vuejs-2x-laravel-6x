<?php

namespace App\Http\Controllers\AdminLTE\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\AdminLTE\AdminLTE;
use App\AdminLTE\AdminLTEUser;

class AdminLTEWidgetController extends Controller
{

    public function get(Request $request)
    {
        $list = [];

        $parameters = $request->route()->parameters();

        $pageName = isset($parameters['pageName'])
                ? htmlspecialchars($parameters['pageName'])
                : '';

        $adminLTE = new AdminLTE();

        $Widgets = $adminLTE->getPageLayout($pageName);

        $countWidgets = count($Widgets);
        $index = 0;

        for ($i=0; $i < $countWidgets; $i++) { 
            $Widget = $Widgets[$i];

            $list[$index]['id'] = ($index + 1);
            $list[$index]['type'] = $Widget['type'];
            $list[$index]['model'] = $Widget['model'];
            $list[$index]['text'] = $Widget['text'];
            $list[$index]['href'] = config('adminlte.main_folder') . '/' . $Widget['href'];

            $sizeCSV = $Widget['size'];
            $sizes = explode(',', $sizeCSV);

            $list[$index]['size'] = 'col-lg-' . $sizes[0] . ' col-md-' . $sizes[1] . ' col-xs-' . $sizes[2];
            $list[$index]['visibility'] = $Widget['visibility'];
            $list[$index]['order'] = $Widget['order'];
            $list[$index]['icon'] = $Widget['icon'];
            $list[$index]['iconbackground'] = $Widget['iconbackground'];
            $list[$index]['limit'] = $Widget['limit'];
            $list[$index]['onlylastrecord'] = $Widget['onlylastrecord'];
            $list[$index]['columns'] = $Widget['columns'];
            $list[$index]['values'] = $Widget['values'];

            $index++;
        } // for ($i=0; $i < $countWidgets; $i++) {

        return $list;
    }

}
