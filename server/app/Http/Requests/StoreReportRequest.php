<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'title' => 'required|string|max:32',
            'content' => ['required', 'string', 'min:16']
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'Title is required!',
            'title.string' => 'Title MUST BE valid string!',
            'title.min' => 'Title MUST BE at most :max chars!',

            'content.required' => 'Content is required!',
            'content.string' => 'Content MUST BE valid string!',
            'content.min' => 'Content MUST BE at least :min chars!',
        ];
    }
}
