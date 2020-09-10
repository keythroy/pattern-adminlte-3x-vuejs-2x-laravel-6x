<?php

namespace App\Http\Controllers\AdminLTE\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\AdminLTE\AdminLTE;
use App\AdminLTE\AdminLTEModelOption;

class AdminLTEModelOptionController extends Controller
{
    public function get_dropdown_option_list(Request $request)
    {    
        $list = [];
        
        $parameters = $request->route()->parameters();

        $model = isset($parameters['model'])
            ? strtolower(htmlspecialchars($parameters['model']))
            : '';
            
        if ('' == $model) {
            return;
        } // if ('' == $model) {

        $property = isset($parameters['property'])
            ? htmlspecialchars($parameters['property'])
            : '';

        if ('' == $property) {
            return;
        } // if ('' == $property) {
        
        $objectList = AdminLTEModelOption::where('deleted', false)
            ->where('model', $model)
            ->where('property', $property)
            ->orderBy('title', 'asc')
            ->get();

        $object = NULL;
        $index = 0;

        foreach ($objectList as $object)
        {

            $list[$index]['id'] = $object->id;
            $list[$index]['text'] = $object->title;

            $index++;
        } // foreach ($objectList as $object)

        return [
            'list' => $list
        ];
    }

    public function get_model_option_list(Request $request)
    {    
        $list = [];
        
        $parameters = $request->route()->parameters();

        $model = isset($parameters['model'])
            ? htmlspecialchars($parameters['model'])
            : '';
            
        if ('' == $model) {
            return;
        } // if ('' == $model) {

        $display_property = isset($parameters['display_property'])
            ? htmlspecialchars($parameters['display_property'])
            : '';

        if ('' == $display_property) {
            return;
        } // if ('' == $display_property) {
        
        $modelNameWithNamespace = ('\\App\\AdminLTE\\' . $model);

        if (!class_exists($modelNameWithNamespace)) {
            $modelNameWithNamespace = ('\\App\\' . $model);
        }

        $objectList = $modelNameWithNamespace::where('deleted', false)
            ->orderBy($display_property, 'asc')
            ->get();

        $objectAdminLTE = new AdminLTE();
        $object = NULL;
        $index = 0;

        foreach ($objectList as $object)
        {
            $displayTexts = $objectAdminLTE->getObjectDisplayTexts($model, $object);

            $list[$index]['id'] = $object->id;
            $list[$index]['text'] = $displayTexts[$display_property];

            $index++;
        } // foreach ($objectList as $object)

        return [
            'list' => $list
        ];
    }
}